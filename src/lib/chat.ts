/**
 * The knowledge base behind the "Ask about my work" assistant.
 * Keyword + phrase scoring over hand-written answers — deterministic, offline,
 * and honest: it only ever answers with things that are actually true of the portfolio.
 */

export type ChatAction = {
  label: string;
  icon: string;
  type: 'navigate' | 'link';
  screen?: 'Work' | 'StackScreen' | 'Connect' | 'Home';
  projectId?: string;
  url?: string;
};

export type Intent = {
  id: string;
  phrases?: string[];
  keywords: string[];
  reply: string;
  actions?: ChatAction[];
  followUps?: string[];
};

export const GREETING =
  "Hi — I'm the assistant for **Moe Kyaw Aung**, an AI-first product engineer. Ask me anything about his work and I'll pull the specifics: the product decisions, the technical trade-offs and the numbers.\n\nWhere do you want to start?";

export const SUGGESTED_QUESTIONS = [
  'Show Android apps',
  'View AI projects',
  'See GitHub',
  "What's his stack?",
  'Biggest measurable impact?',
  'How does he think about product?',
  'Is he available to hire?',
];

const INTENTS: Intent[] = [
  {
    id: 'greeting',
    phrases: ['hi', 'hello', 'hey', 'yo', 'good morning', 'who are you', 'what is this'],
    keywords: ['hi', 'hello', 'hey', 'greetings', 'intro'],
    reply:
      "I'm a small assistant built on Moe's own case notes — no invented answers.\n\nAsk me about the Android apps, the AI projects, the stack, or how he works with teams. I'll cite real projects and real numbers.",
    followUps: ['Show Android apps', 'View AI projects', 'How does he think about product?'],
  },
  {
    id: 'android',
    phrases: ['show android', 'android apps', 'android app', 'play store', 'shipped apps'],
    keywords: ['android', 'apps', 'app', 'kotlin', 'native', 'compose', 'shipped', 'mobile'],
    reply:
      "**Five Android products, all Kotlin-first.**\n\n• **ZayGo** — offline-first commerce super app, 120K MAU. Rewrote onboarding from 6 steps to 2: activation **+38%**, checkout 4.2s → 1.6s.\n• **Thitsa** — micro-saving app with behavioural nudges. **41% D30 retention**, saves per user **+27%**.\n• **Nway Oo Doctor** — AI symptom triage; saved 7 minutes per consult prep.\n• **PyiSai** — on-device flood prediction that works at zero bars.\n• **Mingalar Compose Kit** — the shared Compose design system the others are built on.\n\nEvery UI is Jetpack Compose with Material 3, unidirectional state and Hilt. Moe profiles recomposition before shipping — \"it feels fast\" is not a metric, frame time is.",
    actions: [
      { label: 'Browse case studies', icon: 'albums-outline', type: 'navigate', screen: 'Work' },
      { label: 'Open ZayGo', icon: 'storefront-outline', type: 'navigate', projectId: 'zaygo' },
    ],
    followUps: ['View AI projects', 'Biggest measurable impact?'],
  },
  {
    id: 'ai',
    phrases: ['view ai', 'ai projects', 'machine learning', 'ml model', 'on-device'],
    keywords: ['ai', 'ml', 'machine', 'learning', 'model', 'tflite', 'tensorflow', 'gemini', 'llm', 'rag', 'on-device', 'inference', 'neural'],
    reply:
      "**Two AI-heavy builds, plus AI woven into the rest.**\n\n• **PyiSai Flood AI** — a 1.9MB quantised TFLite model running fully on-device. **92% precision**, under 40ms inference, and it works with no signal at all. The product call: on-device inference *was* the feature, because floods take the network down.\n• **Nway Oo Doctor** — a RAG pipeline over clinical guidelines with the Gemini API. Every claim cites a source, hallucination rate under **2%** on a 1,200-case clinician eval set.\n\nMoe's rule for AI features: on-device for latency and privacy, cloud for heavy reasoning, hybrid when the network is unreliable — and never ship a model without an eval set.",
    actions: [
      { label: 'Open PyiSai case', icon: 'water-outline', type: 'navigate', projectId: 'pyisai' },
      { label: 'Open Nway Oo Doctor', icon: 'medkit-outline', type: 'navigate', projectId: 'nwayoo' },
    ],
    followUps: ['Show Android apps', "What's his stack?"],
  },
  {
    id: 'github',
    phrases: ['see github', 'his github', 'github repo', 'open source'],
    keywords: ['github', 'repos', 'repositories', 'code', 'source', 'oss', 'contribute'],
    reply:
      "**github.com/moekyaw-aung**\n\nMost-pinned:\n• **mingalar-compose-kit** — the Compose design system, 60+ tested primitives, 180+ stars.\n• **pyisai-ml** — training pipeline + TFLite export for the flood model.\n• **flowkernel** — a small Coroutines/Flow sidecar library.\n• **nwayoo-rag** — the retrieval + re-ranking service behind the triage assistant.\n\nThe commit history is deliberately boring: small diffs, real tests, changelogs. That is what makes it maintainable across three teams.",
    actions: [
      { label: 'Open GitHub', icon: 'logo-github', type: 'link', url: 'https://github.com/moekyaw-aung' },
      { label: 'Compose Kit repo', icon: 'grid-outline', type: 'navigate', projectId: 'mingalar' },
    ],
    followUps: ['View AI projects', 'Is he available to hire?'],
  },
  {
    id: 'firebase',
    phrases: ['firebase', 'firestore', 'crashlytics', 'cloud functions', 'remote config'],
    keywords: ['firebase', 'firestore', 'fcm', 'crashlytics', 'auth', 'functions', 'config', 'push'],
    reply:
      "**Firebase is the default backend spine** on nearly every project.\n\n• **Auth** — phone OTP first, because email is rare in the markets Moe ships to.\n• **Firestore** with offline persistence, then re-architected for cost on Thitsa (cost per MAU −44%).\n• **FCM** segmented by cohort, not blasted globally.\n• **Crashlytics** wired as a release gate — 99.8% crash-free is a process, not luck.\n• **Remote Config** for staged rollouts: 5% → 25% → 100%, with kill switches.\n\nIt removed custom backend work from most projects and let a small team move fast safely.",
    actions: [
      { label: 'See it in Thitsa', icon: 'wallet-outline', type: 'navigate', projectId: 'thitsa' },
      { label: 'Full stack', icon: 'layers-outline', type: 'navigate', screen: 'StackScreen' },
    ],
    followUps: ['Show Android apps', 'Biggest measurable impact?'],
  },
  {
    id: 'backend',
    phrases: ['backend', 'api', 'server side', 'rest api', 'graphql', 'integration'],
    keywords: ['backend', 'api', 'server', 'rest', 'graphql', 'ktor', 'node', 'postgres', 'grpc', 'database', 'integrat'],
    reply:
      "**Integration over reinvention.** Moe writes backend when the product needs it, and buys it when it does not.\n\n• **Contract first** — OpenAPI or protobuf so mobile and backend ship in parallel.\n• **Ktor or Node/TypeScript** for services, **Postgres** for anything relational, Redis for hot paths.\n• On **ZayGo** he designed a sync protocol: idempotent writes, client-generated UUIDs, cursor-based deltas — the thing that makes offline-first actually trustworthy around money.\n• On **Thitsa**, an append-only event ledger made reconciliation trivial and a whole class of balance bugs impossible.",
    actions: [
      { label: 'ZayGo sync protocol', icon: 'git-branch-outline', type: 'navigate', projectId: 'zaygo' },
      { label: 'Backend skills', icon: 'server-outline', type: 'navigate', screen: 'StackScreen' },
    ],
    followUps: ['View AI projects', 'See GitHub'],
  },
  {
    id: 'product',
    phrases: ['product thinking', 'how does he think', 'product sense', 'product decision', 'roadmap', 'strategy'],
    keywords: ['product', 'decision', 'thinking', 'strategy', 'roadmap', 'metric', 'experiment', 'discovery', 'research', 'prioriti'],
    reply:
      "**He starts from the decision, not the ticket.**\n\nThree habits worth naming:\n\n1. **Data before opinion.** ZayGo's onboarding went from 6 steps to 2 because 41% of installs died on step 4. The fix was a product decision, not a refactor.\n2. **Define the one-line success metric first.** Thitsa's nudges shipped as armable experiments via Remote Config — the winning variant lifted saves per user 27%.\n3. **Be willing to cut.** Features that do not move the number get removed, including his. The Compose Kit exists because it removed decisions, not because it added code.\n\nSafety beats engagement too: Nway Oo Doctor deliberately adds friction (red-flag screening, 'not a diagnosis') before any conversation.",
    actions: [
      { label: 'Read the case studies', icon: 'document-text-outline', type: 'navigate', screen: 'Work' },
      { label: 'Open ZayGo', icon: 'storefront-outline', type: 'navigate', projectId: 'zaygo' },
    ],
    followUps: ['Biggest measurable impact?', 'Is he available to hire?'],
  },
  {
    id: 'stack',
    phrases: ['his stack', 'tech stack', 'what does he use', 'tools', 'skillset'],
    keywords: ['stack', 'skills', 'skill', 'tech', 'tools', 'use', 'language', 'framework', 'experience with'],
    reply:
      "**The stack, by how much he leans on it:**\n\n• **Android** — Kotlin, Jetpack Compose, Coroutines/Flow, Hilt, Room, WorkManager, Baseline Profiles.\n• **AI/ML** — TensorFlow Lite, MediaPipe, Gemini API, RAG pipelines, eval harnesses.\n• **Firebase** — Auth, Firestore, Functions, FCM, Crashlytics, Remote Config.\n• **Backend** — Ktor, Node + TypeScript, Postgres, REST/OpenAPI, gRPC.\n• **Product** — discovery, funnel analysis, experiment design, metric definition.\n\nCurrently learning: on-device LLMs and Compose Multiplatform.",
    actions: [{ label: 'Open full stack', icon: 'layers-outline', type: 'navigate', screen: 'StackScreen' }],
    followUps: ['View AI projects', 'See GitHub'],
  },
  {
    id: 'impact',
    phrases: ['measurable impact', 'biggest impact', 'best result', 'key metrics', 'achievements'],
    keywords: ['impact', 'result', 'results', 'metric', 'numbers', 'outcome', 'achievement', 'biggest', 'best', 'proudest'],
    reply:
      "**Headline numbers across 8 shipped apps:**\n\n• **1.2M+** lifetime installs · **99.8%** crash-free sessions · **4.6\u2605** average Play rating.\n• **ZayGo:** activation **+38%** and checkout 4.2s → **1.6s** after the onboarding rewrite — same feature set, different product decision.\n• **Thitsa:** **41% D30 retention** (~2x category benchmark) and infra cost per MAU down 44%.\n• **PyiSai:** **92% precision** on-device flood prediction, 41K warnings issued in one season.\n• **Mingalar Kit:** feature build time down **45%** across three teams.\n\nThe one he is proudest of is the onboarding rewrite: the most valuable change shipped with almost no new code.",
    actions: [
      { label: 'All case studies', icon: 'trending-up-outline', type: 'navigate', screen: 'Work' },
      { label: 'ZayGo outcome', icon: 'storefront-outline', type: 'navigate', projectId: 'zaygo' },
    ],
    followUps: ['How does he think about product?', 'Is he available to hire?'],
  },
  {
    id: 'about',
    phrases: ['who is he', 'about him', 'background', 'experience', 'who is moe', 'tell me about moe'],
    keywords: ['about', 'who', 'background', 'experience', 'years', 'bio', 'story', 'moe', 'kyaw'],
    reply:
      "**Moe Kyaw Aung** — AI-first product engineer, six years building Android products, the last three with AI features in the loop.\n\nHe works end-to-end: discovery → design partnership → Kotlin/Compose build → backend integration → measure and iterate. Based in Yangon, collaborating remotely with teams across APAC and Europe.\n\nHis bias is simple: mobile surface, intelligent behaviour, measurable outcome. If a feature cannot state its metric, it does not get built.",
    actions: [
      { label: 'See his work', icon: 'albums-outline', type: 'navigate', screen: 'Work' },
      { label: 'Get in touch', icon: 'mail-outline', type: 'navigate', screen: 'Connect' },
    ],
    followUps: ['Show Android apps', 'Is he available to hire?'],
  },
  {
    id: 'hire',
    phrases: ['available to hire', 'hire him', 'work with', 'freelance', 'contact', 'get in touch', 'email him'],
    keywords: ['hire', 'available', 'freelance', 'contact', 'reach', 'email', 'collaborate', 'job', 'role', 'open to'],
    reply:
      "**Yes — he is open to product engineering roles and select freelance work, especially Android + AI.**\n\nFastest route is email (**hello@moekyaw.dev**); GitHub is the best proof of how he works.\n\nA useful first message: the problem, the current stage, and what 'good' looks like in 90 days. He replies with how he would approach the first two weeks.",
    actions: [
      { label: 'Contact details', icon: 'mail-outline', type: 'navigate', screen: 'Connect' },
      { label: 'Open GitHub', icon: 'logo-github', type: 'link', url: 'https://github.com/moekyaw-aung' },
    ],
    followUps: ['Show Android apps', 'Biggest measurable impact?'],
  },
  {
    id: 'design',
    phrases: ['ui ux', 'design', 'designer', 'motion', 'animation'],
    keywords: ['design', 'ui', 'ux', 'visual', 'motion', 'animation', 'prototype', 'figma'],
    reply:
      "He designs in code but thinks in flows.\n\n• Empty, error and loading states are treated as **first-class screens**, not afterthoughts.\n• Motion is deliberate: physics-based, interruptible, and it respects reduced-motion settings.\n• The **Mingalar Compose Kit** packages those decisions (glass panels, form fields, metric rows, state screens) into 60+ primitives so three teams look like one product.\n• Prototyped in Compose and tested with 5 real users before polishing pixels.",
    actions: [
      { label: 'Mingalar Compose Kit', icon: 'grid-outline', type: 'navigate', projectId: 'mingalar' },
      { label: 'Full stack', icon: 'layers-outline', type: 'navigate', screen: 'StackScreen' },
    ],
    followUps: ['Show Android apps', 'See GitHub'],
  },
];

const FALLBACK: Intent = {
  id: 'fallback',
  keywords: [],
  reply:
    "I can go deep on a few things — Android apps, AI projects, Firebase, backend integration, product decisions, or how to work with Moe.\n\nPick one and I'll answer with specifics rather than buzzwords.",
  followUps: ['Show Android apps', 'View AI projects', 'See GitHub', 'Is he available to hire?'],
};

export function answerFor(input: string): Intent {
  const q = input.toLowerCase().trim();
  if (!q) return FALLBACK;

  let best: Intent | null = null;
  let bestScore = 0;

  for (const intent of INTENTS) {
    let score = 0;
    for (const p of intent.phrases ?? []) {
      if (q.includes(p)) score += 4;
    }
    for (const k of intent.keywords) {
      if (q.includes(k)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }

  return bestScore > 0 && best ? best : FALLBACK;
}
