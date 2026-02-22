import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/get-user";

export const useUserProfileQuery = () => {
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getUser,
    staleTime: 1000 * 60 * 30,
  });

  return { profile, isLoading, isError };
};
