import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authService, User } from "@/services/authService";
import { useLocalStorage } from "./useLocalStorage";
import { useRouter } from "next/navigation";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [token, setToken, isLoaded] = useLocalStorage("token");

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery<User | null>({
    queryKey: ["auth"],
    queryFn: async () => {
      if (!token) return null;
      const result = await authService.checkAuth();
      return result;
    },
    enabled: isLoaded,
    retry: false,
    staleTime: 0,
  });

  const checkAuth = useCallback(async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      const result = await refetch();
      return result.data;
    } catch (error) {
      console.error("Auth check failed:", error);
      return null;
    }
  }, [queryClient, refetch]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setToken(null);
      queryClient.setQueryData(["auth"], null);
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/auth/signin");
    }
  }, [queryClient, setToken, router]);

  const updateToken = useCallback(
    async (newToken: string) => {
      setToken(newToken);
      queryClient.setQueryData(["auth"], null);
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      const userData = await checkAuth();
      return userData;
    },
    [setToken, queryClient, checkAuth]
  );

  return {
    user,
    isLoading: !isLoaded || isLoading,
    checkAuth,
    logout,
    refetch,
    setToken: updateToken,
  };
}
