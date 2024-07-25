import deleteSocial from "@/api/socials/delete-social";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/alert-dialog";
import { Button } from "@/components/button";
import Code from "@/components/code/code.tsx";
import TextInput from "@/components/form/text-input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/select";
import cn from "@/utils/class-name";
import { useSession } from "@clerk/clerk-react";
import type { ActiveSessionResource } from "@clerk/types";
import type { FieldComponent, Updater } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { IconType } from "react-icons";
import {
	TiSocialFacebookCircular,
	TiSocialGithub,
	TiSocialInstagramCircular,
	TiSocialLinkedinCircular,
	TiSocialTwitterCircular,
} from "react-icons/ti";
import { toast } from "sonner";
import type { UserProfile } from "~/apps/api/src/types/drizzle";

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

const Socials = ({
	Field,
	socials,
	updateSocial,
}: {
	socials: UserProfile["socials"];
	Field: FieldComponent<UserProfile>;
	updateSocial: (
		i: number,
		handleChange: (updater: Updater<string>) => void,
	) => (val: string) => void;
}) => {
	const queryClient = useQueryClient();
	const { session } = useSession();
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [socialIndex, setSocialIndex] = useState<number>(0);

	const handleDeleteSocial = useMutation({
		mutationKey: ["deleteSocial"],
		mutationFn: deleteSocial(session as ActiveSessionResource),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["getResume", "getUser"],
				exact: false,
			});
			toast.success("Social entry deleted successfully.");
		},
		onError: (error) => {
			toast.error(error.message);
			console.error(error);
		},
	});

	const handleOnIconClick = (index: number) => () => {
		setSocialIndex(index);
		setIsDeleteOpen(true);
	};

	return Array.isArray(socials) && socials.length ? (
		<div className="py-4">
			<AlertDialog
				open={isDeleteOpen}
				onOpenChange={(isOpen) => {
					setIsDeleteOpen(isOpen);
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Social?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<Code
						syntax="javascript"
						className="text-xs"
						text={JSON.stringify(socials[socialIndex], null, 2)}
					/>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								handleDeleteSocial.mutate({
									mutationKey: ["deleteSocial", socials[socialIndex].id],
								});
							}}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<Field name="socials" mode="array">
				{() => {
					return socials.map((social, index) => {
						const name = (social.name || "").toLowerCase();
						const Icon =
							AvailableSocials[name as keyof typeof AvailableSocials]?.Icon;

						return (
							<div
								key={social.name}
								className="grid grid-cols-[auto_1fr_1fr] gap-4 items-center [&:not(&:first-of-type)]:mt-2"
							>
								<Button
									variant="ghost"
									onClick={handleOnIconClick(index)}
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
													<SelectValue placeholder={value}>{value}</SelectValue>
												</SelectTrigger>
												<SelectContent>
													{Object.values(AvailableSocials)
														.filter(({ label }) => {
															const currentSocials = socials.map(({ name }) =>
																name.toLowerCase(),
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
		</div>
	) : null;
};

export default Socials;
