"use client";
import type { Monaco } from "monacopilot";
import { createContext, type ReactNode, useContext, useState } from "react";

interface MonacoContextType {
  monaco: Monaco | null;
  setMonaco: (monaco: Monaco) => void;
}

const MonacoContext = createContext<MonacoContextType | undefined>(undefined);

export const useMonaco = (): MonacoContextType => {
  const context = useContext(MonacoContext);
  if (!context) {
    throw new Error("useMonaco must be used within a MonacoProvider");
  }
  return context;
};

interface MonacoProviderProps {
  children: ReactNode;
}

export const MonacoProvider = ({ children }: MonacoProviderProps) => {
  const [monaco, setMonacoState] = useState<Monaco | null>(null);

  const setMonaco = (monacoInstance: Monaco) => {
    setMonacoState(monacoInstance);
  };

  return (
    <MonacoContext.Provider value={{ monaco, setMonaco }}>
      {children}
    </MonacoContext.Provider>
  );
};
