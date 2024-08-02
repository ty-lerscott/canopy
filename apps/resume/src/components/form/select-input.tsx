import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Select as ShadSelect,
} from "@/components/select";
import cn from "@/utils/class-name";
import type { Updater } from "@tanstack/react-form";

type SelectOption = {
	label: string;
	value: string;
};

type SelectProps<T> = {
	value: T;
	name: string;
	label?: string;
	className?: string;
	options: SelectOption[];
	onChange: (updater: Updater<T>) => void;
};

const Select = <T extends string>({
	name,
	value,
	label,
	options,
	onChange,
	className,
}: SelectProps<T>) => {
	return (
		<div
			className={cn(
				"grid grid-cols-2 gap-4 border-dashed items-center",
				className,
			)}
			data-testid={`SelectInput-${name}`}
		>
			{label ? (
				<label htmlFor={name} className="text-sm text-gray-400">
					{label}:
				</label>
			) : null}

			<ShadSelect
				name={name}
				value={value}
				onValueChange={(val) => onChange(val as T)}
			>
				<SelectTrigger>
					<SelectValue placeholder={value}>
						{options.find((val) => val.value === value)?.label}
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{options.map(({ value, label }) => (
						<SelectItem value={value} key={value}>
							{label}
						</SelectItem>
					))}
				</SelectContent>
			</ShadSelect>
		</div>
	);
};

export default Select;
