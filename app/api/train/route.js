import { execFileSync } from 'child_process';
import path from 'path';
import fs from 'fs';

export const maxDuration = 300;

export async function POST(request) {
  try {
    const { csvPath, outputPath } = await request.json();

    if (!csvPath) {
      return Response.json({ error: 'csvPath is required' }, { status: 400 });
    }

    const fullCsvPath = path.join(process.cwd(), csvPath);
    const finalOutputPath = path.join(
      process.cwd(),
      outputPath || 'trained_models.json'
    );

    if (!fs.existsSync(fullCsvPath)) {
      return Response.json(
        { error: 'CSV file not found', path: fullCsvPath },
        { status: 404 }
      );
    }

    const output = execFileSync(
      'python',
      [
        path.join(process.cwd(), 'scripts/train_models.py'),
        fullCsvPath,
        finalOutputPath,
      ],
      {
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024,
      }
    );

    if (!fs.existsSync(finalOutputPath)) {
      throw new Error('Output file not created');
    }

    const trainedData = JSON.parse(fs.readFileSync(finalOutputPath, 'utf-8'));

    return Response.json({
      status: 'success',
      trainedModels: trainedData,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const modelPath = path.join(process.cwd(), 'trained_models.json');

    if (!fs.existsSync(modelPath)) {
      return Response.json({ status: 'not_trained' });
    }

    const trainedData = JSON.parse(fs.readFileSync(modelPath, 'utf-8'));

    return Response.json({
      status: 'trained',
      trainedModels: trainedData,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}