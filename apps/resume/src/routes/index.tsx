import getResumes from "@/api/resume/get-resumes";
import addResume from "@/api/resume/add-resume";
import cn from "@/utils/class-name";
import { useSession } from "@clerk/clerk-react";
import type { ActiveSessionResource } from "@clerk/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { toast } from "sonner";
import { Button } from "@/components/button";

import styles from "./styles.module.css";

const Index = () => {
	const { session, isLoaded, isSignedIn } = useSession();

	const { data } = useQuery({
		queryKey: ["getResumes", { isLoaded: isLoaded && isSignedIn }],
		queryFn: getResumes(session as ActiveSessionResource),
	});

	const handleAddResume = useMutation({
		mutationKey: ["addResume"],
		mutationFn: addResume(session),
		onSuccess: async (data) => {
			if (data) {
				window.location.pathname = `/resume/${data.id}`;
			}
		},
		onError: (error) => {
			toast.error(error.message);
			console.error(error);
		},
	});

	if (!isLoaded) {
		return null;
	}

	const onAddResume = async () => {
		handleAddResume.mutate();
	};

	return (
		<div className={cn(styles.Page)} data-testid="Page-Index">
			<div>
				<Button
					variant="outline"
					onClick={onAddResume}
					className="h-auto p-4 flex flex-col items-center gap-2 group"
				>
					<div>
						<HiOutlineDocumentAdd className="transition-colors size-10 text-[--primary] group-hover:text-black" />
					</div>
					<h5 className="transition-colors text-[--primary] group-hover:text-black">
						Add Resume
					</h5>
				</Button>
			</div>
			{(data || []).map((resume) => {
				return (
					<Link
						key={resume.id}
						to="/resume/$resumeId"
						params={{ resumeId: resume.id }}
					>
						View Resume: {resume.id}
					</Link>
				);
			})}
		</div>
	);
};

export const Route = createFileRoute("/")({
	component: Index,
});
