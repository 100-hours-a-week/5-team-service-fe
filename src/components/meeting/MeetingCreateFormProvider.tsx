"use client";

import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CreateMeetingSchema,
  createMeetingDefaultValues,
  type CreateMeetingFormValues,
} from "@/components/meeting/createMeetingSchema";
import { useMeetingCreateStore } from "@/stores/meetingCreateStore";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/apiFetch";
import { ProfileData } from "../onboarding/types";

export default function MeetingCreateFormProvider({ children }: { children: React.ReactNode }) {
  
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const profile = await apiFetch<ProfileData>("/users/me", {});
      return profile;
    },
  });
  
  const initialValues = useMemo(() => {
    const stored = useMeetingCreateStore.getState();
    return {
      ...createMeetingDefaultValues,
      ...stored,
      leaderIntro: profile?.leaderIntro,
      readingGenreId: stored.readingGenreId ?? createMeetingDefaultValues.readingGenreId,
      meetingImageFile: stored.meetingImageFile ?? undefined,
    } as CreateMeetingFormValues;
  }, [profile]);

  const form = useForm<CreateMeetingFormValues>({
    mode: "onChange",
    resolver: zodResolver(CreateMeetingSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    const subscription = form.watch(() => {
      const values = form.getValues();
      useMeetingCreateStore.getState().setAll({
        ...values,
        meetingImageFile: values.meetingImageFile ?? null,
      });
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return <FormProvider {...form}>{children}</FormProvider>;
}
