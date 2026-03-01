"use client";

import { useUserProfileQuery } from "@/entities/user/model/useUserProfileQuery";
import { useForm } from "react-hook-form";
import { EditUserProfileFormValues } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditUserProfileSchema } from "./schema";
import { useEffect, useMemo } from "react";
import { uploadImageToS3 } from "@/shared/lib/uploadImageToS3";
import { EditUserProfileRequest } from "@/entities/user/api/edit-user/types";
import { editUserProfile } from "@/entities/user/api/edit-user";
import { useQueryClient } from "@tanstack/react-query";
import { ProfileToastType } from "@/shared/lib/toastMessageType";
import { captureException } from "@sentry/nextjs";

export function useEditUserProfile() {
  const { profile, isLoading, isError } = useUserProfileQuery();
  const queryClient = useQueryClient();

  const defaultValues: EditUserProfileFormValues = {
    nickname: "",
    leaderIntro: "",
    memberIntro: "",
    profileImageFile: undefined,
    profileImagePath: "",
    profileImageKey: "",
  };

  const defaultUserProfile: EditUserProfileFormValues = useMemo(() => {
    return {
      nickname: profile?.nickname ?? "",
      leaderIntro: profile?.leaderIntro ?? "",
      memberIntro: profile?.memberIntro ?? "",
      profileImageFile: undefined,
      profileImagePath: profile?.profileImagePath ?? "",
      profileImageKey: profile?.profileImageKey ?? "",
    };
  }, [profile]);

  const editUserProfileForm = useForm<EditUserProfileFormValues>({
    resolver: zodResolver(EditUserProfileSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (!profile) return;
    editUserProfileForm.reset(defaultUserProfile);
  }, [profile, editUserProfileForm, defaultUserProfile]);

  const handleSubmit = async (): Promise<{ type: ProfileToastType }> => {
    let result: { type: ProfileToastType } = { type: "NOOP" };
    if (!profile) return { type: "ERROR" };

    const values = editUserProfileForm.getValues();

    try {
      const hasTextChanged =
        values.nickname !== (profile.nickname ?? "") ||
        values.leaderIntro !== (profile.leaderIntro ?? "") ||
        values.memberIntro !== (profile.memberIntro ?? "");
      const hasImageChanged = values.profileImageFile instanceof File;

      if (!hasTextChanged && !hasImageChanged) {
        return { type: "NOOP" };
      }

      const profileImageFile = values.profileImageFile as File | undefined;
      let profileImageKey = values.profileImageKey;
      if (profileImageFile) {
        const { key } = await uploadImageToS3({ file: profileImageFile, directory: "PROFILE" });
        profileImageKey = key;

        editUserProfileForm.setValue("profileImageKey", key, { shouldDirty: true });
      }

      const request: EditUserProfileRequest = {
        nickname: values.nickname,
        profileImagePath: profileImageKey,
        leaderIntro: values.leaderIntro ?? undefined,
        memberIntro: values.memberIntro ?? undefined,
      };

      const editUserProfileResponse = await editUserProfile(request);
      queryClient.setQueryData(["profile"], editUserProfileResponse);

      result = { type: "SUCCESS" };
    } catch (error) {
      captureException(error, { tags: { feature: "edit-user-profile" } });
      result = { type: "ERROR" };
    }
    return result;
  };

  return { editUserProfileForm, handleSubmit, profile, isLoading, isError };
}
