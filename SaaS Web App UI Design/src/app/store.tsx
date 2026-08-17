import { createContext, useContext, useReducer, ReactNode } from "react";

export type TaskStatus = "To Do" | "In Progress" | "In Review" | "Done";
export type Priority = "High" | "Medium" | "Low";
export type ProjectStatus = "On Track" | "At Risk" | "Delayed";

export interface Task {
  id: string;
  title: string;
  assignee: string;
  status: TaskStatus;
  priority: Priority;
  completion: number;
  description?: string;
}

export interface Story {
  id: string;
  name: string;
  tasks: Task[];
}

export interface Epic {
  id: string;
  name: string;
  stories: Story[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  lead: string;
  startDate: string;
  endDate: string;
  teamSize: number;
  epics: Epic[];
}

const initialProjects: Project[] = [
  {
    id: "1",
    name: "Mobile App Redesign",
    description: "Complete redesign of the mobile application with focus on user experience, performance optimization, and modern design patterns.",
    status: "On Track",
    lead: "Sarah Johnson",
    startDate: "2026-03-01",
    endDate: "2026-06-30",
    teamSize: 5,
    epics: [
      {
        id: "e1",
        name: "User Authentication",
        stories: [
          {
            id: "s1",
            name: "Login & Registration",
            tasks: [
              { id: "t1", title: "Design login screen", assignee: "Emily", status: "Done", priority: "High", completion: 100, description: "Create high-fidelity Figma designs for login screen." },
              { id: "t2", title: "Implement OAuth integration", assignee: "Mike", status: "In Progress", priority: "High", completion: 75, description: "Implement OAuth 2.0 for Google and GitHub sign-in." },
              { id: "t3", title: "Add password reset flow", assignee: "David", status: "In Review", priority: "Medium", completion: 90, description: "Email-based password reset with token expiry." },
            ],
          },
          {
            id: "s2",
            name: "User Profile Management",
            tasks: [
              { id: "t4", title: "Create profile edit UI", assignee: "Emily", status: "In Progress", priority: "Medium", completion: 60 },
              { id: "t5", title: "Implement avatar upload", assignee: "David", status: "To Do", priority: "Low", completion: 0 },
            ],
          },
        ],
      },
      {
        id: "e2",
        name: "Dashboard Features",
        stories: [
          {
            id: "s3",
            name: "Analytics Module",
            tasks: [
              { id: "t6", title: "Design analytics dashboard", assignee: "Emily", status: "Done", priority: "High", completion: 100 },
              { id: "t7", title: "Integrate charts library", assignee: "Mike", status: "Done", priority: "High", completion: 100 },
              { id: "t8", title: "Build data visualization", assignee: "David", status: "In Progress", priority: "High", completion: 70 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "API Integration",
    description: "Build and integrate RESTful APIs for third-party services and internal microservices.",
    status: "On Track",
    lead: "Mike Chen",
    startDate: "2026-04-01",
    endDate: "2026-07-31",
    teamSize: 3,
    epics: [
      {
        id: "e3",
        name: "External APIs",
        stories: [
          {
            id: "s4",
            name: "Payment Gateway",
            tasks: [
              { id: "t9", title: "Stripe integration", assignee: "Mike", status: "In Progress", priority: "High", completion: 65 },
              { id: "t10", title: "Payment webhook handler", assignee: "David", status: "To Do", priority: "High", completion: 0 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Marketing Website",
    description: "New marketing website with CMS, blog, and lead generation features.",
    status: "At Risk",
    lead: "Emily Davis",
    startDate: "2026-02-01",
    endDate: "2026-05-31",
    teamSize: 4,
    epics: [],
  },
  {
    id: "4",
    name: "Analytics Dashboard",
    description: "Internal analytics and reporting dashboard for business intelligence.",
    status: "On Track",
    lead: "David Kim",
    startDate: "2026-01-15",
    endDate: "2026-04-30",
    teamSize: 3,
    epics: [],
  },
  {
    id: "5",
    name: "User Authentication Service",
    description: "Standalone auth service with SSO, MFA, and role-based access control.",
    status: "Delayed",
    lead: "Alex Thompson",
    startDate: "2026-05-01",
    endDate: "2026-08-31",
    teamSize: 2,
    epics: [],
  },
];

type Action =
  | { type: "ADD_PROJECT"; project: Project }
  | { type: "UPDATE_PROJECT"; id: string; updates: Partial<Omit<Project, "id" | "epics">> }
  | { type: "DELETE_PROJECT"; id: string }
  | { type: "ADD_EPIC"; projectId: string; epic: Epic }
  | { type: "ADD_STORY"; projectId: string; epicId: string; story: Story }
  | { type: "ADD_TASK"; projectId: string; epicId: string; storyId: string; task: Task }
  | { type: "UPDATE_TASK"; projectId: string; epicId: string; storyId: string; taskId: string; updates: Partial<Task> };

function reducer(state: Project[], action: Action): Project[] {
  switch (action.type) {
    case "ADD_PROJECT":
      return [...state, action.project];

    case "UPDATE_PROJECT":
      return state.map(p => (p.id === action.id ? { ...p, ...action.updates } : p));

    case "DELETE_PROJECT":
      return state.filter(p => p.id !== action.id);

    case "ADD_EPIC":
      return state.map(p =>
        p.id === action.projectId ? { ...p, epics: [...p.epics, action.epic] } : p
      );

    case "ADD_STORY":
      return state.map(p =>
        p.id === action.projectId
          ? {
              ...p,
              epics: p.epics.map(e =>
                e.id === action.epicId ? { ...e, stories: [...e.stories, action.story] } : e
              ),
            }
          : p
      );

    case "ADD_TASK":
      return state.map(p =>
        p.id === action.projectId
          ? {
              ...p,
              epics: p.epics.map(e =>
                e.id === action.epicId
                  ? {
                      ...e,
                      stories: e.stories.map(s =>
                        s.id === action.storyId ? { ...s, tasks: [...s.tasks, action.task] } : s
                      ),
                    }
                  : e
              ),
            }
          : p
      );

    case "UPDATE_TASK":
      return state.map(p =>
        p.id === action.projectId
          ? {
              ...p,
              epics: p.epics.map(e =>
                e.id === action.epicId
                  ? {
                      ...e,
                      stories: e.stories.map(s =>
                        s.id === action.storyId
                          ? {
                              ...s,
                              tasks: s.tasks.map(t =>
                                t.id === action.taskId ? { ...t, ...action.updates } : t
                              ),
                            }
                          : s
                      ),
                    }
                  : e
              ),
            }
          : p
      );

    default:
      return state;
  }
}

interface StoreContextValue {
  projects: Project[];
  dispatch: React.Dispatch<Action>;
  getProject: (id: string) => Project | undefined;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [projects, dispatch] = useReducer(reducer, initialProjects);
  const getProject = (id: string) => projects.find(p => p.id === id);
  return (
    <StoreContext.Provider value={{ projects, dispatch, getProject }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function computeProgress(project: Project): number {
  const allTasks = project.epics.flatMap(e => e.stories.flatMap(s => s.tasks));
  if (allTasks.length === 0) return 0;
  const avg = allTasks.reduce((sum, t) => sum + t.completion, 0) / allTasks.length;
  return Math.round(avg);
}

export function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
