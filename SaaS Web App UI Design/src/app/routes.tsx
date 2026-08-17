import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/layouts/MainLayout";
import { AuthLayout } from "./components/layouts/AuthLayout";
import { LoginScreen } from "./components/screens/LoginScreen";
import { WorkspaceDashboard } from "./components/screens/WorkspaceDashboard";
import { ProjectDashboard } from "./components/screens/ProjectDashboard";
import { TaskManagement } from "./components/screens/TaskManagement";
import { DocumentScreen } from "./components/screens/DocumentScreen";
import { AnalyticsDashboard } from "./components/screens/AnalyticsDashboard";
import { TeamManagement } from "./components/screens/TeamManagement";
import { IntegrationsScreen } from "./components/screens/IntegrationsScreen";
import { SettingsScreen } from "./components/screens/SettingsScreen";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <AuthLayout />,
    children: [{ index: true, element: <LoginScreen /> }],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <WorkspaceDashboard /> },
      { path: "projects/:projectId", element: <ProjectDashboard /> },
      { path: "projects/:projectId/tasks", element: <TaskManagement /> },
      { path: "tasks", element: <TaskManagement /> },
      { path: "documents", element: <DocumentScreen /> },
      { path: "analytics", element: <AnalyticsDashboard /> },
      { path: "team", element: <TeamManagement /> },
      { path: "integrations", element: <IntegrationsScreen /> },
      { path: "settings", element: <SettingsScreen /> },
    ],
  },
]);
