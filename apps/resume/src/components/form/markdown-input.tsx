import { Button } from "@/components/button";
import Markdown from "@/components/markdown";
import Textarea from "@/components/textarea";
import cn from "@/utils/class-name";
import type { Updater } from "@tanstack/react-form";
import { type ChangeEvent, useState } from "react";

const MarkdownInput = ({
	name,
	rows,
	value,
	label,
	onChange,
	className,
	placeholder,
	...props
}: {
	name: string;
	label: string;
	rows?: number;
	className?: string;
	placeholder?: string;
	value?: string | number;
	onChange: (updater: Updater<string>) => void;
}) => {
	const [isPreview, setIsPreview] = useState(false);
	const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = event.target;
		onChange(value);
	};

	const togglePreview = () => {
		setIsPreview((prevState) => !prevState);
	};

	return (
		<div
			className={cn(
				"grid grid-cols-2 gap-4 border-dashed items-center",
				className,
			)}
			data-testid={`TextInput-${name}`}
		>
			<label htmlFor={name} className="text-sm text-gray-400 col-span-1">
				{label}:
			</label>
			<div className="col-span-1 flex justify-end items-center">
				<span className="text-sm text-[--ghost] mr-2">Preview Mode:</span>

				<Button
					size="xs"
					variant={isPreview ? "default" : "outline"}
					className="self-end"
					onClick={togglePreview}
				>
					{isPreview ? "On" : "Off"}
				</Button>
			</div>
			<div className="col-span-2">
				{isPreview ? (
					<Markdown data-testid="Markdown" className="grid gap-4">
						{value as string}
					</Markdown>
				) : (
					<Textarea
						name={name}
						rows={rows}
						value={value}
						className="col-span-4"
						onChange={handleChange}
						placeholder={placeholder}
						{...props}
					/>
				)}
			</div>
		</div>
	);
};

export default MarkdownInput;
