import getUser from "@/api/user/get-user";
import updateUser from "@/api/user/update-user";
import { Button } from "@/components/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/dialog";
import { useSession, useUser } from "@clerk/clerk-react";
import type { ActiveSessionResource } from "@clerk/types";
import { createId } from "@paralleldrive/cuid2";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import omit from "object.omit";
import { useState } from "react";
import { MdAddBox } from "react-icons/md";
import { toast } from "sonner";
import type {
	Education as EducationType,
	Social,
	User,
	UserProfile,
} from "~/apps/server/src/types/drizzle";
import Education from "./education";
import FormFooter from "./footer";
import Profile from "./profile";
import Socials from "./socials";

const ProfileIgnore: (keyof User)[] = ["id", "isEditable", "displayName"];

const ProfileDialog = ({
	isOpen,
	setIsOpen,
}: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
	const queryClient = useQueryClient();
	const [socials, setSocials] = useState<User["socials"]>([]);
	const [education, setEducation] = useState<User["education"]>([]);
	const { user, isLoaded: isUserLoaded } = useUser();
	const { session, isLoaded: isSessionLoaded } = useSession();

	const { data, isPending, refetch } = useQuery({
		queryKey: ["getUser", { isLoaded: isUserLoaded && isSessionLoaded }],
		queryFn: getUser({
			userId: user?.id as string,
			session: session as ActiveSessionResource,
			options: {
				callback: (s: User["socials"], e: User["education"]) => {
					setSocials(s);
					setEducation(e);
				},
			},
		}),
	});

	const staleUserProfile = omit(data as User, ProfileIgnore) as UserProfile;

	const { Field, Subscribe, handleSubmit, reset } = useForm<UserProfile>({
		defaultValues: { ...staleUserProfile, socials, education },
		onSubmit: async ({ value }) => {
			handleUpdateUser.mutate({
				mutationKey: [
					"updateUser",
					{ ...value, id: user?.id as string } as User,
				],
			});
		},
	});

	const handleUpdateUser = useMutation({
		mutationKey: ["updateUser"],
		mutationFn: updateUser(session as ActiveSessionResource),
		onSuccess: async () => {
			await refetch();
			await queryClient.invalidateQueries({
				queryKey: ["getResume"],
				exact: false,
			});
			setIsOpen(false);
			toast.success("User updated successfully.");
		},
		onError: (error) => {
			toast.error(error.message);
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

	const addEducation = () => {
		setEducation((prevEducation) =>
			prevEducation.concat([
				{
					id: createId(),
					isEditable: true,
					school: "",
					degree: "",
					major: "",
					startDate: "",
					endDate: "",
				} as EducationType,
			]),
		);
	};

	const updateSocialMemory = (index: number, val: string) => {
		setSocials((prevState) => {
			const newState = prevState;
			newState[index].name = val;

			return newState;
		});
	};

	if (isPending) {
		return null;
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="max-h-[90vh] overflow-y-auto">
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

					<Profile
						Field={Field}
						profile={omit(staleUserProfile, ["socials", "education"])}
					/>

					<DialogHeader>
						<DialogTitle className="inline-flex w-auto items-center">
							<span>Socials</span>{" "}
							<Button
								variant="ghost"
								onClick={addSkill}
								className="p-1 h-auto transition-colors text-transparent hover:text-[--primary]"
							>
								<MdAddBox className="size-4" />
							</Button>
						</DialogTitle>
					</DialogHeader>

					<Socials
						Field={Field}
						socials={socials}
						onUpdate={updateSocialMemory}
					/>

					<DialogHeader>
						<DialogTitle className="inline-flex w-auto items-center">
							<span>Education</span>{" "}
							<Button
								variant="ghost"
								onClick={addEducation}
								className="p-2 h-auto transition-colors text-transparent hover:text-[--primary]"
							>
								<MdAddBox className="size-4" />
							</Button>
						</DialogTitle>
					</DialogHeader>

					<Education education={education} Field={Field} />

					<FormFooter Subscribe={Subscribe} reset={reset} />
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default ProfileDialog;
