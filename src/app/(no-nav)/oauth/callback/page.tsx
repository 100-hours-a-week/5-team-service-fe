import LoginSuccessHandler from "@/components/login/LoginSuccessHandler";

export default function Page() {
  return (
    <div className="min-h-dvh bg-gray-200 p-0">
      <div className="mx-auto h-dvh w-full max-w-[390px] bg-white px-6 py-10 shadow-lg md:max-w-[480px] lg:max-w-[560px] xl:max-w-[600px]">
        <div className="flex h-full flex-col">
          <LoginSuccessHandler />
        </div>
      </div>
    </div>
  );
}
