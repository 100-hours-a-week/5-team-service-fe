import KakaoLoginButton from "@/components/login/KakaoLoginButton";

export default function Page() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="pointer-events-none absolute -left-28 -top-32 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#F2FBE8_0%,#E6F7D2_40%,rgba(198,239,148,0.25)_70%,rgba(198,239,148,0)_100%)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle_at_40%_40%,#F2FBE8_0%,#E6F7D2_40%,rgba(198,239,148,0.2)_70%,rgba(198,239,148,0)_100%)] blur-3xl" />
      <div className="relative z-10 max-w-xs">
        <h1 className="mt-4 text-title-2  text-gray-900">독토리</h1>
        <p className="mt-4 text-subheading !font-[400] text-gray-900">
          시간·거리 상관없이
          <br />
          오늘의 책 이야기를 시작해요
        </p>
      </div>

      <div className="relative z-10 mt-10 w-full max-w-sm">
        <KakaoLoginButton />
      </div>
    </div>
  );
}
