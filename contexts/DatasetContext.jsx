'use client';

import React, { createContext, useContext, useState } from 'react';

const DatasetContext = createContext();

export function DatasetProvider({ children }) {
  const [dataset, setDataset] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const loadDataset = (data) => {
    setDataset(data);
    setIsDataLoaded(true);
  };

  const clearDataset = () => {
    setDataset(null);
    setIsDataLoaded(false);
  };

  return (
    <DatasetContext.Provider value={{ dataset, isDataLoaded, loadDataset, clearDataset }}>
      {children}
    </DatasetContext.Provider>
  );
}

export function useDataset() {
  const context = useContext(DatasetContext);
  if (!context) {
    throw new Error('useDataset must be used within DatasetProvider');
  }
  return context;
}
