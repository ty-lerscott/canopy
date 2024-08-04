import addExperience from "@/api/experience/add-experience";
import { Button } from "@/components/button";
import { Dialog } from "@/components/dialog";
import ExperienceForm from "@/components/form/experience-form";
import { useSession } from "@clerk/clerk-react";
import { createId } from "@paralleldrive/cuid2";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import type { Experience } from "~/apps/server/src/types/drizzle";

const AddExperience = ({
	isOpen,
	setIsOpen,
}: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
	const queryClient = useQueryClient();
	const { session } = useSession();
	const resumeId = useParams({
		from: window.location.pathname.includes("resume")
			? "/resume/$resumeId"
			: "/",
		select: (select) => (select as Record<string, string>).resumeId,
	});

	const handleAddSkill = useMutation({
		mutationKey: ["addExperience"],
		mutationFn: addExperience(session),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["getResume"],
				exact: false,
			});

			setIsOpen(false);
			reset();
			toast.success("Successfully added experience.");
		},
		onError: (error) => {
			toast.error(error.message);
			console.error(error);
		},
	});

	const { Field, Subscribe, handleSubmit, reset } = useForm<Experience>({
		defaultValues: {
			role: "",
			resumeId,
			body: "",
			company: "",
			location: "",
			id: createId(),
			isEditable: true,
			workStyle: "in-office",
			startDate: new Date().toDateString(),
		},
		onSubmit: async ({ value }) => {
			handleAddSkill.mutate({
				mutationKey: ["addExperience", value],
			});
		},
	});

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<ExperienceForm Field={Field} onSubmit={handleSubmit}>
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
								{isSubmitting ? "Adding..." : "Add Experience"}
							</Button>
						</div>
					)}
				</Subscribe>
			</ExperienceForm>
		</Dialog>
	);
};

export default AddExperience;
