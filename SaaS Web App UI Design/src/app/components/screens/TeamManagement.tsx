import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { UserPlus, Mail, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const teamMembers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    role: "Product Manager",
    tasksAssigned: 12,
    tasksCompleted: 10,
    performanceScore: 95,
    avatar: "Sarah",
    status: "Active"
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike.c@company.com",
    role: "Tech Lead",
    tasksAssigned: 15,
    tasksCompleted: 14,
    performanceScore: 92,
    avatar: "Mike",
    status: "Active"
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily.d@company.com",
    role: "Senior Designer",
    tasksAssigned: 10,
    tasksCompleted: 8,
    performanceScore: 88,
    avatar: "Emily",
    status: "Active"
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.k@company.com",
    role: "Senior Developer",
    tasksAssigned: 18,
    tasksCompleted: 16,
    performanceScore: 94,
    avatar: "David",
    status: "Active"
  },
  {
    id: 5,
    name: "Alex Thompson",
    email: "alex.t@company.com",
    role: "QA Engineer",
    tasksAssigned: 14,
    tasksCompleted: 12,
    performanceScore: 90,
    avatar: "Alex",
    status: "Active"
  },
  {
    id: 6,
    name: "Rachel Martinez",
    email: "rachel.m@company.com",
    role: "Developer",
    tasksAssigned: 16,
    tasksCompleted: 13,
    performanceScore: 87,
    avatar: "Rachel",
    status: "Active"
  },
  {
    id: 7,
    name: "James Wilson",
    email: "james.w@company.com",
    role: "Designer",
    tasksAssigned: 8,
    tasksCompleted: 7,
    performanceScore: 91,
    avatar: "James",
    status: "Active"
  },
  {
    id: 8,
    name: "Lisa Anderson",
    email: "lisa.a@company.com",
    role: "Developer",
    tasksAssigned: 12,
    tasksCompleted: 10,
    performanceScore: 89,
    avatar: "Lisa",
    status: "Active"
  },
];

const getRoleColor = (role: string) => {
  if (role.includes("Manager")) return "bg-purple-100 text-purple-700 hover:bg-purple-100";
  if (role.includes("Lead")) return "bg-blue-100 text-blue-700 hover:bg-blue-100";
  if (role.includes("Designer")) return "bg-pink-100 text-pink-700 hover:bg-pink-100";
  if (role.includes("Developer")) return "bg-green-100 text-green-700 hover:bg-green-100";
  if (role.includes("QA")) return "bg-orange-100 text-orange-700 hover:bg-orange-100";
  return "bg-slate-100 text-slate-700 hover:bg-slate-100";
};

export function TeamManagement() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Team Management</h1>
          <p className="text-slate-600">Manage team members and track their performance</p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1">Total Members</p>
              <p className="text-3xl font-semibold">{teamMembers.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1">Active Tasks</p>
              <p className="text-3xl font-semibold">
                {teamMembers.reduce((acc, m) => acc + (m.tasksAssigned - m.tasksCompleted), 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1">Completed Tasks</p>
              <p className="text-3xl font-semibold">
                {teamMembers.reduce((acc, m) => acc + m.tasksCompleted, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1">Avg Performance</p>
              <p className="text-3xl font-semibold">
                {Math.round(teamMembers.reduce((acc, m) => acc + m.performanceScore, 0) / teamMembers.length)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200">
                <tr>
                  <th className="text-left p-3 text-sm font-medium text-slate-600">Member</th>
                  <th className="text-left p-3 text-sm font-medium text-slate-600">Role</th>
                  <th className="text-left p-3 text-sm font-medium text-slate-600">Tasks Assigned</th>
                  <th className="text-left p-3 text-sm font-medium text-slate-600">Performance</th>
                  <th className="text-left p-3 text-sm font-medium text-slate-600">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-slate-600"></th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr key={member.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.avatar}`} />
                          <AvatarFallback>{member.avatar[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-slate-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={getRoleColor(member.role)}>
                        {member.role}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-semibold text-sm mb-1">
                          {member.tasksCompleted}/{member.tasksAssigned}
                        </p>
                        <Progress 
                          value={(member.tasksCompleted / member.tasksAssigned) * 100} 
                          className="h-1.5 w-20"
                        />
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Progress value={member.performanceScore} className="h-2 w-24" />
                        <span className="font-semibold text-sm">{member.performanceScore}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        {member.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Assign Tasks</DropdownMenuItem>
                          <DropdownMenuItem>View Performance</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Remove from Team</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Team Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamMembers.slice(0, 4).map((member) => (
          <Card key={member.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.avatar}`} />
                  <AvatarFallback>{member.avatar[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.role}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-600">Tasks</span>
                    <span className="font-semibold">{member.tasksCompleted}/{member.tasksAssigned}</span>
                  </div>
                  <Progress value={(member.tasksCompleted / member.tasksAssigned) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-600">Performance</span>
                    <span className="font-semibold">{member.performanceScore}%</span>
                  </div>
                  <Progress value={member.performanceScore} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
