import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService, SignInCredentials } from '@/services/authService';
import { useAuth } from '@/hooks/auth/useAuth';

export function useSignIn() {
  const router = useRouter();
  const { setToken } = useAuth();
  const [error, setError] = useState('');

  const { mutate: signIn, isPending } = useMutation({
    mutationFn: async (credentials: SignInCredentials) => {
      const result = await authService.signIn(credentials);
      return result;
    },
    onSuccess: async (data) => {
      const userData = await setToken(data.token);
      
      if (userData) {
        router.push('/dashboard');
      } else {
        console.error('No user data after setting token');
        setError('Failed to get user data');
      }
    },
    onError: (error: any) => {
      console.error('Sign in error:', error);
      setError(error.response?.data?.message || 'An error occurred during sign in');
    },
  });

  const handleSubmit = async (credentials: SignInCredentials) => {
    setError('');
    signIn(credentials);
  };

  return {
    signIn: handleSubmit,
    isLoading: isPending,
    error,
  };
}
