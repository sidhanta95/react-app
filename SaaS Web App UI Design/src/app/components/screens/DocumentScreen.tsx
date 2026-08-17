import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { FileText, Search, Sparkles, ListTree, FileCheck, BookOpen } from "lucide-react";

const documents = [
  { id: 1, name: "Product Requirements Document", type: "PRD", updated: "2 days ago", status: "Active" },
  { id: 2, name: "Business Requirements Document", type: "BRD", updated: "1 week ago", status: "Active" },
  { id: 3, name: "Technical Specification", type: "Tech Doc", updated: "3 days ago", status: "Active" },
  { id: 4, name: "API Design Document", type: "Tech Doc", updated: "1 week ago", status: "Active" },
  { id: 5, name: "User Research Findings", type: "Research", updated: "2 weeks ago", status: "Archived" },
];

const aiActions = [
  { icon: ListTree, label: "Generate Epics", description: "Break down PRD into epics" },
  { icon: FileCheck, label: "Generate Tasks", description: "Create tasks from epics" },
  { icon: BookOpen, label: "Summarize", description: "Get key points summary" },
];

export function DocumentScreen() {
  const [selectedDoc, setSelectedDoc] = useState(documents[0]);

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-slate-50">
      {/* Left Panel - Document List */}
      <div className="w-80 bg-white border-r border-slate-200 overflow-auto">
        <div className="p-4 border-b border-slate-200">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search documents..."
              className="pl-10"
            />
          </div>
          <Button className="w-full">
            <FileText className="w-4 h-4 mr-2" />
            New Document
          </Button>
        </div>

        <div className="p-2 space-y-1">
          {documents.map(doc => (
            <div
              key={doc.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedDoc.id === doc.id ? "bg-indigo-50 border border-indigo-200" : "hover:bg-slate-50"
              }`}
              onClick={() => setSelectedDoc(doc)}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 rounded">
                  <FileText className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm mb-1 truncate">{doc.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{doc.type}</Badge>
                    <span className="text-xs text-slate-500">{doc.updated}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Panel - Document Viewer */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Card>
            <CardContent className="p-8">
              <div className="max-w-4xl mx-auto space-y-6">
                <div>
                  <h1 className="text-3xl font-semibold mb-2">Product Requirements Document</h1>
                  <p className="text-slate-600">Mobile App Redesign Project</p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-slate-600">
                    <span>Last updated: 2 days ago</span>
                    <span>•</span>
                    <span>By Sarah Johnson</span>
                  </div>
                </div>

                <div className="h-px bg-slate-200"></div>

                <div className="space-y-6 prose max-w-none">
                  <section>
                    <h2 className="text-xl font-semibold mb-3">1. Overview</h2>
                    <p className="text-slate-700 leading-relaxed">
                      This document outlines the product requirements for the complete redesign of our mobile 
                      application. The goal is to improve user experience, modernize the design language, and 
                      optimize performance across iOS and Android platforms.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3">2. Objectives</h2>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 mt-1">•</span>
                        <span>Increase user engagement by 40% through improved UX</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 mt-1">•</span>
                        <span>Reduce app load time by 50% with performance optimization</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 mt-1">•</span>
                        <span>Implement modern design system aligned with brand guidelines</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 mt-1">•</span>
                        <span>Achieve 4.5+ star rating on app stores</span>
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3">3. Target Audience</h2>
                    <p className="text-slate-700 leading-relaxed">
                      Primary users are professionals aged 25-45 who need efficient project management tools. 
                      They value clean interfaces, quick access to information, and seamless collaboration features.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3">4. Key Features</h2>
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">4.1 User Authentication</h3>
                        <p className="text-sm text-slate-700">
                          Implement secure OAuth 2.0 authentication with support for Google and GitHub. 
                          Include biometric authentication (Face ID/Touch ID) for mobile platforms.
                        </p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">4.2 Dashboard Interface</h3>
                        <p className="text-sm text-slate-700">
                          Create a customizable dashboard showing project overview, task status, and key metrics. 
                          Support drag-and-drop widgets and personalized layouts.
                        </p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">4.3 Task Management</h3>
                        <p className="text-sm text-slate-700">
                          Build comprehensive task management with kanban and list views, priority levels, 
                          assignees, due dates, and attachment support.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3">5. Technical Requirements</h2>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 mt-1">•</span>
                        <span>React Native for cross-platform development</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 mt-1">•</span>
                        <span>RESTful API with GraphQL for data fetching</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 mt-1">•</span>
                        <span>Offline-first architecture with data synchronization</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 mt-1">•</span>
                        <span>End-to-end encryption for sensitive data</span>
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3">6. Success Metrics</h2>
                    <p className="text-slate-700 leading-relaxed">
                      We will measure success through daily active users, task completion rates, app store ratings, 
                      and user satisfaction scores. Target metrics include 10k DAU within 3 months and 80% task 
                      completion rate.
                    </p>
                  </section>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Panel - AI Assistant */}
      <div className="w-96 bg-white border-l border-slate-200 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold">AI Assistant</h3>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-600">Quick Actions</h4>
            {aiActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="w-full justify-start h-auto p-4"
              >
                <action.icon className="w-5 h-5 mr-3 text-indigo-600" />
                <div className="text-left">
                  <div className="font-medium">{action.label}</div>
                  <div className="text-xs text-slate-500 font-normal">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>

          <div className="h-px bg-slate-200"></div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-600">AI Chat</h4>
            
            <div className="space-y-4 min-h-[300px] max-h-[400px] overflow-y-auto">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-slate-100 rounded-lg p-3">
                    <p className="text-sm">
                      I've analyzed your PRD. I can help you break this down into epics and tasks. 
                      Would you like me to generate a project structure?
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Just now</p>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <div className="flex-1 max-w-[80%]">
                  <div className="bg-indigo-600 text-white rounded-lg p-3">
                    <p className="text-sm">
                      Yes, please generate epics from this PRD.
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 text-right">Just now</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-slate-100 rounded-lg p-3">
                    <p className="text-sm mb-2">
                      I've generated 5 epics based on your PRD:
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• User Authentication & Security</li>
                      <li>• Dashboard & Analytics</li>
                      <li>• Task Management System</li>
                      <li>• Performance Optimization</li>
                      <li>• Design System Implementation</li>
                    </ul>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Just now</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Input placeholder="Ask AI anything..." className="flex-1" />
              <Button>Send</Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                "Generate test cases"
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                "What's the timeline?"
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                "Show dependencies"
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
