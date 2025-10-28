import { useEffect, useState } from 'react';
import { initDB, addCount, getCounts, getSummary, seedDatabase } from '@/services/database';

export const useDatabase = () => {
  const [isDBLoading, setIsDBLoading] = useState(true);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initDB();
        // Não espere o povoamento ser concluído para exibir a UI
        seedDatabase(); 
      } catch (error) {
        console.error("DB initialization error:", error);
      } finally {
        setIsDBLoading(false);
      }
    };

    setupDatabase();
  }, []);

  return {
    isDBLoading,
    addCount,
    getCounts,
    getSummary,
  };
};
