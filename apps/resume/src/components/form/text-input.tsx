import cn from "@/utils/class-name";
import type { Updater } from "@tanstack/react-form";
import type { FocusEvent } from "react";

const TextInput = ({
	name,
	value,
	label,
	onBlur,
	onChange,
	className,
	type = "text",
	defaultValue,
}: {
	name: string;
	label: string;
	type?: string;
	className?: string;
	defaultValue?: string;
	value?: string | number;
	onChange: (updater: Updater<string>) => void;
	onBlur: (e: FocusEvent<HTMLInputElement, HTMLInputElement>) => void;
}) => {
	return (
		<div
			className={cn(
				"grid grid-cols-2 gap-4 border-dashed items-center",
				className,
			)}
			data-testid={`TextInput-${name}`}
		>
			<label htmlFor={name} className="text-sm text-gray-400">
				{label}:
			</label>
			<input
				id={name}
				type={type}
				name={name}
				value={value}
				onBlur={onBlur}
				defaultValue={defaultValue}
				autoComplete="off"
				autoCorrect="off"
				autoCapitalize="none"
				className="px-2 py-1 text-[--primary] bg-transparent"
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	);
};

export default TextInput;
