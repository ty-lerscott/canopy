import InputTypes from "@/components/form/input-types";
import TextInput from "@/components/form/text-input";
import toSentenceCase from "@/utils/to-sentence-case";
import type { FieldComponent, Updater } from "@tanstack/react-form";
import type { UserProfile } from "~/apps/api/src/types/drizzle";

const Profile = ({
	Field,
	profile,
}: {
	profile: Omit<UserProfile, "socials" | "education">;
	Field: FieldComponent<UserProfile>;
}) => {
	return (
		<div className="py-4">
			{Object.entries(profile).map(([key]) => {
				const name = key as keyof Omit<UserProfile, "socials" | "education">;
				const label = toSentenceCase(key);
				const type =
					InputTypes[
						label.split(" ")[0].toLowerCase() as keyof typeof InputTypes
					] || InputTypes.default;

				return (
					<Field name={name} key={label}>
						{({
							state: { value },
							handleChange,
							handleBlur,
						}: {
							state: { value: string };
							handleChange: (updater: Updater<string>) => void;
							handleBlur: () => void;
						}) => {
							return (
								<TextInput
									type={type}
									name={name}
									label={label}
									value={value || ""}
									onBlur={handleBlur}
									onChange={handleChange}
									className="[&:not(:last-of-type)]:border-b-2"
								/>
							);
						}}
					</Field>
				);
			})}
		</div>
	);
};

export default Profile;
