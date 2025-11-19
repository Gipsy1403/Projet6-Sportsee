"use client";
import userActivity from "@/src/mocks/userActivity.json"
import { createContext, useState, useContext, useEffect } from "react";

// Création du contexte
const GlobalContextMock = createContext();

export function MockDataProvider({ children }) {
  const [startEndWeek, setStartEndWeek] = useState({
    range: { start: "", end: "" },
    activities: [],
  });

  useEffect(() => {
    // Calcul de la semaine en cours
    const today = new Date();
    const day = today.getDay();
    const diffToMonday = day === 0 ? 6 : day - 1;

    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const start = monday.toISOString().split("T")[0];
    const end = sunday.toISOString().split("T")[0];

    // Simule un fetch pour charger les données du mock
    const loadMockData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // délai simulé
      setStartEndWeek({
        range: { start, end },
        activities: userActivity, // utilise le mock importé
      });
    };

    loadMockData();
  }, []);

  return (
    <GlobalContextMock.Provider value={{ startEndWeek }}>
      {children}
    </GlobalContextMock.Provider>
  );
}

// Hook pour utiliser le contexte facilement
export const useMockData = () => useContext(GlobalContextMock);
