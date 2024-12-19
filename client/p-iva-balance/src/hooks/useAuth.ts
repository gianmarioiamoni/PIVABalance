import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, User } from '../services/authService';
import { useLocalStorage } from './useLocalStorage';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [token, setToken, isLoaded] = useLocalStorage('token');
  
  const { data: user, isLoading, refetch } = useQuery<User | null>({
    queryKey: ['auth'],
    queryFn: async () => {
      const result = await authService.checkAuth();
      return result;
    },
    enabled: isLoaded && !!token,
    retry: false,
    staleTime: 0, // Disable stale time to always refetch
  });

  const checkAuth = useCallback(async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ['auth'] });
      const result = await refetch();
      return result.data;
    } catch (error) {
      console.error('Auth check failed:', error);
      return null;
    }
  }, [queryClient, refetch]);

  const logout = useCallback(async () => {
    setToken(null);
    queryClient.setQueryData(['auth'], null);
    await queryClient.invalidateQueries({ queryKey: ['auth'] });
    router.push('/auth/signin');
  }, [queryClient, setToken, router]);

  const updateToken = useCallback(async (newToken: string) => {
    setToken(newToken);
    queryClient.setQueryData(['auth'], null);
    await queryClient.invalidateQueries({ queryKey: ['auth'] });
    const userData = await checkAuth();
    return userData;
  }, [setToken, queryClient, checkAuth]);

  return {
    user,
    isLoading: !isLoaded || isLoading,
    checkAuth,
    logout,
    refetch,
    setToken: updateToken
  };
}
