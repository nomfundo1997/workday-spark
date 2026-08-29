export type Tone = "formal" | "friendly" | "persuasive";

const titleCase = (s: string) =>
  s.trim().replace(/\s+/g, " ").replace(/^./, (c) => c.toUpperCase());

const firstLine = (input: string) => {
  const clean = input.trim().replace(/\s+/g, " ");
  if (!clean) return "our recent discussion";
  return clean.length > 70 ? `${clean.slice(0, 67)}...` : clean;
};

export function generateEmail(notes: string, tone: Tone): string {
  const subject = titleCase(firstLine(notes));
  const bullets = notes
    .split(/[\n.;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3)
    .slice(0, 4);

  const body = bullets.length
    ? bullets.map((b) => `• ${titleCase(b)}`).join("\n")
    : "• Context and background for this request\n• Key details and expected outcome\n• Suggested next step and timeline";

  if (tone === "formal") {
    return `Subject: ${subject}

Dear Colleague,

I hope this message finds you well. I am writing to follow up regarding ${firstLine(notes)}.

Please find the key points outlined below:

${body}

I would be grateful for your review and any feedback you may have. Should you require further detail, I would be happy to arrange a short call at your convenience.

Kind regards,
[Your Name]
[Your Role]`;
  }

  if (tone === "friendly") {
    return `Subject: ${subject}

Hi there,

Hope you're having a good week! Just wanted to share a quick update on ${firstLine(notes)}.

Here's the short version:

${body}

Let me know what you think — happy to jump on a quick call if that's easier.

Thanks so much,
[Your Name]`;
  }

  return `Subject: ${subject}

Hello,

I wanted to bring something to your attention that I believe can make a real difference for the team: ${firstLine(notes)}.

Here's why this matters:

${body}

Acting on this now means less rework later and a clearer path for everyone involved. I'd love your go-ahead so we can move forward this week — it should take very little of your time.

Can I count on your support?

Best regards,
[Your Name]`;
}

export type ResearchResult = {
  summary: string;
  keyPoints: string[];
  insights: string[];
  recommendations: string[];
};

export function generateResearch(topic: string): ResearchResult {
  const t = firstLine(topic);
  return {
    summary: `${titleCase(t)} is best understood by separating what is already established from what is still uncertain. The material points to a practical, incremental approach: define the outcome, measure a small baseline, then scale what demonstrably works. Most reported failures come from unclear ownership rather than from the underlying idea.`,
    keyPoints: [
      `Core scope: ${t}`,
      "Stakeholders expect measurable outcomes within a single quarter",
      "Existing tooling covers roughly 70% of the required workflow",
      "Main risk is unclear ownership across teams, not technical feasibility",
      "Documentation and onboarding are the most commonly skipped steps",
    ],
    insights: [
      "Teams that pilot with a single workflow reach adoption ~2x faster than broad rollouts.",
      "Quality gains plateau without a review step; a human check remains the highest-value control.",
      "Cost tends to shift from execution time to coordination time — plan for the latter.",
    ],
    recommendations: [
      "Run a two-week pilot with one team and one clearly defined success metric.",
      "Assign a named owner and a weekly 20-minute review cadence.",
      "Write a one-page usage guideline before rollout, including a review checklist.",
      "Revisit results after 30 days and decide explicitly to scale, adjust, or stop.",
    ],
  };
}

export function formatResearch(r: ResearchResult): string {
  return `SUMMARY
${r.summary}

KEY POINTS
${r.keyPoints.map((p) => `• ${p}`).join("\n")}

MAIN INSIGHTS
${r.insights.map((p) => `• ${p}`).join("\n")}

RECOMMENDATIONS
${r.recommendations.map((p, i) => `${i + 1}. ${p}`).join("\n")}`;
}

export function generateChatReply(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes("agenda")) {
    return `Here's a meeting agenda you can adapt:

**Meeting:** ${titleCase(firstLine(prompt))}
**Duration:** 45 minutes

1. **Context & goals** (5 min) — why we're here, what "done" looks like
2. **Status review** (10 min) — progress since last session, blockers
3. **Discussion** (20 min) — the two or three decisions that actually need the group
4. **Decisions & owners** (7 min) — capture each action with a name and a date
5. **Wrap-up** (3 min) — confirm next meeting and any pre-work

Tip: send the agenda 24 hours ahead and mark which items need a decision versus an FYI.`;
  }

  if (p.includes("summar")) {
    return `Here's a structured summary:

**In one line:** the material centres on ${firstLine(prompt)}.

**Key points**
- The main objective is clear, but ownership is spread across several people.
- Timelines are realistic if scope stays fixed.
- One dependency sits outside the team and should be confirmed early.

**Suggested next step:** confirm the external dependency, then lock scope in writing.`;
  }

  if (p.includes("project plan") || p.includes("plan")) {
    return `Here's a lightweight project plan:

**Phase 1 — Define (Week 1)**
- Write a one-page brief: outcome, scope, success metric
- Confirm owner and stakeholders

**Phase 2 — Build (Weeks 2–4)**
- Break work into weekly deliverables
- Short weekly checkpoint, 20 minutes max

**Phase 3 — Review & launch (Week 5)**
- Test against the success metric
- Document, hand over, and close out

**Risks to watch:** unclear ownership, scope creep, and late feedback.`;
  }

  if (p.includes("improve") || p.includes("rewrite") || p.includes("message")) {
    return `Here's a tightened version:

> Hi team — quick update on ${firstLine(prompt)}. We're on track for Friday. I need one decision from you by Wednesday: whether to include the reporting view in this release. Reply with yes or no and I'll take it from there.

**What changed:** removed hedging language, led with the update, and made the ask explicit with a deadline.`;
  }

  return `Good question. Here's how I'd approach "${firstLine(prompt)}":

1. **Clarify the outcome** — what does a good result look like, and who decides?
2. **Gather the essentials** — the two or three facts that actually change the decision.
3. **Draft quickly** — a rough version beats a blank page; refine after feedback.
4. **Close the loop** — confirm owners and a date so it doesn't drift.

Want me to turn this into a draft email, an agenda, or a short plan?`;
}

export const SUGGESTED_PROMPTS = [
  "Help me write a meeting agenda",
  "Summarise this information",
  "Create a project plan",
  "Improve this message",
];
