import { AI_COHORT_PATH } from './aiCohort';

export type CourseCategory = 'ai-data-science' | 'software-engineering' | 'product-design';
export type CourseStatus = 'available' | 'coming-soon';

export interface Course {
  id: string | null;
  slug: string;
  title: string;
  description: string;
  category: CourseCategory;
  path: string;
  track: string;
  level: string;
  status: CourseStatus;
  featured: boolean;
  thumbnail: string;
  outcome: string;
  audience: string;
  prerequisites: string;
  outcomes: string[];
  cohortPath: string | null;
}

export const courses: Course[] = [
  {
    id: '34a0a688-3774-4c8c-ae0b-5cb5984c4dcf', slug: 'build-an-ai-lead-qualification-app-with-python',
    title: 'Build an AI Lead Qualification App with Python',
    description: 'Build a practical system that evaluates incoming leads, applies clear qualification rules, and helps a sales team focus on the best opportunities.',
    category: 'ai-data-science', path: 'AI Engineering', track: 'AI Application Development', level: 'L2 Explorer', status: 'available', featured: true,
    thumbnail: '/images/course-ai-lead-qualification.webp',
    outcome: 'A working Python application that captures, assesses, and prioritises sales leads using an AI-assisted workflow.',
    audience: 'Early-career developers and technical builders who want to turn Python fundamentals into a useful business application.',
    prerequisites: 'Basic Python syntax and confidence working with functions, lists, and dictionaries.',
    outcomes: ['Translate lead-qualification requirements into a reliable application workflow.', 'Combine structured business rules with AI-generated insights.', 'Present prioritised leads in a clear interface a sales team can use.'],
    cohortPath: AI_COHORT_PATH,
  },
  {
    id: '7f656c88-e275-4836-a476-27ca9f692808', slug: 'build-an-ai-research-assistant-that-answers-from-documents',
    title: 'Build an AI Research Assistant That Answers From Documents',
    description: 'Create an assistant that searches supplied documents, returns grounded answers, and points people back to the information it used.',
    category: 'ai-data-science', path: 'AI Engineering', track: 'AI Application Development', level: 'L3 Intermediate', status: 'available', featured: true,
    thumbnail: '/images/course-ai-research-assistant.webp',
    outcome: 'A document-based research assistant that retrieves relevant context and produces useful, source-grounded answers.',
    audience: 'Developers ready to build beyond simple chat prompts and work with retrieval, context, and document-based AI experiences.',
    prerequisites: 'Comfort with Python, APIs, and basic application development.',
    outcomes: ['Prepare documents for useful semantic retrieval.', 'Build a question-answering flow grounded in supplied sources.', 'Design responses that make source context easy to verify.'],
    cohortPath: AI_COHORT_PATH,
  },
  {
    id: '1bab2ae6-dc48-4445-adb5-3188a8f72c24', slug: 'build-a-customer-support-ai-that-uses-tools',
    title: 'Build a Customer Support AI That Uses Tools',
    description: 'Build a support assistant that understands customer requests, calls the right tools, and completes useful actions instead of only chatting.',
    category: 'ai-data-science', path: 'AI Engineering', track: 'AI Application Development', level: 'L3 Intermediate', status: 'available', featured: true,
    thumbnail: '/images/course-customer-support-ai.webp',
    outcome: 'A tool-using customer support assistant that can look up information, take defined actions, and respond with appropriate context.',
    audience: 'Developers who want to build dependable AI product workflows around real customer operations.',
    prerequisites: 'Working Python knowledge and prior experience calling an API.',
    outcomes: ['Design safe, focused tools for an AI assistant to call.', 'Route customer requests to the correct support action.', 'Handle tool results and failures with clear user-facing responses.'],
    cohortPath: AI_COHORT_PATH,
  },
  {
    id: 'bf8b7a73-3531-4f92-bd9d-ef727e6672e5', slug: 'build-a-recruitment-agent-with-langgraph',
    title: 'Build a Recruitment Agent with LangGraph',
    description: 'Create a multi-step recruitment agent that evaluates applicants consistently and keeps the workflow understandable and controllable.',
    category: 'ai-data-science', path: 'AI Engineering', track: 'AI Agents', level: 'L4 Professional', status: 'available', featured: true,
    thumbnail: '/images/course-recruitment-agent.webp',
    outcome: 'A LangGraph recruitment agent that coordinates screening steps, records decisions, and produces a reasoned shortlist.',
    audience: 'Experienced Python builders who want to design stateful agent workflows for a realistic operational use case.',
    prerequisites: 'Strong Python fundamentals, API experience, and familiarity with LLM application concepts.',
    outcomes: ['Model a recruitment process as a stateful graph.', 'Coordinate specialised steps without losing workflow control.', 'Create traceable evaluation outputs for human review.'],
    cohortPath: AI_COHORT_PATH,
  },
  {
    id: null, slug: 'build-your-first-website-with-html-css-and-javascript', title: 'Build Your First Website with HTML, CSS & JavaScript',
    description: 'Learn the foundations of the web by building and styling a responsive website, then adding your first interactive behaviour.',
    category: 'software-engineering', path: 'Software Engineering', track: 'Web Development', level: 'L1 Beginner', status: 'coming-soon', featured: false,
    thumbnail: '/images/course-first-website.webp', outcome: '', audience: '', prerequisites: '', outcomes: [], cohortPath: null,
  },
  {
    id: null, slug: 'design-your-first-mobile-app-in-figma', title: 'Design Your First Mobile App in Figma',
    description: 'Turn an app idea into a thoughtful set of mobile screens while learning practical interface and product-design foundations.',
    category: 'product-design', path: 'Product & Design', track: 'UI/UX Design', level: 'L1 Beginner', status: 'coming-soon', featured: false,
    thumbnail: '/images/course-first-mobile-app.webp', outcome: '', audience: '', prerequisites: '', outcomes: [], cohortPath: null,
  },
];

export const availableCourses = courses.filter((course) => course.status === 'available');
export const getCourseBySlug = (slug: string | undefined) => courses.find((course) => course.slug === slug && course.status === 'available');
export const getCoursePath = (course: Course) => `/course/${course.slug}/`;
export const getSelfPacedUrl = (course: Course) => `/join/open-learning?courseId=${course.id}&source=${encodeURIComponent(`https://universityx.app${getCoursePath(course)}`)}`;
