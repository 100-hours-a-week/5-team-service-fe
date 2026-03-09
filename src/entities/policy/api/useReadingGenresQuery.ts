"use client";

import { useQuery } from "@tanstack/react-query";
import fetchReadingGenres from "./fetchReadingGenres";
import type { PolicyOption } from "../model/types";

type UseReadingGenresQueryParams = {
  initialData?: PolicyOption[];
};

export const useReadingGenresQuery = ({ initialData }: UseReadingGenresQueryParams = {}) => {
  const {
    data: genres,
    isLoading,
    isError,
  } = useQuery<PolicyOption[]>({
    queryKey: ["policy", "/policies/reading-genres"],
    queryFn: fetchReadingGenres,
    initialData,
    staleTime: 1000 * 60 * 60,
  });

  return { genres, isLoading, isError };
};
