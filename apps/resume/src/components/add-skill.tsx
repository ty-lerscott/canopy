import addSkill from "@/api/skill/add-skill";
import { Button } from "@/components/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/dialog";
import RangeInput from "@/components/form/range-input";
import TextInput from "@/components/form/text-input";
import { useSession } from "@clerk/clerk-react";
import { createId } from "@paralleldrive/cuid2";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import type { Skill } from "~/apps/server/src/types/drizzle";

const AddSkill = ({
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
		mutationKey: ["addSkill"],
		mutationFn: addSkill(session),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["getResume"],
				exact: false,
			});

			setIsOpen(false);
			reset();
			toast.success("Successfully added skill.");
		},
		onError: (error) => {
			toast.error(error.message);
			console.error(error);
		},
	});

	const { Field, Subscribe, handleSubmit, reset } = useForm<Skill>({
		defaultValues: {
			name: "",
			resumeId,
			id: createId(),
			isActive: true,
			favorite: false,
			comfortLevel: 0,
			isEditable: true,
			startDate: new Date().toDateString(),
		},
		onSubmit: ({ value }) => {
			handleAddSkill.mutate({
				mutationKey: ["addSkill", value],
			});
		},
	});

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
					<DialogHeader className="mb-4">
						<DialogTitle>Add Skill</DialogTitle>
					</DialogHeader>

					<Field name="name">
						{({ state: { value }, handleChange, handleBlur }) => {
							return (
								<TextInput
									label={"Name"}
									value={value || ""}
									onBlur={handleBlur}
									onChange={handleChange}
									name="name"
									className="border-b-2 grid-cols-[auto_1fr] mb-4"
								/>
							);
						}}
					</Field>

					<Field name="comfortLevel">
						{({ state: { value }, handleChange }) => {
							return (
								<RangeInput
									name="comfortLevel"
									defaultValue={value}
									label="Comfort Level"
									onChange={handleChange}
								/>
							);
						}}
					</Field>

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
									{isSubmitting ? "Adding..." : "Add Skill"}
								</Button>
							</div>
						)}
					</Subscribe>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default AddSkill;
