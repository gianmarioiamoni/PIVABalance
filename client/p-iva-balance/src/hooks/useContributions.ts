import { useState, useEffect } from 'react';
import { YearlyContributions, contributionsService } from '@/services/contributionsService';

export function useContributions(year: number) {
  const [contributions, setContributions] = useState<YearlyContributions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContributions = async () => {
    try {
      setLoading(true);
      const data = await contributionsService.getContributionsByYear(year);
      setContributions(data);
      setError(null);
    } catch (err) {
      // Only set error for unexpected errors, not for 404
      if (!(err instanceof Error && err.message === 'Request failed with status code 404')) {
        setError('Errore nel caricamento dei contributi');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContributions();
  }, [year]);

  const saveContributions = async (contributionsData: number | { year: number; previousYearContributions: number }) => {
    try {
      setLoading(true);
      let updatedContributions;
      
      if (typeof contributionsData === 'number') {
        // Update existing contributions
        updatedContributions = await contributionsService.updateContributions(year, {
          previousYearContributions: contributionsData
        });
      } else {
        // Create new contributions
        updatedContributions = await contributionsService.saveContributions(contributionsData);
      }
      
      setContributions(updatedContributions);
      setError(null);
    } catch (err) {
      setError('Errore nel salvataggio dei contributi');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    contributions,
    loading,
    error,
    saveContributions,
    loadContributions
  };
}
