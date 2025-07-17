import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService, SignUpCredentials } from "@/services/authService";
import { useAuth } from "@/hooks/auth/useAuth";

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
    onError: (error: unknown) => {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : "An error occurred during sign up";

      setError(errorMessage);
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
