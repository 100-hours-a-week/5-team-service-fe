import Spinner from "./Spinner";

export default function FullScreenSpinner({ label }: { label?: string }) {
  return (
    <div className="min-h-dvh bg-gray-100">
      <main className="mx-auto min-h-dvh w-full max-w-[500px] bg-gray-100/30 shadow-lg">
        <div className="flex min-h-dvh items-center justify-center pb-[env(safe-area-inset-bottom)]">
          <div className="flex flex-col gap-5 justify-center items-center">
            <Spinner className="size-10 text-primary-purple" />
            {label ? <div className="text-label">{label}</div> : null}
          </div>
        </div>
      </main>
    </div>
  );
}
