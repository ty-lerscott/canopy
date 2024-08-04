import { Button } from "@/components/button";
import { Calendar } from "@/components/calendar";
import TextInput from "@/components/form/text-input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import cn from "@/utils/class-name";
import type { FieldComponent } from "@tanstack/react-form";
import dayjs from "dayjs";
import { useState } from "react";
import { IoCalendarNumber as CalendarIcon } from "react-icons/io5";
import type { UserProfile } from "~/apps/server/src/types/drizzle";

const EducationItem = ({
	index,
	Field,
}: {
	index: number;
	Field: FieldComponent<UserProfile>;
}) => {
	const [isPopoverOpen, setIsPopoverOpen] = useState<
		null | "startDate" | "endDate"
	>(null);

	return (
		<div className="grid grid-cols-4 gap-4 items-center [&:not(&:first-of-type)]:mt-4">
			<Field name={`education[${index}].school`}>
				{({ state: { value }, handleChange, handleBlur }) => {
					return (
						<TextInput
							label={"School"}
							value={value || ""}
							onBlur={handleBlur}
							onChange={handleChange}
							name={`education[${index}].school`}
							className="border-b-2 grid-cols-[auto_1fr] col-span-4"
						/>
					);
				}}
			</Field>
			<Field name={`education[${index}].degree`}>
				{({ state: { value }, handleChange, handleBlur }) => {
					return (
						<TextInput
							label={"Degree"}
							value={value || ""}
							onBlur={handleBlur}
							onChange={handleChange}
							name={`education[${index}].degree`}
							className="border-b-2 grid-cols-[auto_1fr] col-span-2"
						/>
					);
				}}
			</Field>
			<Field name={`education[${index}].major`}>
				{({ state: { value }, handleChange, handleBlur }) => {
					return (
						<TextInput
							label={"Major"}
							value={value || ""}
							onBlur={handleBlur}
							onChange={handleChange}
							name={`education[${index}].major`}
							className="border-b-2 grid-cols-[auto_1fr] col-span-2"
						/>
					);
				}}
			</Field>

			<Field name={`education[${index}].startDate`}>
				{({ state: { value }, handleChange }) => {
					const date = value ? dayjs(value).toDate() : undefined;

					return (
						<Popover
							open={isPopoverOpen === "startDate"}
							onOpenChange={(isOpen) => {
								setIsPopoverOpen(isOpen ? "startDate" : null);
							}}
						>
							<PopoverTrigger asChild>
								<Button
									variant={"outline"}
									onClick={() => setIsPopoverOpen("startDate")}
									className={cn(
										"w-full justify-start text-left font-normal col-span-2",
										!date && "text-[--ghost]",
									)}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{date ? (
										dayjs(date).format("MMMM YYYY")
									) : (
										<span>Start Date</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="single"
									toYear={2100}
									selected={date}
									fromYear={1992}
									captionLayout="dropdown-buttons"
									onSelect={(date) => {
										const newDate = new Date(date as Date);

										handleChange(newDate.toISOString());
										setIsPopoverOpen("endDate");
									}}
								/>
							</PopoverContent>
						</Popover>
					);
				}}
			</Field>

			<Field name={`education[${index}].endDate`}>
				{({ state: { value }, handleChange }) => {
					const date = value ? dayjs(value).toDate() : undefined;

					return (
						<Popover
							open={isPopoverOpen === "endDate"}
							onOpenChange={(isOpen) => {
								setIsPopoverOpen(isOpen ? "endDate" : null);
							}}
						>
							<PopoverTrigger asChild>
								<Button
									variant={"outline"}
									onClick={() => setIsPopoverOpen("endDate")}
									className={cn(
										"w-full justify-start text-left font-normal col-span-2",
										!date && "text-[--ghost]",
									)}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{date ? (
										dayjs(date).format("MMMM YYYY")
									) : (
										<span>End Date</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="single"
									selected={date}
									fromYear={1992}
									toYear={2100}
									captionLayout="dropdown-buttons"
									onSelect={(date) => {
										const newDate = new Date(date as Date);

										handleChange(newDate.toISOString());
										setIsPopoverOpen(null);
									}}
								/>
							</PopoverContent>
						</Popover>
					);
				}}
			</Field>
		</div>
	);
};

const Education = ({
	education,
	Field,
}: {
	education: UserProfile["education"];
	Field: FieldComponent<UserProfile>;
}) => {
	return Array.isArray(education) && education.length ? (
		<div className="py-4">
			<Field name="education" mode="array">
				{() => {
					return education.map((item, index) => {
						return <EducationItem key={item.id} Field={Field} index={index} />;
					});
				}}
			</Field>
		</div>
	) : null;
};

export default Education;
