import { Button } from "@/components/button";
import { Calendar as SHCalendar } from "@/components/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import cn from "@/utils/class-name";
import type { Updater } from "@tanstack/react-form";
import dayjs from "dayjs";
import { useState } from "react";
import { IoCalendarNumber as CalendarIcon } from "react-icons/io5";

export type OnChangeType = (u: Updater<string | undefined>) => void;

const Calendar = ({
	name,
	value,
	label,
	onChange,
	className,
}: {
	name: string;
	value?: string;
	label?: string;
	className?: string;
	onChange: OnChangeType;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const date = value ? dayjs(value) : undefined;

	return (
		<div
			className={cn(
				"grid grid-cols-[auto_1fr] gap-4 border-dashed items-center",
				className,
			)}
			data-testid={`CalendarInput-${name}`}
		>
			{label ? (
				<label htmlFor={name} className="text-sm text-gray-400">
					{label}:
				</label>
			) : null}

			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						onClick={() => setIsOpen(true)}
						className={cn(
							"w-full justify-start text-left font-normal",
							!date && "text-[--ghost]",
						)}
					>
						<CalendarIcon className="mr-2 size-4" />
						{date ? date.format("MMMM YYYY") : <span>{label}</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<SHCalendar
						mode="single"
						toYear={2100}
						fromYear={1992}
						selected={date?.toDate()}
						captionLayout="dropdown-buttons"
						onSelect={(date) => {
							const newDate = new Date(date as Date);

							onChange(newDate.toISOString());
							setIsOpen(false);
						}}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default Calendar;
