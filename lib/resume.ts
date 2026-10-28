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

// Demonstration resume for Prajwal Kedari, drawn only from his CV and portfolio.
// Email and phone are omitted because this sample appears on the public landing page.
// Add them in the workspace. Every field is editable.
export const DEMO_LABEL = 'Demonstration resume: Prajwal Kedari. Every field is editable.';
export const sampleResume: Resume = {
  personal: { name: 'Prajwal Kedari', email: '', phone: '', city: 'Mumbai, Maharashtra, India', linkedin: 'linkedin.com/in/prajwalkedari', github: 'github.com/prajwalkedari', portfolio: 'prajwalkedari.is-a.dev' },
  summary: 'Computer engineering graduate specialising in AI and ML, with a focus on Linux systems, backend development, and cloud fundamentals. Builds FastAPI services, containerised deployments, and a published open-source PyPI package.',
  education: [{ degree: 'B.E. in Computer Science & Engineering (AI & ML)', institution: 'Bharat College of Engineering, University of Mumbai', year: '2022 – 2026', grade: '', coursework: '' }],
  experience: [{ role: 'Data Science Trainee', company: 'Imarticus Learning, Mumbai', dates: '2025 – 2026', details: '120-hour professional industry training program.\nPerformed exploratory data analysis and statistical validation, and built supervised ML models with Pandas and NumPy.\nWrote optimised relational SQL queries for business metrics and transactional reporting.' }],
  skills: { languages: 'Python, SQL, JavaScript, Java, C++', frameworks: 'FastAPI, Flask, Node.js, Express.js, Pydantic', databases: 'PostgreSQL, MySQL, SQLite, MongoDB, Supabase', tools: 'Linux, shell scripting, Docker, Git, GitHub, AWS (EC2, S3, IAM, VPC), Pandas, NumPy, scikit-learn, XGBoost, MLflow' },
  projects: [
    { title: 'WiFi Management Tool (PyPI)', tech: 'Python, Linux CLI, nmcli, packaging', link: 'pypi.org/project/wifimangement-linux', details: 'Published an open-source Python library wrapping nmcli for Wi-Fi scanning, connection control, network toggling, and interface discovery.' },
    { title: 'SmartShield-AI: Malware Detection Pipeline', tech: 'Python, FastAPI, XGBoost, Docker, MLflow', link: 'github.com/prajwalkedari', details: 'Classifies malware from PE headers with 95% accuracy, serves inference through FastAPI, and tracks experiments with MLflow.' },
    { title: 'AI-Powered Task Management Backend', tech: 'Python, FastAPI, PostgreSQL, Supabase, JWT, Docker', link: 'github.com/prajwalkedari', details: 'REST APIs with JWT authentication, role-based access control, status filtering, and OpenAPI documentation. Integrates the Gemini API for task summaries.' },
    { title: 'HOWJIS Fashion (live e-commerce)', tech: 'WooCommerce, PHP, MySQL, REST webhooks', link: 'prajwalkedari.is-a.dev', details: 'Runs an active online store on Linux hosting with automated inventory and payment webhooks.' },
  ],
  certifications: [{ name: 'Machine Learning Specialization', issuer: 'DeepLearning.AI and Stanford University', year: '' }],
  achievements: [
    { title: 'Published research: SmartShield-AI (IJCRT)', details: 'Paper ID IJCRT2603747.' },
    { title: 'Smart India Hackathon', details: 'Selected team leader for technical architecture and code management.' },
    { title: 'Competitive programming', details: 'Solved 150+ DSA problems on LeetCode and HackerRank.' },
  ],
  target: { jobTitle: 'Applied AI/ML Engineer', jobDescription: '' },
};

export function validateResume(r: Resume): string[] {
  const errs: string[] = [];
  if (!r.personal.name?.trim()) errs.push('Add your full name in Personal information.');
  if (!/^\S+@\S+\.\S+$/.test(r.personal.email ?? '')) errs.push('Add a valid email address in Personal information.');
  if (!r.education.length && !r.experience.length) errs.push('Add at least one education or experience entry.');
  return errs;
}
