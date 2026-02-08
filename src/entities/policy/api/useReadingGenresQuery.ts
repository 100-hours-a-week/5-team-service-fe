"use client";

import { useQuery } from "@tanstack/react-query";
import fetchReadingGenres from "./fetchReadingGenres";

export const useReadingGenresQuery = () => {
  const {
    data: genres,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["policy", "reading-genres"],
    queryFn: fetchReadingGenres,
    staleTime: 1000 * 60 * 60,
  });

  return { genres, isLoading, isError };
};
