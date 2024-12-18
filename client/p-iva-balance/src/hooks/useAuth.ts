import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, User } from '../services/authService';
import { useLocalStorage } from './useLocalStorage';

export function useAuth() {
  const queryClient = useQueryClient();
  const [token, setToken, isLoaded] = useLocalStorage('token');
  
  const { data: user, isLoading, refetch } = useQuery<User | null>({
    queryKey: ['auth'],
    queryFn: authService.checkAuth,
    enabled: isLoaded && !!token,
    retry: false,
    staleTime: Infinity, // Only refetch when we explicitly invalidate
  });

  const checkAuth = useCallback(async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ['auth'] });
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  }, [queryClient]);

  const logout = useCallback(async () => {
    setToken(null);
    await queryClient.invalidateQueries({ queryKey: ['auth'] });
  }, [queryClient, setToken]);

  return {
    user,
    isLoading: !isLoaded || isLoading,
    checkAuth,
    logout,
    refetch,
    setToken
  };
}
