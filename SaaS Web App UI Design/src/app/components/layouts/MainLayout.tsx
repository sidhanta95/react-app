import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  FileText,
  BarChart3,
  Users,
  Puzzle,
  Settings,
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useStore } from "../../store";

const staticNav = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Team", href: "/team", icon: Users },
  { name: "Integrations", href: "/integrations", icon: Puzzle },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { projects } = useStore();
  const [projectsOpen, setProjectsOpen] = useState(true);

  function isActive(href: string) {
    return href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">TaskFlow AI</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
          {/* Dashboard */}
          <Link
            to="/"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              location.pathname === "/" ? "bg-indigo-50 text-indigo-600" : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-sm">Dashboard</span>
          </Link>

          {/* Projects section */}
          <div className="pt-2">
            <div
              className="flex items-center justify-between px-3 py-1.5 cursor-pointer group"
              onClick={() => setProjectsOpen(o => !o)}
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <FolderKanban className="w-3.5 h-3.5" />
                Projects
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-200 transition-opacity"
                  onClick={e => { e.stopPropagation(); navigate("/"); }}
                  title="Manage projects"
                >
                  <Plus className="w-3 h-3 text-slate-500" />
                </button>
                {projectsOpen ? (
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                )}
              </div>
            </div>

            {projectsOpen && (
              <div className="mt-0.5 space-y-0.5">
                {projects.map(project => {
                  const active = location.pathname.startsWith(`/projects/${project.id}`);
                  return (
                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors text-sm truncate ${
                        active ? "bg-indigo-50 text-indigo-700 font-medium" : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                      <span className="truncate">{project.name}</span>
                    </Link>
                  );
                })}
                {projects.length === 0 && (
                  <p className="px-3 py-1.5 text-xs text-slate-400 italic">No projects yet</p>
                )}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="pt-2 border-t border-slate-100 mt-2" />

          {/* Static nav items */}
          {staticNav.slice(1).map(item => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.href) ? "bg-indigo-50 text-indigo-600" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Sarah Johnson</p>
              <p className="text-xs text-slate-500 truncate">Product Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search tasks, projects, documents..."
                className="pl-10 bg-slate-50 border-slate-200"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <HelpCircle className="w-5 h-5 text-slate-600" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
            <Avatar className="w-8 h-8 cursor-pointer">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
