"use client";

type ModalProps = {
  isOpen: boolean;
  isClosing: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  cancelLabel?: string;
  closeOnBackdropClick?: boolean;
};

export default function Modal({
  isOpen,
  isClosing,
  title,
  description,
  confirmLabel,
  onConfirm,
  onClose,
  cancelLabel,
  closeOnBackdropClick = true,
}: ModalProps) {
  const shouldRender = isOpen || isClosing;

  if (!shouldRender) return null;

  const isVisible = isOpen && !isClosing;

  return (
    <div
      className={`fixed inset-y-0 left-1/2 z-50 flex w-full max-w-[500px] -translate-x-1/2 items-center justify-center px-6 transition-opacity duration-200 ${
        isVisible ? "animate-in fade-in duration-200" : "animate-out fade-out duration-200"
      }`}
      aria-modal="true"
      role="dialog"
    >
      <button
        type="button"
        aria-label="닫기"
        onClick={closeOnBackdropClick ? onClose : undefined}
        className="absolute inset-0 bg-black/30"
      />

      <div
        className={`relative w-full max-w-[360px] rounded-2xl bg-white px-6 py-8 text-center shadow-[0_24px_60px_rgba(15,23,42,0.18)] transition-all duration-200 ${
          isVisible
            ? "animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200"
            : "animate-out fade-out zoom-out-95 slide-out-to-bottom-2 duration-200"
        }`}
      >
        <h2 className="text-subheading text-gray-900">{title}</h2>
        {description ? <p className="mt-3 text-label text-gray-500">{description}</p> : null}

        <div className={`mt-7 grid gap-3 ${cancelLabel ? "grid-cols-2" : "grid-cols-1"}`}>
          {cancelLabel ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-600"
            >
              {cancelLabel}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-primary py-2.5 text-sm font-semibold text-white"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
