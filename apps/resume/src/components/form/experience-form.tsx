import { DialogContent, DialogHeader, DialogTitle } from "@/components/dialog";
import CalendarInput, {
	type OnChangeType,
} from "@/components/form/calendar-input";
import Textarea from "@/components/form/markdown-input";
import Select from "@/components/form/select-input";
import TextInput from "@/components/form/text-input";
import type { FieldComponent } from "@tanstack/react-form";
import type { PropsWithChildren } from "react";
import type { Experience } from "~/apps/server/src/types/drizzle";

const ExperienceForm = ({
	Field,
	children,
	onSubmit,
	label = "Add Experience",
}: PropsWithChildren & {
	label?: string;
	Field: FieldComponent<Experience>;
	onSubmit: () => Promise<void>;
}) => {
	return (
		<DialogContent className="max-h-[90vh] overflow-y-auto">
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					e.stopPropagation();
					await onSubmit();
				}}
			>
				<DialogHeader className="mb-4">
					<DialogTitle>{label}</DialogTitle>
				</DialogHeader>

				<div className="grid grid-cols-4 gap-4">
					<Field name="role">
						{({ state: { value }, handleChange, handleBlur }) => {
							return (
								<TextInput
									label={"Role"}
									value={value || ""}
									onBlur={handleBlur}
									onChange={handleChange}
									name="role"
									className="border-b-2 grid-cols-[auto_1fr] col-span-4 w-full"
								/>
							);
						}}
					</Field>

					<Field name="company">
						{({ state: { value }, handleChange, handleBlur }) => {
							return (
								<TextInput
									label={"Company"}
									value={value || ""}
									onBlur={handleBlur}
									onChange={handleChange}
									name="company"
									className="border-b-2 grid-cols-[auto_1fr] col-span-4 w-full"
								/>
							);
						}}
					</Field>

					<Field name="workStyle">
						{({ state: { value }, handleChange }) => {
							return (
								<Select
									value={value as Experience["workStyle"]}
									name="workStyle"
									label="Work Style"
									onChange={handleChange}
									className="col-span-2"
									options={[
										{ value: "in-office", label: "In Office" },
										{ value: "hybrid", label: "Hybrid" },
										{ value: "remote", label: "Remote" },
									]}
								/>
							);
						}}
					</Field>

					<Field name="location">
						{({ state: { value }, handleChange, handleBlur }) => {
							return (
								<TextInput
									label={"Location"}
									value={value || ""}
									onBlur={handleBlur}
									onChange={handleChange}
									name="location"
									className="border-b-2 grid-cols-[auto_1fr] col-span-2 w-full"
								/>
							);
						}}
					</Field>

					<Field name="startDate">
						{({ state: { value }, handleChange }) => {
							return (
								<CalendarInput
									value={value}
									name="startDate"
									label="Start Date"
									className="col-span-2"
									onChange={handleChange as OnChangeType}
								/>
							);
						}}
					</Field>

					<Field name="endDate">
						{({ state: { value }, handleChange }) => {
							return (
								<CalendarInput
									value={value}
									name="endDate"
									label="End Date"
									onChange={handleChange}
									className="col-span-2"
								/>
							);
						}}
					</Field>

					<Field name="body">
						{({ state: { value }, handleChange }) => {
							return (
								<Textarea
									rows={10}
									name="body"
									label="Body"
									value={value}
									className="col-span-4"
									onChange={handleChange}
								/>
							);
						}}
					</Field>
				</div>
				{children}
			</form>
		</DialogContent>
	);
};

export default ExperienceForm;
