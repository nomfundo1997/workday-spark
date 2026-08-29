import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, BookOpen, MessageSquare, ArrowRight, Clock } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Kestrel AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Draft emails, summarise research and chat with a workplace AI assistant from one clean dashboard.",
      },
      { property: "og:title", content: "Kestrel AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Draft emails, summarise research and chat with a workplace AI assistant.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    text: "Turn rough notes into a polished email in a formal, friendly or persuasive tone.",
  },
  {
    to: "/research",
    icon: BookOpen,
    title: "AI Research Assistant",
    text: "Paste a topic or article and get key points, insights and recommendations.",
  },
  {
    to: "/chat",
    icon: MessageSquare,
    title: "AI Workplace Chat",
    text: "Ask for agendas, plans, summaries or rewrites in a conversational interface.",
  },
] as const;

const ACTIVITY = [
  { title: "Q3 budget follow-up email", tag: "Email · Formal", time: "12 minutes ago" },
  { title: "Summary: remote onboarding research", tag: "Research", time: "1 hour ago" },
  { title: "Project plan — website refresh", tag: "Chat", time: "Yesterday" },
  { title: "Client check-in email", tag: "Email · Friendly", time: "2 days ago" },
] as const;

function Dashboard() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="Good day, Nomfundo"
        description="Your workplace AI assistant for faster writing, clearer research and better decisions. Everything here runs on sample responses — no setup required."
        actions={
          <Button asChild>
            <Link to="/chat">
              Open AI Chat <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Tools
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ to, icon: Icon, title, text }) => (
            <Link
              key={to}
              to={to}
              className="panel group flex flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
              <span className="mt-4 inline-flex items-center text-sm font-medium text-foreground">
                Open
                <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Quick actions
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" asChild>
            <Link to="/email">Draft an email</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/research">Summarise an article</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/chat">Write a meeting agenda</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/chat">Create a project plan</Link>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Recent activity
        </h2>
        <ul className="panel mt-4 divide-y divide-border">
          {ACTIVITY.map((a) => (
            <li
              key={a.title}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/60"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Clock className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.tag}</p>
              </div>
              <span className="ml-auto shrink-0 text-xs text-muted-foreground">{a.time}</span>
            </li>
          ))}
        </ul>
      </section>

      <AiDisclaimer />
    </div>
  );
}
