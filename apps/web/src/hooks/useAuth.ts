import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as authService from "../services/authService";

export function useAuth() {
  const queryClient = useQueryClient();
  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: authService.getMe,
    retry: false,
    throwOnError: false
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => authService.login(email, password),
    onSuccess: (data) => queryClient.setQueryData(["me"], data)
  });

  const registerMutation = useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) =>
      authService.registerUser(name, email, password),
    onSuccess: (data) => queryClient.setQueryData(["me"], data)
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => queryClient.setQueryData(["me"], { user: null })
  });

  return {
    user: meQuery.data?.user ?? null,
    isLoading: meQuery.isLoading,
    isAuthenticated: Boolean(meQuery.data?.user),
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    loginError: loginMutation.error,
    registerError: registerMutation.error
  };
}
