import editExperience from "@/api/experience/edit-experience";
import { Button } from "@/components/button";
import { Dialog } from "@/components/dialog";
import ExperienceForm from "@/components/form/experience-form";
import { useSession } from "@clerk/clerk-react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Experience, Resume } from "~/apps/api/src/types/drizzle";

const EditExperience = ({
	id,
	isOpen,
	setIsOpen,
}: {
	id: string;
	isOpen: boolean;
	setIsOpen: (isOpen: string | null) => void;
}) => {
	if (!id) {
		return null;
	}

	const queryClient = useQueryClient();
	const { experiences } = queryClient.getQueryData([
		"getResume",
		{ isLoaded: true },
	]) as Resume;
	const experience = experiences.find((experience) => experience.id === id);

	if (!experience) {
		return null;
	}

	const { session } = useSession();

	const handleAddExperience = useMutation({
		mutationKey: ["editExperience"],
		mutationFn: editExperience(session),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["getResume"],
				exact: false,
			});

			setIsOpen(null);
			reset();
			toast.success("Successfully updated experience.");
		},
		onError: (error) => {
			toast.error(error.message);
			console.error(error);
		},
	});

	const { Field, Subscribe, handleSubmit, reset } = useForm<Experience>({
		defaultValues: {
			...experience,
			body: atob(experience.body),
		},
		onSubmit: async ({ value }) => {
			handleAddExperience.mutate({
				mutationKey: ["editExperience", value],
			});
		},
	});

	const handleOpen = (open: boolean) => {
		setIsOpen(open ? id : null);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpen}>
			<ExperienceForm
				Field={Field}
				onSubmit={handleSubmit}
				label="Edit Experience"
			>
				<Subscribe
					selector={({
						canSubmit,
						isSubmitting,
					}: { canSubmit: boolean; isSubmitting: boolean }) => ({
						canSubmit,
						isSubmitting,
					})}
				>
					{({
						canSubmit,
						isSubmitting,
					}: { canSubmit: boolean; isSubmitting: boolean }) => (
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
					)}
				</Subscribe>
			</ExperienceForm>
		</Dialog>
	);
};

export default EditExperience;
