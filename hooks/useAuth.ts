"use client"


import { getMeAction } from "@/src/app/(commonRoute)/(auth)/_actions/getme.action";
import { logoutAction } from "@/src/app/(commonRoute)/(auth)/_actions/logout.action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
    const queryClient = useQueryClient();

    const { data: user, isLoading } = useQuery({
        queryKey: ["me"],
        queryFn: () => getMeAction(),
        staleTime: 5 * 60 * 1000,
        retry: false,
    });

    const { mutateAsync: logout, isPending: isLoggingOut } = useMutation({
        mutationFn: () => logoutAction(),
        onSuccess: () => {
            queryClient.setQueryData(["me"], null);
        },
    });

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
        isLoggingOut,
    };
}