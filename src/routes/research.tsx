import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, RefreshCw, Trash2, Sparkles, Loader2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { generateResearch, formatResearch } from "@/lib/mock-ai";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Kestrel AI" },
      {
        name: "description",
        content:
          "Paste a topic, question or article and get a structured summary with key points, insights and recommendations.",
      },
      { property: "og:title", content: "AI Research Assistant — Kestrel AI" },
      {
        property: "og:description",
        content: "Structured summaries with key points, insights and recommendations.",
      },
    ],
  }),
  component: ResearchPage,
});

type Section = { heading: string; body: string };

function ResearchPage() {
  const [input, setInput] = useState("");
  const [sections, setSections] = useState<Section[] | null>(null);
  const [loading, setLoading] = useState(false);

  const run = () => {
    if (!input.trim()) {
      toast.error("Enter a topic, question or some text first.");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      const r = generateResearch(input);
      setSections([
        { heading: "Summary", body: r.summary },
        { heading: "Key points", body: r.keyPoints.map((p) => `• ${p}`).join("\n") },
        { heading: "Main insights", body: r.insights.map((p) => `• ${p}`).join("\n") },
        {
          heading: "Recommendations",
          body: r.recommendations.map((p, i) => `${i + 1}. ${p}`).join("\n"),
        },
      ]);
      setLoading(false);
    }, 800);
  };

  const copy = async () => {
    if (!sections) return;
    await navigator.clipboard.writeText(
      sections.map((s) => `${s.heading.toUpperCase()}\n${s.body}`).join("\n\n"),
    );
    toast.success("Summary copied to clipboard");
  };

  const clear = () => {
    setInput("");
    setSections(null);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Research Assistant"
        description="Drop in a topic, a question or a block of article text. You'll get an editable summary broken into key points, insights and recommendations."
      />

      <div className="panel space-y-4 p-5 sm:p-6">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic, question or article text</Label>
          <Textarea
            id="topic"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            placeholder="e.g. What should we consider before rolling out a four-day work week across the support team?"
            className="resize-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={run} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-1.5 h-4 w-4" />
            )}
            Generate summary
          </Button>
          <Button variant="outline" onClick={run} disabled={!sections || loading}>
            <RefreshCw className="mr-1.5 h-4 w-4" /> Regenerate
          </Button>
          <Button variant="outline" onClick={copy} disabled={!sections}>
            <Copy className="mr-1.5 h-4 w-4" /> Copy
          </Button>
          <Button variant="ghost" onClick={clear}>
            <Trash2 className="mr-1.5 h-4 w-4" /> Clear
          </Button>
        </div>
      </div>

      {sections ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {sections.map((s, i) => (
            <div key={s.heading} className="panel p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {s.heading}
              </h2>
              <Textarea
                value={s.body}
                onChange={(e) => {
                  const next = [...sections];
                  next[i] = { ...s, body: e.target.value };
                  setSections(next);
                }}
                className="mt-3 min-h-[180px] resize-none text-sm leading-relaxed"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="panel flex flex-col items-center justify-center p-12 text-center">
          <BookOpen className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 text-sm font-medium text-foreground">Nothing summarised yet</p>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Your structured summary will appear here in editable sections.
          </p>
        </div>
      )}

      <AiDisclaimer />
    </div>
  );
}
