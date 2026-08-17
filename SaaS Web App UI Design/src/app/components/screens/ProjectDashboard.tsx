import { useParams, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Calendar, Users, Target, TrendingUp, CheckCircle2, Clock, AlertCircle, ArrowLeft, ListTodo } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useStore, computeProgress } from "../../store";

const velocityData = [
  { sprint: "Sprint 1", planned: 40, completed: 35 },
  { sprint: "Sprint 2", planned: 45, completed: 42 },
  { sprint: "Sprint 3", planned: 50, completed: 48 },
  { sprint: "Sprint 4", planned: 48, completed: 50 },
];

const documents = [
  { name: "Product Requirements Document", type: "PRD", updated: "2 days ago" },
  { name: "Technical Specification", type: "Tech Doc", updated: "1 week ago" },
  { name: "API Design Document", type: "Tech Doc", updated: "3 days ago" },
  { name: "User Research Findings", type: "Research", updated: "1 week ago" },
];

const teamMembers = [
  { name: "Sarah Johnson", role: "Product Manager", tasks: 12, avatar: "Sarah" },
  { name: "Mike Chen", role: "Tech Lead", tasks: 8, avatar: "Mike" },
  { name: "Emily Davis", role: "Designer", tasks: 6, avatar: "Emily" },
  { name: "David Kim", role: "Developer", tasks: 10, avatar: "David" },
  { name: "Alex Thompson", role: "QA Engineer", tasks: 7, avatar: "Alex" },
];

const statusColors: Record<string, string> = {
  "On Track": "bg-green-100 text-green-700 hover:bg-green-100",
  "At Risk": "bg-orange-100 text-orange-700 hover:bg-orange-100",
  "Delayed": "bg-red-100 text-red-700 hover:bg-red-100",
};

export function ProjectDashboard() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { getProject } = useStore();
  const project = getProject(projectId ?? "");

  if (!project) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500 mb-4">Project not found.</p>
        <Button variant="outline" onClick={() => navigate("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const allTasks = project.epics.flatMap(e => e.stories.flatMap(s => s.tasks));
  const progress = computeProgress(project);

  const tasksByStatus = [
    { name: "To Do", value: allTasks.filter(t => t.status === "To Do").length, color: "#94a3b8" },
    { name: "In Progress", value: allTasks.filter(t => t.status === "In Progress").length, color: "#3b82f6" },
    { name: "In Review", value: allTasks.filter(t => t.status === "In Review").length, color: "#f59e0b" },
    { name: "Done", value: allTasks.filter(t => t.status === "Done").length, color: "#10b981" },
  ];

  const formatDate = (d: string) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Projects
        </button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl">{project.name}</h1>
              <Badge className={statusColors[project.status]}>{project.status}</Badge>
            </div>
            <p className="text-slate-600 max-w-2xl">{project.description || "No description."}</p>
          </div>
          <Button onClick={() => navigate(`/projects/${project.id}/tasks`)}>
            <ListTodo className="w-4 h-4 mr-2" />
            Manage Tasks
          </Button>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-600">Timeline</p>
                  <p className="text-sm font-semibold">
                    {project.startDate ? `${formatDate(project.startDate)} – ${formatDate(project.endDate)}` : "No dates set"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-600">Progress</p>
                  <p className="text-sm font-semibold">{progress}% Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-600">Team Size</p>
                  <p className="text-sm font-semibold">{project.teamSize} Members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-600">Total Tasks</p>
                  <p className="text-sm font-semibold">{allTasks.length} tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="docs">Documents</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {allTasks.length === 0 ? (
                  <div className="flex items-center justify-center h-48 text-slate-400">
                    No tasks yet — <button className="ml-1 text-indigo-600 hover:underline" onClick={() => navigate(`/projects/${project.id}/tasks`)}>add some</button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={tasksByStatus.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                            {tasksByStatus.filter(d => d.value > 0).map((entry, i) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {tasksByStatus.map(s => (
                        <div key={s.name} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                          <span className="text-sm text-slate-600">{s.name}</span>
                          <span className="text-sm font-semibold ml-auto">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Workload</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamMembers.slice(0, project.teamSize || 5).map(member => (
                  <div key={member.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.avatar}`} />
                          <AvatarFallback>{member.avatar[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-slate-500">{member.role}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold">{member.tasks} tasks</span>
                    </div>
                    <Progress value={(member.tasks / 15) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Milestones & Objectives</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b">
                <div className="p-2 bg-green-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Design Phase Complete</h4>
                  <p className="text-sm text-slate-600">All wireframes and high-fidelity designs approved</p>
                  <p className="text-xs text-slate-500 mt-2">Completed Mar 15, 2026</p>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>
              </div>
              <div className="flex items-start gap-4 pb-4 border-b">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Core Features Development</h4>
                  <p className="text-sm text-slate-600">Implement authentication, dashboard, and user management</p>
                  <Progress value={progress} className="h-2 mt-3" />
                </div>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">In Progress</Badge>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Testing & QA</h4>
                  <p className="text-sm text-slate-600">Comprehensive testing across all platforms</p>
                  <p className="text-xs text-slate-500 mt-2">Expected: {formatDate(project.endDate)}</p>
                </div>
                <Badge variant="secondary">Upcoming</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <ListTodo className="w-10 h-10 mx-auto text-indigo-500" />
              <div>
                <p className="font-medium text-slate-800 mb-1">Full Task Management</p>
                <p className="text-sm text-slate-500">
                  Create epics, stories and tasks, assign owners, track completion, and manage approvals.
                </p>
              </div>
              <Button onClick={() => navigate(`/projects/${project.id}/tasks`)}>
                Open Task Board
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {documents.map(doc => (
                <div key={doc.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-slate-500">{doc.type} • Updated {doc.updated}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Sprint Velocity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={velocityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="sprint" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="planned" fill="#cbd5e1" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="completed" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {teamMembers.slice(0, project.teamSize || 5).map(member => (
                <div key={member.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.avatar}`} />
                      <AvatarFallback>{member.avatar[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-slate-600">{member.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{member.tasks} active tasks</p>
                    <p className="text-xs text-slate-500">85% completion rate</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
