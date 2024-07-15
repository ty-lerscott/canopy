import {z} from 'zod';
import dayjs from 'dayjs';
import cn from '@/utils/class-name'
import { useSearch, createFileRoute, type AnyRoute} from '@tanstack/react-router'
import type {IconType} from "react-icons";
import { FaRegCalendar } from "react-icons/fa6";
import { AiFillLinkedin } from "react-icons/ai";
import { MdEmail, MdPhone, MdHouse } from "react-icons/md";
import Rating from '../components/rating';

import styles from './styles.module.css'

type Header = {
    header: string;
    subheader?: string;
}

type Text = {
    text: string;
}

type Experience = {
    role: string;
    company: string;
    location: string;
    startDate: string;
    endDate?: string;
    body: [];
}

type ResumeSkill = {
    name: string;
    comfortLevel: number;
}

const personalInfo: Record<string, string | IconType>[]= [
    {
        Icon: MdEmail,
        value: 'ty@lerscott.com'
    },
    {
        Icon: MdPhone,
        value: '607 882 0531'
    },
    {
        Icon: MdHouse,
        value: 'Hampton, VA'
    },
    {
        Icon: AiFillLinkedin,
        value: 'linkedin.com/in/tylerscottwilliams'
    },
]

const experiences: Experience[] = [
    {role: 'Senior Software Engineer - Contract', company: 'Diageo', location: 'UK', startDate: '2021-07-15T19:19:14.660Z', body: []}
]

const education: Header[] = [
    {
        header: 'Cornell University',
        subheader:'Fine Arts | 2015',
    }
]

const resumeSkills: ResumeSkill[] = [
    {name: 'Sample', comfortLevel: 10}
];

const Index = () => {
    const hasPadding = useSearch<AnyRoute & {
        padding?: boolean;
    }>({
        from: '/',
        select: ({padding}) => Boolean(padding)
    });

  return (
      <div className={cn(styles.Page, !hasPadding && styles.PagePaddless)}
           data-testid="Page-Index">
          <div>
              <h1 className={styles.Name}>Tyler Scott</h1>
              <h2 className={styles.Profession}>
                  Senior Software Engineer
              </h2>
          </div>
          <div className={styles.Contact}>
              {personalInfo.map(({value, Icon}) => {
                  return (
                      <div key={value as string} className={styles.ContactItem}>
                          <div>
                              <Icon className={styles.Icon}/>
                          </div>
                          <p>{value as string}</p>
                      </div>
                  );
              })}
          </div>
          <div className={styles.Body}>
              <div className={styles.WorkExperiences}>
                  <h2 className={styles.Header}>Work Experience</h2>
                  {experiences.map(
                      ({role, company, location, startDate, endDate, body}) => {
                          const date = `${dayjs(startDate).format("MMM YYYY")} -
                          ${
                              endDate
                                  ? dayjs(endDate).format("MMM YYYY")
                                  : "Present"
                          }`;
                          return (
                              <div key={`experience-${role}-${company}`} className={styles.Experience}>
                                  <h3>{role}</h3>
                                  <p className={styles.ExperienceCompanyLocation}>
                                      {company} &#x2022; {location}
                                  </p>
                                  <p className={styles.ExperienceDate}>
                                      <FaRegCalendar className={styles.ExperienceCalendar}/>{" "}
                                      <span>{date}</span>
                                  </p>
                                  {(body || []).map((bodyItem) => {
                                      return (
                                          <p
                                              key={`${role}-${company}`}
                                              className={styles.ExperienceBody}
                                          >
                                              {(bodyItem as Header).header ? (
                                                  <>
                                                      <span>{(bodyItem as Header).header}: </span>
                                                      {(bodyItem as Header).subheader ? (
                                                          <span>{(bodyItem as Header).subheader}</span>
                                                      ) : null}
                                                  </>
                                              ) : (
                                                  (bodyItem as Text).text
                                              )}
                                          </p>
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
                  {education.map((item) => {
                      return (
                          <div className={styles.Education} key={item.header as string}>
                              <h5>{item.header}</h5>
                              <p className={styles.EducationDuration}>{item.subheader}</p>
                          </div>
                      );
                  })}
                </div>

                  <h2 className={styles.Header}>Skills</h2>

                  {resumeSkills.map((item) => {
                      return (
                          <div key={item.name} className={styles.Skill}>
                              <p>{item.name}</p>
                              <Rating rating={item.comfortLevel / 2} invert/>
                          </div>
                      );
                  })}
              </div>
          </div>
      </div>
  )
}

export const Route = createFileRoute('/')({
    component: Index,
    validateSearch: (search: Record<string, unknown>) => {
        return z.object({
            padding: z.boolean().optional()
        }).parse(search)
    }
})
