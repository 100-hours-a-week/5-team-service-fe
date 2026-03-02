"use client";

import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import { Calendar } from "../shadcn/calendar";

type DatePickerInputProps = {
  id: string;
  value?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  onChange: (next: string) => void;
};

export default function DatePickerInput({
  id,
  value,
  placeholder = "날짜를 선택해주세요.",
  minDate,
  maxDate,
  onChange,
}: DatePickerInputProps) {
  const selected = value ? parseISO(value) : undefined;
  const disabledDates =
    minDate && maxDate
      ? [{ before: minDate }, { after: maxDate }]
      : minDate
        ? { before: minDate }
        : maxDate
          ? { after: maxDate }
          : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-left text-sm text-gray-900 transition hover:border-gray-300"
        >
          <span className={selected ? "text-gray-900" : "text-gray-400"}>
            {selected ? format(selected, "yyyy. MM. dd.") : placeholder}
          </span>
          <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto overflow-hidden p-0">
        <Calendar
          mode="single"
          selected={selected}
          locale={ko}
          weekStartsOn={0}
          onSelect={(date) => {
            onChange(date ? format(date, "yyyy-MM-dd") : "");
          }}
          disabled={disabledDates}
          className="p-2"
        />
      </PopoverContent>
    </Popover>
  );
}
