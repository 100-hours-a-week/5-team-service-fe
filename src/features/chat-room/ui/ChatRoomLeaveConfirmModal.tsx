type ChatRoomLeaveConfirmModalProps = {
  isOpen: boolean;
  isLeaving: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ChatRoomLeaveConfirmModal({
  isOpen,
  isLeaving,
  onClose,
  onConfirm,
}: ChatRoomLeaveConfirmModalProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-6 transition-opacity duration-200 ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <button
        type="button"
        aria-label="모달 닫기"
        onClick={onClose}
        disabled={!isOpen || isLeaving}
        className={`absolute inset-0 transition-colors duration-200 ${
          isOpen ? "bg-black/40" : "bg-black/0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full max-w-[360px] rounded-2xl bg-white px-6 py-10 shadow-[0_24px_60px_rgba(15,23,42,0.18)] transition-all duration-200 ${
          isOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-1 scale-95 opacity-0"
        }`}
      >
        <h2 className="text-center text-subheading text-gray-900">정말 나가시겠습니까?</h2>
        <p className="mt-2 text-center text-label text-gray-500">퇴장시 재입장이 불가능합니다.</p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLeaving}
            className="h-10 min-w-[96px] rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLeaving}
            className="h-10 min-w-[96px] rounded-lg bg-primary px-4 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isLeaving ? "나가는 중..." : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
}
