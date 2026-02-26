import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createChatDefaultValues, CreateChatFormValues } from "./types";

export type CreateChatSelectedBook = {
  title: string;
  authors: string;
  publisher: string;
  thumbnailUrl: string;
  publishedAt: string;
  isbn: string;
};

type CreateChatStore = {
  values: CreateChatFormValues;
  selectedBook: CreateChatSelectedBook | null;
  setAll: (values: CreateChatFormValues) => void;
  setSelectedBook: (book: CreateChatSelectedBook | null) => void;
  reset: () => void;
};

export const useCreateChatStore = create<CreateChatStore>()(
  persist(
    (set) => ({
      values: createChatDefaultValues,
      selectedBook: null,
      setAll: (values) => set({ values }),
      setSelectedBook: (book) =>
        set((state) => ({
          selectedBook: book,
          values: {
            ...state.values,
            isbn: book?.isbn ?? createChatDefaultValues.isbn,
          },
        })),
      reset: () => set({ values: createChatDefaultValues, selectedBook: null }),
    }),
    {
      name: "create-chat-draft",
    },
  ),
);
