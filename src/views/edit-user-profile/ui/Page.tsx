import PageHeader from "@/components/layout/PageHeader";
import EditUserProfileFormProvider from "@/features/edit-user-profile/ui/EditUserProfileFormProvider";

export default function EditUserProfilePage() {
  return (
    <div className="flex h-dvh min-h-0 flex-col">
      <PageHeader title="프로필 수정" />
      <EditUserProfileFormProvider />
    </div>
  );
}
