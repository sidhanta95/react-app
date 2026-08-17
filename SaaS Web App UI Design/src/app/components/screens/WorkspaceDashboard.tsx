import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useStore, computeProgress, uid, type ProjectStatus } from "../../store";

const chartData = [
  { name: "Mon", tasks: 12 },
  { name: "Tue", tasks: 19 },
  { name: "Wed", tasks: 15 },
  { name: "Thu", tasks: 25 },
  { name: "Fri", tasks: 22 },
  { name: "Sat", tasks: 18 },
  { name: "Sun", tasks: 20 },
];

const activities = [
  { user: "Mike Chen", action: "completed", item: "PR Review for Login Component", time: "5 min ago", avatar: "Mike" },
  { user: "Sarah Johnson", action: "added", item: "Figma design to User Profile task", time: "12 min ago", avatar: "Sarah" },
  { user: "Emily Davis", action: "approved", item: "Homepage redesign PR", time: "25 min ago", avatar: "Emily" },
  { user: "David Kim", action: "created", item: "new epic: Analytics Module", time: "1 hour ago", avatar: "David" },
  { user: "Alex Thompson", action: "commented on", item: "Database schema discussion", time: "2 hours ago", avatar: "Alex" },
];

const statusColors: Record<string, string> = {
  "On Track": "bg-green-100 text-green-700 hover:bg-green-100",
  "At Risk": "bg-orange-100 text-orange-700 hover:bg-orange-100",
  "Delayed": "bg-red-100 text-red-700 hover:bg-red-100",
};

interface NewProjectForm {
  name: string;
  description: string;
  lead: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  teamSize: string;
}

const defaultForm: NewProjectForm = {
  name: "",
  description: "",
  lead: "",
  startDate: "",
  endDate: "",
  status: "On Track",
  teamSize: "3",
};

export function WorkspaceDashboard() {
  const navigate = useNavigate();
  const { projects, dispatch } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<NewProjectForm>(defaultForm);

  const allTasks = projects.flatMap(p =>
    p.epics.flatMap(e => e.stories.flatMap(s => s.tasks))
  );
  const activeTasks = allTasks.filter(t => t.status === "In Progress").length;
  const delayedProjects = projects.filter(p => p.status === "Delayed").length;
  const completionRate =
    allTasks.length > 0
      ? Math.round(allTasks.reduce((s, t) => s + t.completion, 0) / allTasks.length)
      : 0;

  const statsCards = [
    { title: "Total Projects", value: String(projects.length), change: `${projects.length} active`, icon: FolderKanban, color: "text-blue-600 bg-blue-50" },
    { title: "Active Tasks", value: String(activeTasks), change: `${allTasks.length} total tasks`, icon: CheckCircle2, color: "text-green-600 bg-green-50" },
    { title: "Delayed Projects", value: String(delayedProjects), change: `${projects.filter(p => p.status === "At Risk").length} at risk`, icon: Clock, color: "text-orange-600 bg-orange-50" },
    { title: "Completion Rate", value: `${completionRate}%`, change: "across all tasks", icon: TrendingUp, color: "text-purple-600 bg-purple-50" },
  ];

  function handleCreateProject() {
    if (!form.name.trim()) return;
    dispatch({
      type: "ADD_PROJECT",
      project: {
        id: uid(),
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
        lead: form.lead.trim() || "Unassigned",
        startDate: form.startDate,
        endDate: form.endDate,
        teamSize: parseInt(form.teamSize) || 1,
        epics: [],
      },
    });
    setForm(defaultForm);
    setDialogOpen(false);
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl mb-2">Workspace Dashboard</h1>
          <p className="text-slate-600">Welcome back! Here's what's happening with your projects.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map(stat => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">{stat.title}</p>
                  <p className="text-3xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active Projects</CardTitle>
            <span className="text-sm text-slate-500">{projects.length} projects</span>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <FolderKanban className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                <p className="font-medium">No projects yet</p>
                <p className="text-sm">Create your first project to get started.</p>
              </div>
            )}
            {projects.map(project => {
              const progress = computeProgress(project);
              const taskCount = project.epics.flatMap(e => e.stories.flatMap(s => s.tasks)).length;
              return (
                <div
                  key={project.id}
                  className="space-y-3 pb-4 border-b last:border-b-0 last:pb-0 group cursor-pointer"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium group-hover:text-indigo-600 transition-colors">{project.name}</h4>
                        <Badge className={statusColors[project.status]}>{project.status}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span>{taskCount} tasks</span>
                        <span>•</span>
                        <span>Led by {project.lead}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right min-w-12">
                        <div className="text-sm font-medium">{progress}%</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.avatar}`} />
                  <AvatarFallback>{activity.avatar[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-slate-600">{activity.action}</span>{" "}
                    <span className="font-medium">{activity.item}</span>
                  </p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Task Completion Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Area type="monotone" dataKey="tasks" stroke="#6366f1" fillOpacity={1} fill="url(#colorTasks)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* New Project Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Project Name *</Label>
              <Input
                className="mt-1.5"
                placeholder="e.g. Customer Portal v2"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                className="mt-1.5"
                placeholder="Brief description of the project"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Project Lead</Label>
                <Input
                  className="mt-1.5"
                  placeholder="e.g. Sarah Johnson"
                  value={form.lead}
                  onChange={e => setForm(f => ({ ...f, lead: e.target.value }))}
                />
              </div>
              <div>
                <Label>Team Size</Label>
                <Input
                  className="mt-1.5"
                  type="number"
                  min="1"
                  placeholder="3"
                  value={form.teamSize}
                  onChange={e => setForm(f => ({ ...f, teamSize: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  className="mt-1.5"
                  type="date"
                  value={form.startDate}
                  onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  className="mt-1.5"
                  type="date"
                  value={form.endDate}
                  onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={v => setForm(f => ({ ...f, status: v as ProjectStatus }))}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On Track">On Track</SelectItem>
                  <SelectItem value="At Risk">At Risk</SelectItem>
                  <SelectItem value="Delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateProject} disabled={!form.name.trim()}>
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
