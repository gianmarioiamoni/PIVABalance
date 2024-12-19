import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService, SignUpCredentials } from "@/services/authService";
import { useAuth } from "./useAuth";

export function useSignUp() {
  const router = useRouter();
  const { setToken } = useAuth();
  const [error, setError] = useState("");

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: (credentials: SignUpCredentials) =>
      authService.signUp(credentials),
    onSuccess: async (data) => {
      await setToken(data.token);
      router.push("/dashboard");
    },
    onError: (error: any) => {
      setError(
        error.response?.data?.message || "An error occurred during sign up"
      );
    },
  });

  const handleSubmit = async (credentials: SignUpCredentials) => {
    setError("");
    signUp(credentials);
  };

  return {
    signUp: handleSubmit,
    isLoading: isPending,
    error,
  };
}
