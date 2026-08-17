import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

const objectives = [
  { name: "Mobile App Redesign", progress: 75, status: "On Track", tasks: "12/16" },
  { name: "API Performance Optimization", progress: 90, status: "Ahead", tasks: "9/10" },
  { name: "User Dashboard Enhancement", progress: 45, status: "At Risk", tasks: "5/12" },
  { name: "Security Audit Implementation", progress: 60, status: "On Track", tasks: "6/10" },
];

const teamPerformance = [
  { name: "Sarah Johnson", role: "Product Manager", tasksCompleted: 24, performance: 95, avatar: "Sarah" },
  { name: "Mike Chen", role: "Tech Lead", tasksCompleted: 32, performance: 92, avatar: "Mike" },
  { name: "Emily Davis", role: "Designer", tasksCompleted: 28, performance: 88, avatar: "Emily" },
  { name: "David Kim", role: "Developer", tasksCompleted: 35, performance: 94, avatar: "David" },
  { name: "Alex Thompson", role: "QA Engineer", tasksCompleted: 26, performance: 90, avatar: "Alex" },
];

const burndownData = [
  { day: "Week 1", planned: 100, actual: 98 },
  { day: "Week 2", planned: 80, actual: 75 },
  { day: "Week 3", planned: 60, actual: 52 },
  { day: "Week 4", planned: 40, actual: 35 },
  { day: "Week 5", planned: 20, actual: 18 },
  { day: "Week 6", planned: 0, actual: 5 },
];

const velocityData = [
  { sprint: "Sprint 1", velocity: 35 },
  { sprint: "Sprint 2", velocity: 42 },
  { sprint: "Sprint 3", velocity: 48 },
  { sprint: "Sprint 4", velocity: 50 },
  { sprint: "Sprint 5", velocity: 47 },
  { sprint: "Sprint 6", velocity: 52 },
];

const riskAlerts = [
  { 
    project: "User Dashboard Enhancement", 
    issue: "3 tasks delayed by 2+ days", 
    severity: "high",
    assignee: "Emily Davis" 
  },
  { 
    project: "API Performance", 
    issue: "Waiting for external dependency", 
    severity: "medium",
    assignee: "Mike Chen" 
  },
  { 
    project: "Security Audit", 
    issue: "PR pending review for 3 days", 
    severity: "medium",
    assignee: "David Kim" 
  },
];

export function AnalyticsDashboard() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Analytics Dashboard</h1>
        <p className="text-slate-600">Track progress, performance, and identify bottlenecks</p>
      </div>

      {/* Objective Progress */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Objective Progress</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {objectives.map((objective) => (
            <Card key={objective.name}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{objective.name}</h3>
                    <p className="text-sm text-slate-600">{objective.tasks} tasks completed</p>
                  </div>
                  <Badge 
                    variant={objective.status === "Ahead" ? "default" : objective.status === "At Risk" ? "destructive" : "secondary"}
                    className={objective.status === "Ahead" ? "bg-green-100 text-green-700 hover:bg-green-100" : objective.status === "On Track" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : ""}
                  >
                    {objective.status === "Ahead" && <TrendingUp className="w-3 h-3 mr-1" />}
                    {objective.status === "At Risk" && <TrendingDown className="w-3 h-3 mr-1" />}
                    {objective.status}
                  </Badge>
                </div>
                <Progress value={objective.progress} className="h-2" />
                <p className="text-sm font-medium mt-2">{objective.progress}%</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Burndown Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Burndown Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={burndownData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="planned" 
                  stroke="#cbd5e1" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  dot={{ fill: '#6366f1', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Velocity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Team Velocity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="sprint" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="velocity" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200">
                <tr>
                  <th className="text-left p-3 text-sm font-medium text-slate-600">Team Member</th>
                  <th className="text-left p-3 text-sm font-medium text-slate-600">Role</th>
                  <th className="text-left p-3 text-sm font-medium text-slate-600">Tasks Completed</th>
                  <th className="text-left p-3 text-sm font-medium text-slate-600">Performance Score</th>
                  <th className="text-left p-3 text-sm font-medium text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {teamPerformance.map((member) => (
                  <tr key={member.name} className="border-b border-slate-100">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.avatar}`} />
                          <AvatarFallback>{member.avatar[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{member.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600">{member.role}</td>
                    <td className="p-3 font-semibold">{member.tasksCompleted}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Progress value={member.performance} className="h-2 w-24" />
                        <span className="font-semibold text-sm">{member.performance}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Risk Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {riskAlerts.map((alert, index) => (
            <div 
              key={index}
              className={`p-4 border-l-4 rounded-lg ${
                alert.severity === "high" 
                  ? "bg-red-50 border-red-500" 
                  : "bg-orange-50 border-orange-500"
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertCircle className={`w-5 h-5 flex-shrink-0 ${
                  alert.severity === "high" ? "text-red-600" : "text-orange-600"
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{alert.project}</h4>
                    <Badge 
                      variant={alert.severity === "high" ? "destructive" : "secondary"}
                      className={alert.severity === "medium" ? "bg-orange-100 text-orange-700 hover:bg-orange-100" : ""}
                    >
                      {alert.severity === "high" ? "High" : "Medium"} Priority
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-700 mb-2">{alert.issue}</p>
                  <p className="text-xs text-slate-600">Assigned to: {alert.assignee}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
