import CreateChatPage from "@/views/create-chat/ui/Page";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ step: string }>;
};

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const parsedStep = Number(resolvedParams.step);

  if (parsedStep !== 1 && parsedStep !== 2) {
    notFound();
  }

  return <CreateChatPage step={parsedStep} />;
}
