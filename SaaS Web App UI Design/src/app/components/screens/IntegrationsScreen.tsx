import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Github, Slack, CheckCircle2, ExternalLink } from "lucide-react";

const integrations = [
  {
    id: "github",
    name: "GitHub",
    description: "Connect your repositories to automatically link PRs and track code changes",
    icon: Github,
    connected: true,
    connectedAccount: "company-org",
    features: [
      "Auto-link pull requests to tasks",
      "Track commit activity",
      "Sync repository status",
      "PR review notifications"
    ],
    color: "bg-slate-900"
  },
  {
    id: "figma",
    name: "Figma",
    description: "Link design files to tasks and track design changes in real-time",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a5 5 0 0 1 5 5v5h-5zm5 10a5 5 0 1 1-5-5zm-5 0H7a5 5 0 1 0 5 5zm0 0V7a5 5 0 1 0-5 5z"/>
      </svg>
    ),
    connected: true,
    connectedAccount: "design-team",
    features: [
      "Attach design files to tasks",
      "Track design version history",
      "Real-time design updates",
      "Designer activity tracking"
    ],
    color: "bg-gradient-to-br from-purple-500 to-pink-500"
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get real-time notifications and updates in your Slack workspace",
    icon: Slack,
    connected: false,
    connectedAccount: null,
    features: [
      "Task update notifications",
      "Daily standup reminders",
      "PR review alerts",
      "Sprint planning notifications"
    ],
    color: "bg-gradient-to-br from-purple-600 to-pink-600"
  },
  {
    id: "jira",
    name: "Jira",
    description: "Sync issues and track progress across both platforms",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.001 1.001 0 0 0 23.013 0z"/>
      </svg>
    ),
    connected: false,
    connectedAccount: null,
    features: [
      "Two-way issue sync",
      "Status mapping",
      "Comment synchronization",
      "Sprint planning integration"
    ],
    color: "bg-blue-600"
  },
  {
    id: "linear",
    name: "Linear",
    description: "Import and sync issues from Linear for seamless workflow",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.732 3.732l16.536 16.536M3 12h18M12 3v18"/>
      </svg>
    ),
    connected: false,
    connectedAccount: null,
    features: [
      "Issue import and sync",
      "Project mapping",
      "Status synchronization",
      "Bi-directional updates"
    ],
    color: "bg-indigo-600"
  },
  {
    id: "notion",
    name: "Notion",
    description: "Embed documents and sync project information with Notion",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4h16v16H4z"/>
      </svg>
    ),
    connected: false,
    connectedAccount: null,
    features: [
      "Document embedding",
      "Page synchronization",
      "Database integration",
      "Real-time collaboration"
    ],
    color: "bg-slate-900"
  },
];

export function IntegrationsScreen() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Integrations</h1>
        <p className="text-slate-600">Connect your favorite tools to streamline your workflow</p>
      </div>

      {/* Connected Integrations */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Connected</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {integrations.filter(i => i.connected).map((integration) => (
            <Card key={integration.id} className="border-2 border-green-100">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${integration.color} rounded-xl flex items-center justify-center text-white`}>
                      <integration.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {integration.name}
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-slate-600 mt-1">
                        Connected as <span className="font-medium">{integration.connectedAccount}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">{integration.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Features:</p>
                  <ul className="space-y-1.5">
                    {integration.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                  <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700">
                    Disconnect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Available Integrations */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Integrations</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {integrations.filter(i => !i.connected).map((integration) => (
            <Card key={integration.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${integration.color} rounded-xl flex items-center justify-center text-white`}>
                      <integration.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle>{integration.name}</CardTitle>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">{integration.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Features:</p>
                  <ul className="space-y-1.5">
                    {integration.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full">
                  Connect {integration.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
