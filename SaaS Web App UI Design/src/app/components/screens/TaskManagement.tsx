import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Progress } from "../ui/progress";
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
  ChevronRight,
  ChevronDown,
  List,
  LayoutGrid,
  Plus,
  FileText,
  Github,
  Figma,
  Check,
  X,
  ArrowLeft,
  Layers,
  BookOpen,
  CheckSquare,
} from "lucide-react";
import { useStore, uid, type Task, type TaskStatus, type Priority } from "../../store";

const ASSIGNEES = ["Emily", "Mike", "David", "Sarah", "Alex"];
const ASSIGNEE_FULL: Record<string, string> = {
  Emily: "Emily Davis",
  Mike: "Mike Chen",
  David: "David Kim",
  Sarah: "Sarah Johnson",
  Alex: "Alex Thompson",
};

const approvers = [
  { role: "Developer", name: "Mike Chen", status: "approved" as const, avatar: "Mike" },
  { role: "Tech Lead", name: "Sarah Johnson", status: "approved" as const, avatar: "Sarah" },
  { role: "QA", name: "Alex Thompson", status: "pending" as const, avatar: "Alex" },
  { role: "Product Manager", name: "Emily Davis", status: "pending" as const, avatar: "Emily" },
];

function getStatusColor(status: string) {
  switch (status) {
    case "Done": return "bg-green-100 text-green-700 hover:bg-green-100";
    case "In Progress": return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    case "In Review": return "bg-orange-100 text-orange-700 hover:bg-orange-100";
    default: return "bg-slate-100 text-slate-700 hover:bg-slate-100";
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "High": return "text-red-600";
    case "Medium": return "text-orange-600";
    default: return "text-slate-500";
  }
}

interface FlatTask extends Task {
  epicId: string;
  epicName: string;
  storyId: string;
  storyName: string;
}

