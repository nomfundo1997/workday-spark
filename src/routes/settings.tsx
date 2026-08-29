import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Kestrel AI" },
      {
        name: "description",
        content:
          "Adjust display name, default tone, response length and interface preferences for your AI workplace assistant.",
      },
      { property: "og:title", content: "Settings — Kestrel AI" },
      {
        property: "og:description",
        content: "Interface and default preferences for your AI workplace assistant.",
      },
    ],
  }),
  component: SettingsPage,
});

function Row({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="pr-4">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="sm:w-56">{children}</div>
    </div>
  );
}

function SettingsPage() {
  const [name, setName] = useState("Nomfundo");
  const [tone, setTone] = useState("formal");
  const [length, setLength] = useState("balanced");
  const [compact, setCompact] = useState(false);
  const [suggestions, setSuggestions] = useState(true);
  const [disclaimer, setDisclaimer] = useState(true);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Interface preferences for this demo workspace. Nothing is stored — settings reset when you refresh."
        actions={<Button onClick={() => toast.success("Preferences saved")}>Save changes</Button>}
      />

      <section className="panel px-5 py-1 sm:px-6">
        <div className="divide-y divide-border">
          <Row title="Display name" description="Shown in the dashboard greeting.">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Row>
          <Row title="Default email tone" description="Pre-selected in the email generator.">
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </Row>
          <Row title="Response length" description="How detailed generated content should be.">
            <Select value={length} onValueChange={setLength}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concise">Concise</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="detailed">Detailed</SelectItem>
              </SelectContent>
            </Select>
          </Row>
        </div>
      </section>

      <section className="panel px-5 py-1 sm:px-6">
        <div className="divide-y divide-border">
          <Row title="Compact layout" description="Tighter spacing across cards and lists.">
            <div className="flex items-center gap-2 sm:justify-end">
              <Switch id="compact" checked={compact} onCheckedChange={setCompact} />
              <Label htmlFor="compact" className="text-xs text-muted-foreground">
                {compact ? "On" : "Off"}
              </Label>
            </div>
          </Row>
          <Row title="Suggested prompts" description="Show quick prompt chips in AI chat.">
            <div className="flex items-center gap-2 sm:justify-end">
              <Switch id="sug" checked={suggestions} onCheckedChange={setSuggestions} />
              <Label htmlFor="sug" className="text-xs text-muted-foreground">
                {suggestions ? "On" : "Off"}
              </Label>
            </div>
          </Row>
          <Row title="AI disclaimer" description="Keep the responsible-AI notice visible.">
            <div className="flex items-center gap-2 sm:justify-end">
              <Switch id="disc" checked={disclaimer} onCheckedChange={setDisclaimer} />
              <Label htmlFor="disc" className="text-xs text-muted-foreground">
                {disclaimer ? "On" : "Off"}
              </Label>
            </div>
          </Row>
        </div>
      </section>

      <AiDisclaimer />
    </div>
  );
}
