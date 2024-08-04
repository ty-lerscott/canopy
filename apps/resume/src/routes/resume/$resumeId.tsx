import getResume from "@/api/resume/get-resume";
import AddExperience from "@/components/add-experience";
import AddSkill from "@/components/add-skill";
import { Button } from "@/components/button";
import EditExperience from "@/components/edit-experience";
import Markdown from "@/components/markdown";
import Rating from "@/components/rating";
import cn from "@/utils/class-name";
import toSentenceCase from "@/utils/to-sentence-case";
import { useSession } from "@clerk/clerk-react";
import type { ActiveSessionResource } from "@clerk/types";
import { useQuery } from "@tanstack/react-query";
import {
	type AnyRoute,
	createFileRoute,
	useNavigate,
	useParams,
	useSearch,
} from "@tanstack/react-router";
import dayjs from "dayjs";
import { useState } from "react";
import type { IconType } from "react-icons";
import {
	AiFillFacebook,
	AiFillGithub,
	AiFillInstagram,
	AiFillLinkedin,
	AiFillTwitterCircle,
} from "react-icons/ai";
import { FaRegCalendar } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { MdAddBox, MdEmail, MdHouse, MdPhone } from "react-icons/md";
import type { Resume } from "~/apps/api/src/types/drizzle";

import styles from "@/routes/styles.module.css";
import "@fontsource/zilla-slab/500.css";
import "@fontsource/zilla-slab/600.css";
import "@fontsource-variable/inter";

const Socials = {
	Facebook: AiFillFacebook,
	GitHub: AiFillGithub,
	Instagram: AiFillInstagram,
	LinkedIn: AiFillLinkedin,
	Twitter: AiFillTwitterCircle,
};

const ResumeLayout = () => {
	const [skills, setSkills] = useState<Resume["skills"]>([]);
	const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
	const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
	const [experiences, setExperiences] = useState<Resume["experiences"]>([]);
	const [isEditExperienceOpen, setIsEditExperienceOpen] = useState<
		null | string
	>(null);
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
			onSuccess: (
				skills: Resume["skills"],
				experiences: Resume["experiences"],
			) => {
				setSkills(skills);
				setExperiences(experiences);
			},
		}),
	});

	if (!isLoaded || isPending) {
		return null;
	}

	const addWorkExperience = () => {
		setIsExperienceDialogOpen((prevState) => !prevState);
	};
	const addEducation = () => {};
	const addSkill = () => {
		setIsSkillDialogOpen((prevState) => !prevState);
	};

	const handleEditExperience = (id: string) => () => {
		setIsEditExperienceOpen(id);
	};

	const download = async () => {
		try {
			const resp = await fetch(`/api/download/resume/${resumeId}`);

			const blob = await resp.blob();

			if (blob.type) {
				const file = window.URL.createObjectURL(blob);
				const resumeWindow = window.open(file, "_blank");
				if (resumeWindow) {
					resumeWindow.document.title = "Tyler Scott Williams Resume.pdf";
				}
			}
		} catch (err) {
			console.log("Error Downloading Resume", (err as Error).message);
		}
	};

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
			data-testid="Page-Resume"
		>
			{forPrint ? null : <Button onClick={download}>Download</Button>}
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
							<a
								href={url}
								target="_blank"
								rel="noreferrer"
								className="transition-all underline underline-offset-4 hover:text-[--primary]"
							>
								{href}
							</a>
						</div>
					);
				})}
			</div>
			<div className={styles.Body}>
				<div className={styles.WorkExperiences}>
					<h2 className={styles.Header}>
						<span>Work Experience</span>
						{isEditable ? (
							<>
								<Button
									variant="ghost"
									onClick={addWorkExperience}
									className="px-1 py-0 h-auto transition-colors text-transparent hover:text-[--primary]"
								>
									<MdAddBox className="size-4" />
								</Button>
								<AddExperience
									isOpen={isExperienceDialogOpen}
									setIsOpen={setIsExperienceDialogOpen}
								/>
							</>
						) : null}
					</h2>
					{experiences.map(
						({
							id,
							role,
							company,
							location,
							startDate,
							endDate,
							body,
							workStyle,
						}) => {
							const date = `${dayjs(startDate).format("MMM YYYY")} -
                          ${
														endDate
															? dayjs(endDate).format("MMM YYYY")
															: "Present"
													}`;
							return (
								<div
									key={`experience-${role}-${company}`}
									className={cn("group", styles.Experience)}
								>
									{isEditable ? (
										<div className="absolute right-0 top-0">
											<Button
												size="sm"
												variant="ghost"
												onClick={handleEditExperience(id)}
												className="text-[--primary] transition-all opacity-0 px-1 h-auto group-hover:opacity-100"
											>
												<MdModeEdit className="size-4" />
											</Button>
											<EditExperience
												id={id}
												setIsOpen={setIsEditExperienceOpen}
												isOpen={isEditExperienceOpen === id}
											/>
										</div>
									) : null}
									<h3>{role}</h3>
									<p className={styles.ExperienceCompanyLocation}>
										{[
											company,
											location,
											workStyle !== "in-office"
												? toSentenceCase(workStyle)
												: null,
										]
											.filter(Boolean)
											.join(" • ")}
									</p>
									<p className={styles.ExperienceDate}>
										<FaRegCalendar className={styles.ExperienceCalendar} />{" "}
										<span>{date}</span>
									</p>

									<Markdown className={styles.ExperienceBody}>
										{atob(body)}
									</Markdown>
								</div>
							);
						},
					)}
				</div>
				<div className={styles.Sidebar}>
					<h2 className={styles.Header}>
						<span>Education</span>
						{isEditable ? (
							<Button
								variant="ghost"
								onClick={addEducation}
								className="px-1 py-0 h-auto transition-colors text-transparent hover:text-[--primary]"
							>
								<MdAddBox className="size-4" />
							</Button>
						) : null}
					</h2>

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

					<h2 className={styles.Header}>
						<span>Skills</span>
						{isEditable ? (
							<>
								<Button
									variant="ghost"
									onClick={addSkill}
									className="px-1 py-0 h-auto transition-colors text-transparent hover:text-[--primary]"
								>
									<MdAddBox className="size-4" />
								</Button>
								<AddSkill
									isOpen={isSkillDialogOpen}
									setIsOpen={setIsSkillDialogOpen}
								/>
							</>
						) : null}
					</h2>

					{skills.map((skill) => {
						return (
							<div key={skill.name} className={styles.Skill}>
								<p>{skill.name}</p>
								<Rating rating={skill.comfortLevel / 2} />
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
