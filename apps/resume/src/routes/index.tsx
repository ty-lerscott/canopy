import cn from "@/utils/class-name";
import { useSession, useUser } from "@clerk/clerk-react";
import type { ActiveSessionResource, UserResource } from "@clerk/types";
import { createId } from "@paralleldrive/cuid2";
import { useQuery } from "@tanstack/react-query";
import {
	type AnyRoute,
	createFileRoute,
	useSearch,
} from "@tanstack/react-router";
import dayjs from "dayjs";
import Markdown from "markdown-to-jsx";
import type { IconType } from "react-icons";
import { AiFillLinkedin } from "react-icons/ai";
import { FaRegCalendar } from "react-icons/fa6";
import { MdEmail, MdHouse, MdPhone } from "react-icons/md";
import { z } from "zod";
import Rating from "../components/rating";

import styles from "./styles.module.css";

type Header = {
	header: string;
	subheader?: string;
};

type Text = {
	text: string;
};

type Experience = {
	role: string;
	company: string;
	location: string;
	startDate: string;
	endDate?: string;
	body: [];
};

type ResumeSkill = {
	name: string;
	comfortLevel: number;
};

const Socials = {
	LinkedIn: AiFillLinkedin,
};

const resumeSkills: ResumeSkill[] = [{ name: "Sample", comfortLevel: 10 }];

type Education = {
	id: string;
	school: string;
	degree: string;
	startDate: string;
	endDate: string;
};

type Social = {
	id: string;
	name: string;
	href: string;
};

type User = {
	firstName: string;
	lastName: string;
	profession: string;
	emailAddress: string;
	address: string;
	phoneNumber: string;
	socials: Social[];
	education: Education[];
};

type Resume = {
	skills: ResumeSkill[];
	experiences: Experience[];
	user: User;
};

const fetchResume = async (
	user: UserResource,
	session: ActiveSessionResource,
): Promise<Resume> => {
	if (!user.id) {
		return Promise.resolve({} as Resume);
	}

	const sessionToken = await session?.getToken();
	const searchParams = new URLSearchParams();
	searchParams.set("resume", user.id);

	try {
		const resp = await fetch(`/resume?${searchParams.toString()}}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${sessionToken}`,
			},
		});

		return await resp.json();
	} catch (err) {
		console.log("Error in getResumeQuery", (err as Error).message);
		return Promise.resolve({} as Resume);
	}
};

const Index = () => {
	const { session, isLoaded } = useSession();
	const { isSignedIn, user } = useUser();
	const forPrint = useSearch<
		AnyRoute & {
			padding?: boolean;
		}
	>({
		from: "/",
		select: ({ print }) => Boolean(print),
	});

	const { data, isPending } = useQuery({
		queryKey: ["getResume", user?.id],
		queryFn: () =>
			fetchResume(user as UserResource, session as ActiveSessionResource),
	});

	if (!isLoaded || !isSignedIn || isPending || !data) {
		// Handle loading state however you like
		return null;
	}

	const {
		user: {
			firstName,
			lastName,
			profession,
			emailAddress,
			phoneNumber,
			address,
			socials,
			education,
		},
		skills,
		experiences,
	} = data;

	const personalInfo: Record<string, string | IconType>[] = [
		{
			Icon: MdEmail,
			value: emailAddress,
		},
		{
			Icon: MdPhone,
			value: phoneNumber,
		},
		{
			Icon: MdHouse,
			value: address,
		},
	];

	return (
		<div
			className={cn(styles.Page, forPrint && styles.PagePaddless)}
			data-testid="Page-Index"
		>
			<div>
				<h1 className={styles.Name}>
					{firstName} {lastName}
				</h1>
				<h2 className={styles.Profession}>{profession}</h2>
			</div>
			<div className={styles.Contact}>
				{personalInfo.map(({ value, Icon }) => {
					return (
						<div key={value as string} className={styles.ContactItem}>
							<div>
								<Icon className={styles.Icon} />
							</div>
							<p>{value as string}</p>
						</div>
					);
				})}
				{socials.map(({ name, href }) => {
					const Icon = Socials[name as keyof typeof Socials];

					return (
						<div key={name} className={styles.ContactItem}>
							<div>
								<Icon className={styles.Icon} />
							</div>
							<p>{href}</p>
						</div>
					);
				})}
			</div>
			<div className={styles.Body}>
				<div className={styles.WorkExperiences}>
					<h2 className={styles.Header}>Work Experience</h2>
					{experiences.map(
						({ role, company, location, startDate, endDate, body }) => {
							const date = `${dayjs(startDate).format("MMM YYYY")} -
                          ${
														endDate
															? dayjs(endDate).format("MMM YYYY")
															: "Present"
													}`;
							return (
								<div
									key={`experience-${role}-${company}`}
									className={styles.Experience}
								>
									<h3>{role}</h3>
									<p className={styles.ExperienceCompanyLocation}>
										{company} &#x2022; {location}
									</p>
									<p className={styles.ExperienceDate}>
										<FaRegCalendar className={styles.ExperienceCalendar} />{" "}
										<span>{date}</span>
									</p>
									{(body || []).map((bodyItem) => {
										return (
											<Markdown
												key={`body-${createId()}`}
												className={styles.ExperienceBody}
											>
												{bodyItem}
											</Markdown>
										);
									})}
								</div>
							);
						},
					)}
				</div>
				<div className={styles.Sidebar}>
					<h2 className={styles.Header}>Education</h2>

					<div className={styles.EducationList}>
						{education.map(({ id, school, degree, startDate, endDate }) => {
							const duration = `${dayjs(startDate).format("YYYY")} - ${dayjs(endDate).format("YYYY")}`;
							return (
								<div className={styles.Education} key={id}>
									<h5>{school}</h5>
									<p className={styles.EducationDuration}>
										{degree} {duration}
									</p>
								</div>
							);
						})}
					</div>

					<h2 className={styles.Header}>Skills</h2>

					{skills.map((skill) => {
						return (
							<div key={skill.name} className={styles.Skill}>
								<p>{skill.name}</p>
								<Rating rating={skill.comfortLevel / 2} invert />
							</div>
						);
					})}
				</div>
			</div>
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
