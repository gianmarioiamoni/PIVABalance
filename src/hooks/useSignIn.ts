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
    onError: (error: unknown) => {
      console.error('Sign in error:', error);
      const errorMessage = 
        (error && typeof error === 'object' && 'response' in error && 
         error.response && typeof error.response === 'object' && 'data' in error.response &&
         error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data &&
         typeof error.response.data.message === 'string')
        ? error.response.data.message
        : 'An error occurred during sign in';
      
      setError(errorMessage);
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
