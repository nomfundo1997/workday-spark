import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, RefreshCw, Trash2, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { generateEmail, type Tone } from "@/lib/mock-ai";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Kestrel AI" },
      {
        name: "description",
        content:
          "Turn rough notes into a polished workplace email in a formal, friendly or persuasive tone.",
      },
      { property: "og:title", content: "Smart Email Generator — Kestrel AI" },
      {
        property: "og:description",
        content: "Turn rough notes into a polished workplace email in seconds.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES: { value: Tone; label: string; hint: string }[] = [
  { value: "formal", label: "Formal", hint: "Measured and professional" },
  { value: "friendly", label: "Friendly", hint: "Warm and conversational" },
  { value: "persuasive", label: "Persuasive", hint: "Confident with a clear ask" },
];

function EmailPage() {
  const [notes, setNotes] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = () => {
    if (!notes.trim()) {
      toast.error("Add a topic or a few notes first.");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setOutput(generateEmail(notes, tone));
      setLoading(false);
    }, 700);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("Email copied to clipboard");
  };

  const clear = () => {
    setNotes("");
    setOutput("");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Smart Email Generator"
        description="Describe the email you need — a topic, bullet points or messy notes — pick a tone, and get a ready-to-send draft you can edit."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel space-y-5 p-5 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="notes">Topic or notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={8}
              placeholder="e.g. Follow up with the finance team about the Q3 budget review. Need approval by Friday. Mention the two open line items."
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Tone</Label>
            <div className="grid gap-2 sm:grid-cols-3">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTone(t.value)}
                  aria-pressed={tone === t.value}
                  className={`rounded-lg border p-3 text-left transition-all duration-200 ${
                    tone === t.value
                      ? "border-primary bg-primary text-primary-foreground shadow-panel"
                      : "border-border bg-card text-foreground hover:border-ring/40 hover:bg-muted"
                  }`}
                >
                  <span className="block text-sm font-medium">{t.label}</span>
                  <span
                    className={`mt-0.5 block text-[11px] leading-tight ${
                      tone === t.value ? "opacity-80" : "text-muted-foreground"
                    }`}
                  >
                    {t.hint}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={run} disabled={loading}>
              {loading ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-1.5 h-4 w-4" />
              )}
              Generate email
            </Button>
            <Button variant="ghost" onClick={clear}>
              <Trash2 className="mr-1.5 h-4 w-4" /> Clear
            </Button>
          </div>
        </div>

        <div className="panel flex flex-col p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="output">Generated email</Label>
            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" onClick={run} disabled={!output || loading}>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Regenerate
              </Button>
              <Button variant="outline" size="sm" onClick={copy} disabled={!output}>
                <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
              </Button>
            </div>
          </div>

          {output ? (
            <Textarea
              id="output"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              className="mt-3 min-h-[420px] flex-1 resize-none font-sans text-sm leading-relaxed"
            />
          ) : (
            <div className="mt-3 flex min-h-[420px] flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 p-8 text-center">
              <Sparkles className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-foreground">No draft yet</p>
              <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                Add your notes, choose a tone, and your editable email preview will appear here.
              </p>
            </div>
          )}
          <AiDisclaimer className="mt-4" />
        </div>
      </div>
    </div>
  );
}
