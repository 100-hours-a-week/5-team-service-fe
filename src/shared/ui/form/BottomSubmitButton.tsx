type BottomSubmitButtonProps = {
  submitLabel?: string;
  cancleLabel?: string;
  type?: "button" | "submit";
  variant: "single" | "dual";
  onClickSubmit?: () => void;
  onClickCancel?: () => void;
  disabled?: boolean;
};

export const BottomSubmitButton = ({
  submitLabel = "다음",
  cancleLabel = "이전",
  type = "submit",
  variant = "single",
  onClickSubmit,
  onClickCancel,
  disabled = false,
}: BottomSubmitButtonProps) => {
  return (
    <div className="w-full mt-auto">
      <div className="flex gap-3">
        {variant == "dual" ? (
          <button
            className="w-full bg-gray-200 rounded-lg text-gray-blue text-body-2 py-3 disabled:bg-gray-300"
            type="button"
            onClick={onClickCancel}
          >
            {cancleLabel}
          </button>
        ) : null}
        <button
          className="w-full bg-primary-purple rounded-lg text-white text-body-2 py-3 disabled:bg-gray-300"
          type={type}
          onClick={onClickSubmit}
          disabled={disabled}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
};
