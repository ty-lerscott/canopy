import { Slider } from "@/components/slider";
import cn from "@/utils/class-name";
import type { Updater } from "@tanstack/react-form";
import { useState } from "react";

const RangeInput = ({
	name,
	label,
	onChange,
	className,
	defaultValue = 0,
}: {
	name: string;
	label: string;
	className?: string;
	defaultValue?: number;
	onChange: (updater: Updater<number>) => void;
}) => {
	const [value, setValue] = useState(defaultValue);

	const handleDisplayValue = (val: number[]) => {
		setValue(val[0]);
	};

	return (
		<div
			className={cn(
				"grid grid-cols-[auto_1fr_auto] gap-4 border-dashed items-center",
				className,
			)}
			data-testid={`TextInput-${name}`}
		>
			<label htmlFor={name} className="text-sm text-gray-400">
				{label}:
			</label>
			<Slider
				step={1}
				max={10}
				defaultValue={[defaultValue]}
				onValueChange={handleDisplayValue}
				onValueCommit={(val) => onChange(val[0])}
			/>
			<span className="text-[--ghost] text-sm">{value} / 10</span>
		</div>
	);
};

export default RangeInput;
