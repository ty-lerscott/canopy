import getUser from "@/api/user/get-user";
import updateUser from "@/api/user/update-user";
import { Button } from "@/components/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/dialog";
import TextInput from "@/components/form/text-input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/select";
import cn from "@/utils/class-name";
import toSentenceCase from "@/utils/to-sentence-case";
import { useSession, useUser } from "@clerk/clerk-react";
import type { ActiveSessionResource } from "@clerk/types";
import { createId } from "@paralleldrive/cuid2";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import omit from "object.omit";
import { useState } from "react";
import type { IconType } from "react-icons";
import { MdAddBox } from "react-icons/md";
import {
	TiSocialFacebookCircular,
	TiSocialGithub,
	TiSocialInstagramCircular,
	TiSocialLinkedinCircular,
	TiSocialTwitterCircular,
} from "react-icons/ti";
import type { Social, User, UserProfile } from "~/apps/api/src/types/drizzle";

const InputTypes = {
	default: "text",
	phone: "tel",
	email: "email",
	password: "password",
	number: "number",
	checkbox: "checkbox",
	radio: "radio",
	date: "date",
	time: "time",
	file: "file",
	submit: "submit",
	reset: "reset",
	color: "color",
	search: "search",
	url: "url",
	range: "range",
};

type SocialEntry = {
	label: string;
	Icon?: IconType;
};

type SocialType = {
	[key: string]: SocialEntry;
};

const Socials: SocialType = {
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

const ProfileIgnore: (keyof User)[] = [
	"id",
	"isEditable",
	"displayName",
	"education",
];

const ProfileDialog = ({
	isOpen,
	setIsOpen,
}: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
	const [socialsKey, setSocialsKey] = useState(createId());
	const [socials, setSocials] = useState<User["socials"]>([]);
	const { user, isLoaded: isUserLoaded } = useUser();
	const { session, isLoaded: isSessionLoaded } = useSession();

	const { data, isPending, refetch } = useQuery({
		queryKey: ["getUser", { isLoaded: isUserLoaded && isSessionLoaded }],
		queryFn: getUser({
			userId: user?.id as string,
			session: session as ActiveSessionResource,
			options: {
				education: false,
				callback: (s: User["socials"]) => {
					setSocials(s);
				},
			},
		}),
	});

	const userProfileNoArrays = omit(data as User, ProfileIgnore) as UserProfile;

	const { Field, Subscribe, handleSubmit, reset } = useForm<
		Omit<UserProfile, "education">
	>({
		defaultValues: { ...userProfileNoArrays, socials },
		onSubmit: async ({ value }) => {
			handleUpdateUser.mutate({
				mutationKey: [
					"updateUser",
					{
						isLoaded: isUserLoaded && isSessionLoaded,
						user: { ...value, id: user?.id as string } as User,
					},
				],
			});
		},
	});

	const handleUpdateUser = useMutation({
		mutationKey: [
			"updateUser",
			{ isLoaded: isUserLoaded && isSessionLoaded, user: userProfileNoArrays },
		],
		mutationFn: updateUser(session as ActiveSessionResource),
		onSuccess: async () => {
			await refetch();
		},
		onError: (error) => {
			console.error(error);
		},
	});

	const addSkill = () => {
		setSocials((prevSocials) =>
			prevSocials.concat([
				{
					name: "",
					label: "",
					id: createId(),
					isEditable: true,
					href: "",
				} as Social,
			]),
		);
	};

	const updateSocial =
		(index: number, changeFunc: (s: string) => void) =>
		(val: string): void => {
			setSocials((prevState) => {
				const newState = prevState;
				newState[index].name = val;

				return newState;
			});

			setSocialsKey(createId());

			changeFunc(val);
		};

	if (isPending) {
		return null;
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						e.stopPropagation();
						await handleSubmit();
					}}
				>
					<DialogHeader>
						<DialogTitle>Profile</DialogTitle>
					</DialogHeader>

					<div className="py-4">
						{Object.entries(omit(userProfileNoArrays, ["socials"])).map(
							([name]) => {
								const typedName = name as keyof Omit<
									UserProfile,
									"socials" | "education"
								>;
								const label = toSentenceCase(name);
								const type =
									InputTypes[
										label.split(" ")[0].toLowerCase() as keyof typeof InputTypes
									] || InputTypes.default;

								return (
									<Field name={typedName} key={label}>
										{({ state: { value }, handleChange, handleBlur }) => {
											return (
												<TextInput
													type={type}
													label={label}
													name={typedName}
													value={value || ""}
													onBlur={handleBlur}
													onChange={handleChange}
													className="[&:not(:last-of-type)]:border-b-2"
												/>
											);
										}}
									</Field>
								);
							},
						)}
					</div>

					<DialogHeader>
						<DialogTitle className="inline-flex w-auto items-center">
							<span>Socials</span>{" "}
							<Button
								variant="ghost"
								onClick={addSkill}
								className="p-2 h-auto transition-colors text-transparent hover:text-[--primary]"
							>
								<MdAddBox className="size-4" />
							</Button>
						</DialogTitle>
					</DialogHeader>

					{Array.isArray(socials) && socials.length ? (
						<Field name="socials" mode="array" key={socialsKey}>
							{() => {
								return socials.map((social, index) => {
									const name = (social.name || "").toLowerCase();
									const Icon = Socials[name as keyof typeof Socials]?.Icon;

									return (
										<div
											key={social.name}
											className="grid grid-cols-[auto_1fr_1fr] gap-4 items-center [&:not(&:first-of-type)]:mt-2"
										>
											<Button
												variant="ghost"
												className={cn(
													"size-6 p-0 rounded-full flex items-center justify-center",
													Icon ? "text-[--primary]" : "bg-[--border]",
												)}
											>
												{Icon ? (
													<Icon className={cn("size-6", "text-[--primary]")} />
												) : null}
											</Button>
											<Field name={`socials[${index}].name`}>
												{({ state: { value }, handleChange }) => {
													return (
														<Select
															value={value}
															onValueChange={updateSocial(index, handleChange)}
															name={`socials[${index}].name`}
														>
															<SelectTrigger>
																<SelectValue placeholder={value}>
																	{value}
																</SelectValue>
															</SelectTrigger>
															<SelectContent>
																{Object.values(Socials)
																	.filter(({ label }) => {
																		const currentSocials = socials.map(
																			({ name }) => name.toLowerCase(),
																		);

																		return !currentSocials.includes(
																			label.toLowerCase(),
																		);
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
								});
							}}
						</Field>
					) : null}

					<Subscribe
						selector={({ canSubmit, isSubmitting }) => ({
							canSubmit,
							isSubmitting,
						})}
					>
						{({ canSubmit, isSubmitting }) => {
							return (
								<div className="grid grid-cols-2 gap-4 mt-4">
									<Button
										variant="outline"
										type="button"
										onClick={reset}
										className="shrink-0 w-full"
									>
										Reset
									</Button>

									<Button
										type="submit"
										disabled={!canSubmit}
										className="shrink-0 w-full"
									>
										{isSubmitting ? "Updating..." : "Update"}
									</Button>
								</div>
							);
						}}
					</Subscribe>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default ProfileDialog;
