import Spinner from "./Spinner";

type FullScreenSpinnerProps = {
  label?: string;
  transparent?: boolean;
};

export default function FullScreenSpinner({ label, transparent = false }: FullScreenSpinnerProps) {
  const outerClassName = transparent ? "min-h-dvh bg-transparent" : "min-h-dvh bg-gray-100";
  const mainClassName = transparent
    ? "mx-auto min-h-dvh w-full max-w-[500px] bg-transparent shadow-none"
    : "mx-auto min-h-dvh w-full max-w-[500px] bg-gray-100/30 shadow-lg";

  return (
    <div className={outerClassName}>
      <main className={mainClassName}>
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
