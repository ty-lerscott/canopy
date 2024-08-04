import getResumes from "@/api/resume/get-resumes";
import cn from "@/utils/class-name";
import { useSession } from "@clerk/clerk-react";
import type { ActiveSessionResource } from "@clerk/types";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import styles from "./styles.module.css";

const Index = () => {
	const { session, isLoaded, isSignedIn } = useSession();

	const { data } = useQuery({
		queryKey: ["getResumes", { isLoaded: isLoaded && isSignedIn }],
		queryFn: getResumes(session as ActiveSessionResource),
	});

	if (!isLoaded || !Array.isArray(data)) {
		return null;
	}

	return (
		<div className={cn(styles.Page)} data-testid="Page-Index">
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
	validateSearch: (search: Record<string, unknown>) => {
		return z
			.object({
				print: z.boolean().optional(),
			})
			.parse(search);
	},
});
