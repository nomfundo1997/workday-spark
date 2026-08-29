import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Trash2, User } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateChatReply, SUGGESTED_PROMPTS } from "@/lib/mock-ai";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chat — Kestrel AI" },
      {
        name: "description",
        content:
          "Chat with a workplace AI assistant for meeting agendas, project plans, summaries and message rewrites.",
      },
      { property: "og:title", content: "AI Workplace Chat — Kestrel AI" },
      {
        property: "og:description",
        content: "Agendas, plans, summaries and rewrites in a conversational interface.",
      },
    ],
  }),
  component: ChatPage,
});

type Msg = { id: number; role: "user" | "assistant"; content: string };

const WELCOME: Msg = {
  id: 0,
  role: "assistant",
  content:
    "Hi! I'm your workplace assistant. I can draft agendas, plans, summaries and rewrites. What are you working on?",
};

function renderLine(line: string, key: number) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p key={key} className={line.startsWith(">") ? "border-l-2 border-border pl-3 italic" : ""}>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="font-semibold">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{p.replace(/^>\s?/, "")}</span>
        ),
      )}
    </p>
  );
}

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || typing) return;
    setMessages((m) => [...m, { id: Date.now(), role: "user", content: value }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: Date.now() + 1, role: "assistant", content: generateChatReply(value) },
      ]);
      setTyping(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Workplace Chat"
        description="Ask for anything work-related — agendas, plans, summaries, rewrites. Responses are realistic samples."
        actions={
          <Button variant="ghost" onClick={() => setMessages([WELCOME])}>
            <Trash2 className="mr-1.5 h-4 w-4" /> New chat
          </Button>
        }
      />

      <div className="panel flex h-[62vh] min-h-[440px] flex-col">
        <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  m.role === "user"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {m.role === "user" ? (
                  <User className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                )}
              </span>
              <div
                className={`max-w-[85%] space-y-2 rounded-xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {m.content.split("\n").map((line, i) =>
                  line.trim() === "" ? <div key={i} className="h-1" /> : renderLine(line, i),
                )}
              </div>
            </div>
          ))}

          {typing ? (
            <div className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="flex items-center gap-1 rounded-xl bg-muted px-4 py-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Ask anything work-related…"
              className="max-h-32 min-h-11 resize-none"
            />
            <Button onClick={() => send(input)} disabled={typing} aria-label="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AiDisclaimer />
    </div>
  );
}
