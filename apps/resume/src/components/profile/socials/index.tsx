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
import Code from "@/components/code/code";
import { useSession } from "@clerk/clerk-react";
import type { ActiveSessionResource } from "@clerk/types";
import type { FieldComponent } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { UserProfile } from "~/apps/server/src/types/drizzle";
import Social from "./social";

const Socials = ({
	Field,
	socials,
	onUpdate,
}: {
	socials: UserProfile["socials"];
	Field: FieldComponent<UserProfile>;
	onUpdate: (index: number, val: string) => void;
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
					return socials.map((social, index) => (
						<Social
							index={index}
							Field={Field}
							key={social.id}
							social={social}
							socials={socials}
							onUpdate={onUpdate}
							onDelete={handleOnIconClick(index)}
						/>
					));
				}}
			</Field>
		</div>
	) : null;
};

export default Socials;
