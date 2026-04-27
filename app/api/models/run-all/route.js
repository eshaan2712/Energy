import { spawnSync } from "child_process";

export async function POST(request) {
  try {
    const { csv_data } = await request.json();

    if (!csv_data) {
      return Response.json({ error: "csv_data required" }, { status: 400 });
    }

    // CSV → values
    const lines = csv_data.trim().split("\n");
    const headers = lines[0].split(",");

    const valueIndex = headers.findIndex(h =>
      h.toLowerCase().includes("value") ||
      h.toLowerCase().includes("energy")
    );

    const values = lines.slice(1)
      .map(line => parseFloat(line.split(",")[valueIndex]))
      .filter(v => !isNaN(v));

    const input = JSON.stringify({ values });

    const result = spawnSync(
      "python",
      ["D:/energy-full-stack/energy/python_models/run_models.py"],
      {
        input: input,
        encoding: "utf-8",
        maxBuffer: 1024 * 1024 * 10
      }
    );

    console.log("STDOUT:", result.stdout);
    console.error("STDERR:", result.stderr);

    // 🔥 ERROR HANDLING
    console.log("STDOUT:", result.stdout);
    console.warn("STDERR:", result.stderr);

    // 🔥 Only treat REAL errors as failure
    if (
      result.stderr &&
      result.stderr.toLowerCase().includes("traceback")
    ) {
      throw new Error(result.stderr);
    }   

    if (!result.stdout) {
      throw new Error("No output from Python");
    }

    let output;

    try {
      output = JSON.parse(result.stdout);
    } catch (e) {
      throw new Error("Invalid JSON from Python");
    }

    if (output.status === "error") {
      throw new Error(output.message);
    }

    console.log("Optimization:", output.optimization);

    return Response.json(output);

  } catch (error) {
    console.error("API ERROR:", error);

    return Response.json(
      { status: "failed", error: error.message },
      { status: 500 }
    );
  }
}