export function TaskManagement() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, getProject, dispatch } = useStore();

  const project = projectId ? getProject(projectId) : null;
  const epics = project ? project.epics : projects.flatMap(p => p.epics);

  const allTasks: FlatTask[] = epics.flatMap(epic =>
    epic.stories.flatMap(story =>
      story.tasks.map(task => ({
        ...task,
        epicId: epic.id,
        epicName: epic.name,
        storyId: story.id,
        storyName: story.name,
      }))
    )
  );

  const [selectedTask, setSelectedTask] = useState<FlatTask | null>(allTasks[2] ?? null);
  const [expandedEpics, setExpandedEpics] = useState<string[]>(epics.map(e => e.id));
  const [expandedStories, setExpandedStories] = useState<string[]>(
    epics.flatMap(e => e.stories.map(s => s.id))
  );
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

  // Dialog states
  const [epicDialog, setEpicDialog] = useState(false);
  const [storyDialog, setStoryDialog] = useState<string | null>(null); // epicId
  const [taskDialog, setTaskDialog] = useState<{ epicId: string; storyId: string } | null>(null);
  const [epicName, setEpicName] = useState("");
  const [storyName, setStoryName] = useState("");
  const [taskForm, setTaskForm] = useState({ title: "", assignee: "Emily", status: "To Do" as TaskStatus, priority: "Medium" as Priority, description: "" });

  // Right-panel edit state
  const [taskDesc, setTaskDesc] = useState(selectedTask?.description ?? "");

  function selectTask(t: FlatTask) {
    setSelectedTask(t);
    setTaskDesc(t.description ?? "");
  }

  function toggleEpic(id: string) {
    setExpandedEpics(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function toggleStory(id: string) {
    setExpandedStories(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function handleAddEpic() {
    if (!epicName.trim() || !projectId) return;
    dispatch({ type: "ADD_EPIC", projectId, epic: { id: uid(), name: epicName.trim(), stories: [] } });
    setEpicName("");
    setEpicDialog(false);
  }

  function handleAddStory() {
    if (!storyName.trim() || !projectId || !storyDialog) return;
    const newStory = { id: uid(), name: storyName.trim(), tasks: [] };
    dispatch({ type: "ADD_STORY", projectId, epicId: storyDialog, story: newStory });
    setExpandedStories(prev => [...prev, newStory.id]);
    setStoryName("");
    setStoryDialog(null);
  }

  function handleAddTask() {
    if (!taskForm.title.trim() || !projectId || !taskDialog) return;
    dispatch({
      type: "ADD_TASK",
      projectId,
      epicId: taskDialog.epicId,
      storyId: taskDialog.storyId,
      task: { id: uid(), title: taskForm.title.trim(), assignee: taskForm.assignee, status: taskForm.status, priority: taskForm.priority, completion: 0, description: taskForm.description },
    });
    setTaskForm({ title: "", assignee: "Emily", status: "To Do", priority: "Medium", description: "" });
    setTaskDialog(null);
  }

  function handleUpdateTask() {
    if (!selectedTask || !projectId) return;
    dispatch({
      type: "UPDATE_TASK",
      projectId,
      epicId: selectedTask.epicId,
      storyId: selectedTask.storyId,
      taskId: selectedTask.id,
      updates: { description: taskDesc },
    });
  }

  const kanbanColumns: TaskStatus[] = ["To Do", "In Progress", "In Review", "Done"];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Top bar */}
      {project && (
        <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center gap-3">
          <button
            onClick={() => navigate(`/projects/${project.id}`)}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {project.name}
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-medium text-slate-800">Tasks</span>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-72 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 space-y-2">
            <h3 className="font-semibold text-sm text-slate-700">Project Structure</h3>
            {projectId && (
              <Button size="sm" className="w-full" onClick={() => setEpicDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Epic
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {epics.length === 0 && (
              <div className="p-4 text-center text-slate-400 text-sm">
                {projectId ? "No epics yet. Create one to start." : "No tasks across projects."}
              </div>
            )}
            {epics.map(epic => (
              <div key={epic.id} className="mb-1">
                <div className="flex items-center gap-1 group">
                  <div
                    className="flex items-center gap-2 flex-1 px-2 py-2 rounded hover:bg-slate-100 cursor-pointer"
                    onClick={() => toggleEpic(epic.id)}
                  >
                    {expandedEpics.includes(epic.id) ? (
                      <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    )}
                    <Layers className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    <span className="font-medium text-sm truncate">{epic.name}</span>
                  </div>
                  {projectId && (
                    <button
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 text-slate-500 transition-opacity"
                      title="Add story"
                      onClick={() => { setStoryDialog(epic.id); setStoryName(""); }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {expandedEpics.includes(epic.id) && (
                  <div className="ml-6 mt-0.5 space-y-0.5">
                    {epic.stories.map(story => (
                      <div key={story.id}>
                        <div className="flex items-center gap-1 group">
                          <div
                            className="flex items-center gap-2 flex-1 px-2 py-1.5 rounded hover:bg-slate-100 cursor-pointer"
                            onClick={() => toggleStory(story.id)}
                          >
                            {expandedStories.includes(story.id) ? (
                              <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            ) : (
                              <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            )}
                            <BookOpen className="w-3 h-3 text-violet-400 flex-shrink-0" />
                            <span className="text-sm text-slate-700 truncate">{story.name}</span>
                          </div>
                          {projectId && (
                            <button
                              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 text-slate-500 transition-opacity"
                              title="Add task"
                              onClick={() => { setTaskDialog({ epicId: epic.id, storyId: story.id }); setTaskForm({ title: "", assignee: "Emily", status: "To Do", priority: "Medium", description: "" }); }}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {expandedStories.includes(story.id) && (
                          <div className="ml-5 mt-0.5 space-y-0.5">
                            {story.tasks.map(task => (
                              <div
                                key={task.id}
                                className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-sm cursor-pointer ${
                                  selectedTask?.id === task.id ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
                                }`}
                                onClick={() => selectTask({ ...task, epicId: epic.id, epicName: epic.name, storyId: story.id, storyName: story.name })}
                              >
                                <CheckSquare className="w-3 h-3 flex-shrink-0 opacity-60" />
                                <span className="truncate">{task.title}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Center Panel */}
        <div className="flex-1 overflow-auto bg-slate-50">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {project ? project.name : "All Tasks"}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">{allTasks.length} tasks total</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
                  <List className="w-4 h-4" />
                </Button>
                <Button variant={viewMode === "kanban" ? "default" : "outline"} size="sm" onClick={() => setViewMode("kanban")}>
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {viewMode === "list" ? (
              <Card>
                <CardContent className="p-0">
                  {allTasks.length === 0 ? (
                    <div className="p-10 text-center text-slate-400">
                      <CheckSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
                      <p className="font-medium">No tasks yet</p>
                      <p className="text-sm mt-1">Add a story then create tasks inside it.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="text-left p-3 text-xs font-medium text-slate-500">ID</th>
                            <th className="text-left p-3 text-xs font-medium text-slate-500">Title</th>
                            <th className="text-left p-3 text-xs font-medium text-slate-500">Assignee</th>
                            <th className="text-left p-3 text-xs font-medium text-slate-500">Status</th>
                            <th className="text-left p-3 text-xs font-medium text-slate-500">Priority</th>
                            <th className="text-left p-3 text-xs font-medium text-slate-500">Completion</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allTasks.map(task => (
                            <tr
                              key={task.id}
                              className={`border-b border-slate-100 cursor-pointer hover:bg-white transition-colors ${
                                selectedTask?.id === task.id ? "bg-indigo-50" : ""
                              }`}
                              onClick={() => selectTask(task)}
                            >
                              <td className="p-3 text-xs text-slate-400 font-mono">#{task.id.slice(0, 6)}</td>
                              <td className="p-3">
                                <div>
                                  <p className="text-sm font-medium text-slate-900">{task.title}</p>
                                  <p className="text-xs text-slate-400">{task.epicName} / {task.storyName}</p>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignee}`} />
                                    <AvatarFallback>{task.assignee[0]}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">{task.assignee}</span>
                                </div>
                              </td>
                              <td className="p-3">
                                <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                              </td>
                              <td className="p-3">
                                <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <Progress value={task.completion} className="h-2 w-20" />
                                  <span className="text-sm font-medium text-slate-700">{task.completion}%</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {kanbanColumns.map(col => {
                  const colTasks = allTasks.filter(t => t.status === col);
                  return (
                    <div key={col} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700">{col}</span>
                        <span className="text-xs bg-slate-200 text-slate-600 rounded-full px-2 py-0.5">{colTasks.length}</span>
                      </div>
                      <div className="space-y-2">
                        {colTasks.map(task => (
                          <Card
                            key={task.id}
                            className={`cursor-pointer hover:shadow-md transition-shadow ${selectedTask?.id === task.id ? "ring-2 ring-indigo-400" : ""}`}
                            onClick={() => selectTask(task)}
                          >
                            <CardContent className="p-3 space-y-2">
                              <p className="text-sm font-medium">{task.title}</p>
                              <p className="text-xs text-slate-400">{task.storyName}</p>
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                                <Avatar className="w-5 h-5">
                                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignee}`} />
                                  <AvatarFallback>{task.assignee[0]}</AvatarFallback>
                                </Avatar>
                              </div>
                              <Progress value={task.completion} className="h-1.5" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-96 bg-white border-l border-slate-200 overflow-y-auto flex flex-col">
          {selectedTask ? (
            <div className="p-5 space-y-5">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-mono">#{selectedTask.id.slice(0, 8)}</span>
                  <button className="p-1 rounded hover:bg-slate-100" onClick={() => setSelectedTask(null)}>
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">{selectedTask.title}</h3>
                <p className="text-xs text-slate-500">
                  {selectedTask.epicName} → {selectedTask.storyName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Status</Label>
                  <Select defaultValue={selectedTask.status}>
                    <SelectTrigger className="mt-1 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="To Do">To Do</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="In Review">In Review</SelectItem>
                      <SelectItem value="Done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Assignee</Label>
                  <Select defaultValue={selectedTask.assignee}>
                    <SelectTrigger className="mt-1 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ASSIGNEES.map(a => (
                        <SelectItem key={a} value={a}>{ASSIGNEE_FULL[a]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-xs">Description</Label>
                <Textarea
                  className="mt-1 text-sm"
                  rows={3}
                  placeholder="Add task description..."
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                />
              </div>

              {/* Artifacts */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Artifacts & Links</h4>
                <div>
                  <Label className="text-xs text-slate-500">Figma Design</Label>
                  <div className="flex gap-2 mt-1">
                    <Input placeholder="https://figma.com/..." className="text-sm h-8" />
                    <Button variant="outline" size="icon" className="h-8 w-8 flex-shrink-0">
                      <Figma className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-slate-500">GitHub PR</Label>
                  <div className="flex gap-2 mt-1">
                    <Input placeholder="https://github.com/..." className="text-sm h-8" />
                    <Button variant="outline" size="icon" className="h-8 w-8 flex-shrink-0">
                      <Github className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-slate-500">Attachments</Label>
                  <div className="mt-1 border-2 border-dashed border-slate-200 rounded-lg p-3 text-center">
                    <FileText className="w-5 h-5 text-slate-300 mx-auto mb-1" />
                    <p className="text-xs text-slate-400">Drop files or click to upload</p>
                  </div>
                </div>
              </div>

              {/* Validation Checklist */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Validation Checklist</h4>
                {[
                  { label: "PR linked", checked: true },
                  { label: "Design attached", checked: true },
                  { label: "Screenshots uploaded", checked: false },
                  { label: "QA completed", checked: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      item.checked ? "bg-green-500 border-green-500" : "border-slate-300"
                    }`}>
                      {item.checked && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className={`text-sm ${item.checked ? "text-slate-800" : "text-slate-400"}`}>{item.label}</span>
                  </div>
                ))}
                <Progress value={50} className="h-1.5 mt-2" />
                <p className="text-xs text-slate-500">2 of 4 requirements met</p>
              </div>

              {/* Approvals */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Approvals</h4>
                {approvers.map(approver => (
                  <div key={approver.role} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-7 h-7">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${approver.avatar}`} />
                        <AvatarFallback>{approver.avatar[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium">{approver.name}</p>
                        <p className="text-xs text-slate-400">{approver.role}</p>
                      </div>
                    </div>
                    {approver.status === "approved" ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                        <Check className="w-2.5 h-2.5 mr-1" />Approved
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Pending</Badge>
                    )}
                  </div>
                ))}
              </div>

              {/* Completion Score */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Completion Score</h4>
                <div className="flex items-center justify-center py-2">
                  <div className="relative w-28 h-28">
                    <svg className="w-28 h-28 transform -rotate-90">
                      <circle cx="56" cy="56" r="48" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                      <circle
                        cx="56" cy="56" r="48"
                        stroke="#6366f1" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 48}`}
                        strokeDashoffset={`${2 * Math.PI * 48 * (1 - selectedTask.completion / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold">{selectedTask.completion}%</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-center text-slate-500">Based on artifacts, approvals, and validation</p>
              </div>

              <Button className="w-full" onClick={handleUpdateTask}>Update Task</Button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <CheckSquare className="w-10 h-10 mb-3 opacity-30" />
              <p className="font-medium">No task selected</p>
              <p className="text-sm mt-1">Click a task to view its details and validation status.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Epic Dialog */}
      <Dialog open={epicDialog} onOpenChange={setEpicDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>New Epic</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label>Epic Name</Label>
            <Input
              className="mt-1.5"
              placeholder="e.g. User Authentication"
              value={epicName}
              onChange={e => setEpicName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddEpic()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEpicDialog(false)}>Cancel</Button>
            <Button onClick={handleAddEpic} disabled={!epicName.trim()}>Create Epic</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Story Dialog */}
      <Dialog open={!!storyDialog} onOpenChange={o => !o && setStoryDialog(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>New Story</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label>Story Name</Label>
            <Input
              className="mt-1.5"
              placeholder="e.g. Login & Registration"
              value={storyName}
              onChange={e => setStoryName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddStory()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStoryDialog(null)}>Cancel</Button>
            <Button onClick={handleAddStory} disabled={!storyName.trim()}>Create Story</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={!!taskDialog} onOpenChange={o => !o && setTaskDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Task Title *</Label>
              <Input
                className="mt-1.5"
                placeholder="e.g. Design login screen"
                value={taskForm.title}
                onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Assignee</Label>
                <Select value={taskForm.assignee} onValueChange={v => setTaskForm(f => ({ ...f, assignee: v }))}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSIGNEES.map(a => <SelectItem key={a} value={a}>{ASSIGNEE_FULL[a]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={taskForm.priority} onValueChange={v => setTaskForm(f => ({ ...f, priority: v as Priority }))}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Initial Status</Label>
              <Select value={taskForm.status} onValueChange={v => setTaskForm(f => ({ ...f, status: v as TaskStatus }))}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="In Review">In Review</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                className="mt-1.5"
                rows={3}
                placeholder="Describe what needs to be done..."
                value={taskForm.description}
                onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskDialog(null)}>Cancel</Button>
            <Button onClick={handleAddTask} disabled={!taskForm.title.trim()}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
