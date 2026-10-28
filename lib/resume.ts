export type Fields = Record<string, string>;
export type TemplateId = 'classic' | 'modern' | 'minimal' | 'technical';

export type Resume = {
  personal: Fields;
  summary: string;
  education: Fields[];
  experience: Fields[];
  skills: Fields;
  projects: Fields[];
  certifications: Fields[];
  achievements: Fields[];
  target: Fields;
};

export type SectionId = keyof Resume;
export type FieldDef = [key: string, label: string, multiline?: boolean];
export type Section = {
  id: SectionId;
  title: string;
  kind: 'object' | 'list' | 'text';
  fields?: FieldDef[];
  hint?: string;
};

export const TEMPLATES: { id: TemplateId; name: string; note: string }[] = [
  { id: 'classic', name: 'Classic', note: 'Centered serif header with ruled section titles.' },
  { id: 'modern', name: 'Modern', note: 'Sans-serif with a navy rule beside the name.' },
  { id: 'minimal', name: 'Minimal', note: 'Open spacing and no rules.' },
  { id: 'technical', name: 'Technical', note: 'Monospace type for dense, scannable detail.' },
];

export const SECTIONS: Section[] = [
  { id: 'personal', title: 'Personal information', kind: 'object', fields: [['name', 'Full name'], ['email', 'Email'], ['phone', 'Phone'], ['city', 'City'], ['linkedin', 'LinkedIn URL'], ['github', 'GitHub URL'], ['portfolio', 'Portfolio URL']] },
  { id: 'summary', title: 'Professional summary', kind: 'text', hint: 'Two to four sentences on who you are and the role you want next.' },
  { id: 'education', title: 'Education', kind: 'list', fields: [['degree', 'Degree'], ['institution', 'Institution'], ['year', 'Graduation year'], ['grade', 'Grade or CGPA'], ['coursework', 'Relevant coursework', true]] },
  { id: 'experience', title: 'Experience and internships', kind: 'list', fields: [['role', 'Position'], ['company', 'Company'], ['dates', 'Dates'], ['details', 'Responsibilities and achievements, one per line', true]] },
  { id: 'skills', title: 'Skills', kind: 'object', fields: [['languages', 'Languages'], ['frameworks', 'Frameworks and libraries'], ['databases', 'Databases'], ['tools', 'Tools']] },
  { id: 'projects', title: 'Projects', kind: 'list', fields: [['title', 'Project title'], ['tech', 'Technologies'], ['link', 'Link'], ['details', 'Description and results', true]] },
  { id: 'certifications', title: 'Certifications and courses', kind: 'list', fields: [['name', 'Name'], ['issuer', 'Issuer'], ['year', 'Year']] },
  { id: 'achievements', title: 'Achievements and publications', kind: 'list', fields: [['title', 'Title'], ['details', 'Details', true]] },
  { id: 'target', title: 'Target job', kind: 'object', fields: [['jobTitle', 'Job title'], ['jobDescription', 'Job description', true]] },
];

const blankFields = (id: SectionId): Fields =>
  Object.fromEntries((SECTIONS.find((s) => s.id === id)?.fields ?? []).map(([k]) => [k, '']));

export const blankEntry = (id: SectionId): Fields => blankFields(id);

export const emptyResume: Resume = {
  personal: blankFields('personal'),
  summary: '',
  education: [],
  experience: [],
  skills: blankFields('skills'),
  projects: [],
  certifications: [],
  achievements: [],
  target: blankFields('target'),
};

// Fictional sample data for demonstration only.
export const sampleResume: Resume = {
  personal: { name: 'Maya Thornton', email: 'maya.thornton@example.com', phone: '+91 98200 00000', city: 'Pune', linkedin: 'linkedin.com/in/mayathornton', github: 'github.com/mayathornton', portfolio: 'mayathornton.dev' },
  summary: 'Final-year computer science student building backend services and data tools. Looking for an entry-level backend role where I can ship reliable software and learn from a strong engineering team.',
  education: [{ degree: 'B.Tech. Computer Science', institution: 'Lakeside Institute of Technology', year: '2026', grade: '8.4 CGPA', coursework: 'Databases, distributed systems, machine learning, operating systems' }],
  experience: [{ role: 'Software Engineering Intern', company: 'Northwind Labs', dates: 'June 2025 to August 2025', details: 'Built a REST service for invoice ingestion using Python and FastAPI.\nCut report generation time from 40 seconds to under 5 seconds.' }],
  skills: { languages: 'Python, TypeScript, SQL', frameworks: 'FastAPI, React, Next.js', databases: 'PostgreSQL, Redis', tools: 'Git, Docker, Linux' },
  projects: [{ title: 'Study Planner', tech: 'React, Node.js, PostgreSQL', link: 'github.com/mayathornton/study-planner', details: 'Turns course deadlines into a weekly plan. Piloted with 120 students.' }],
  certifications: [{ name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', year: '2025' }],
  achievements: [{ title: 'Best paper, student research symposium', details: 'Presented a retrieval model for searching course catalogues.' }],
  target: { jobTitle: 'Backend Engineer (Entry Level)', jobDescription: 'Build and maintain APIs, write tests, and work with PostgreSQL and cloud services.' },
};

export function validateResume(r: Resume): string[] {
  const errs: string[] = [];
  if (!r.personal.name?.trim()) errs.push('Add your full name in Personal information.');
  if (!/^\S+@\S+\.\S+$/.test(r.personal.email ?? '')) errs.push('Add a valid email address in Personal information.');
  if (!r.education.length && !r.experience.length) errs.push('Add at least one education or experience entry.');
  return errs;
}
