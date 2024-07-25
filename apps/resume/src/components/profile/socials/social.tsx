import { Button } from "@/components/button";
import TextInput from "@/components/form/text-input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/select";
import cn from "@/utils/class-name";
import { createId } from "@paralleldrive/cuid2";
import type { FieldComponent } from "@tanstack/react-form";
import { useState } from "react";
import type { IconType } from "react-icons";
import {
	TiSocialFacebookCircular,
	TiSocialGithub,
	TiSocialInstagramCircular,
	TiSocialLinkedinCircular,
	TiSocialTwitterCircular,
} from "react-icons/ti";
import type {
	Social as SocialProps,
	UserProfile,
} from "~/apps/api/src/types/drizzle";

type SocialEntry = {
	label: string;
	Icon?: IconType;
};

type SocialType = {
	[key: string]: SocialEntry;
};

const AvailableSocials: SocialType = {
	facebook: {
		label: "Facebook",
		Icon: TiSocialFacebookCircular,
	},
	github: {
		label: "GitHub",
		Icon: TiSocialGithub,
	},
	instagram: {
		label: "Instagram",
		Icon: TiSocialInstagramCircular,
	},
	linkedin: {
		label: "LinkedIn",
		Icon: TiSocialLinkedinCircular,
	},
	twitter: {
		label: "Twitter",
		Icon: TiSocialTwitterCircular,
	},
};

const Social = ({
	index,
	social,
	socials,
	onDelete,
	Field,
	onUpdate,
}: {
	index: number;
	social: SocialProps;
	socials: SocialProps[];
	onDelete: () => void;
	Field: FieldComponent<UserProfile>;
	onUpdate: (index: number, val: string) => void;
}) => {
	const [socialKey, setSocialKey] = useState<string>(createId());
	const name = (social.name || "").toLowerCase();
	const Icon = AvailableSocials[name as keyof typeof AvailableSocials]?.Icon;

	return (
		<div
			className="grid grid-cols-[auto_1fr_1fr] gap-4 items-center [&:not(&:first-of-type)]:mt-2"
			key={socialKey}
		>
			<Button
				variant="ghost"
				onClick={onDelete}
				className={cn(
					"size-6 p-0 rounded-full flex items-center justify-center",
					Icon ? "text-[--primary]" : "bg-[--border]",
				)}
			>
				{Icon ? <Icon className={cn("size-6", "text-[--primary]")} /> : null}
			</Button>

			<Field name={`socials[${index}].name`}>
				{({ state: { value }, handleChange }) => {
					const onChange = (val: string) => {
						onUpdate(index, val);
						handleChange(val);
						setSocialKey(createId());
					};

					return (
						<Select
							value={value}
							onValueChange={onChange}
							name={`socials[${index}].name`}
						>
							<SelectTrigger>
								<SelectValue placeholder={value}>{value}</SelectValue>
							</SelectTrigger>
							<SelectContent>
								{Object.values(AvailableSocials)
									.filter(({ label }) => {
										const currentSocials = socials.map(({ name }) =>
											name.toLowerCase(),
										);

										return !currentSocials.includes(label.toLowerCase());
									})
									.map(({ label }) => {
										return (
											<SelectItem value={label} key={label}>
												{label}
											</SelectItem>
										);
									})}
							</SelectContent>
						</Select>
					);
				}}
			</Field>
			<Field name={`socials[${index}].href`}>
				{({ state: { value }, handleChange, handleBlur }) => {
					return (
						<TextInput
							label={"Href"}
							value={value || ""}
							onBlur={handleBlur}
							onChange={handleChange}
							name={`socials[${index}].href`}
							placeholder="url here"
							className="border-b-2 grid-cols-[auto_1fr]"
						/>
					);
				}}
			</Field>
		</div>
	);
};

export default Social;
