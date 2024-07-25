import getResume from "@/api/resume/get-resume";
import Rating from "@/components/rating";
import cn from "@/utils/class-name";
import { useSession } from "@clerk/clerk-react";
import type { ActiveSessionResource } from "@clerk/types";
import { createId } from "@paralleldrive/cuid2";
import { useQuery } from "@tanstack/react-query";
import {
	type AnyRoute,
	createFileRoute,
	useNavigate,
	useParams,
	useSearch,
} from "@tanstack/react-router";
import dayjs from "dayjs";
import Markdown from "markdown-to-jsx";
import type { IconType } from "react-icons";
import {
	AiFillFacebook,
	AiFillGithub,
	AiFillInstagram,
	AiFillLinkedin,
	AiFillTwitterCircle,
} from "react-icons/ai";
import { FaRegCalendar } from "react-icons/fa6";
import { MdEmail, MdHouse, MdPhone } from "react-icons/md";
import type { Resume } from "~/apps/api/src/types/drizzle.ts";

import styles from "@/routes/styles.module.css";

const Socials = {
	Facebook: AiFillFacebook,
	GitHub: AiFillGithub,
	Instagram: AiFillInstagram,
	LinkedIn: AiFillLinkedin,
	Twitter: AiFillTwitterCircle,
};

const ResumeLayout = () => {
	const navigate = useNavigate();
	const resumeId = useParams({
		from: "/resume/$resumeId",
		select: ({ resumeId }) => resumeId,
	});

	const forPrint = useSearch<
		AnyRoute & {
			padding?: boolean;
		}
	>({
		from: "/resume/$resumeId",
		select: ({ print }) => Boolean(print),
	});

	const { session, isLoaded } = useSession();

	const { data, isPending } = useQuery({
		queryKey: ["getResume", { isLoaded }],
		queryFn: getResume({
			resumeId,
			session: session as ActiveSessionResource,
			navigate,
		}),
	});

	if (!isLoaded || isPending) {
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
		isEditable,
	} = data as Resume;

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
				{(socials || []).map(({ name, href }) => {
					const Icon = Socials[name as keyof typeof Socials];
					const url = href.includes("http") ? href : `https://${href}`;

					return (
						<div key={name} className={styles.ContactItem}>
							<div>
								<Icon className={styles.Icon} />
							</div>
							<a href={url} target="_blank" rel="noreferrer">
								{href}
							</a>
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
						{(education || []).map(
							({ id, school, degree, major, startDate, endDate }) => {
								const duration = `${dayjs(startDate).format("YYYY")} - ${dayjs(endDate).format("YYYY")}`;
								return (
									<div className={styles.Education} key={id}>
										<h5>
											{school}, {degree}
										</h5>
										<p className={styles.EducationDuration}>
											{major} | {duration}
										</p>
									</div>
								);
							},
						)}
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

export const Route = createFileRoute("/resume/$resumeId")({
	component: ResumeLayout,
});
