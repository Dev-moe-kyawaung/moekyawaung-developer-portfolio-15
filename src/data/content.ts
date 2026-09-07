/**
 * All portfolio content for Moe Kyaw Aung.
 * Kept in one place so copy, metrics and links stay consistent across screens.
 */

export const PROFILE = {
  name: 'Moe Kyaw Aung',
  first: 'Moe',
  role: 'AI-first Product Engineer',
  location: 'Yangon · working remote (APAC / EU)',
  hero: {
    lead: 'I turn complex ideas into',
    accent: 'intelligent mobile products',
    tail: '.',
  },
  sub:
    'Android engineer and product thinker. I ship Kotlin + Jetpack Compose apps with on-device AI, resilient backends and outcomes I can actually measure.',
  status: 'Open to product engineering roles & select freelance work',
  email: 'hello@moekyaw.dev',
  github: 'https://github.com/moekyaw-aung',
  githubHandle: 'github.com/moekyaw-aung',
  linkedin: 'https://www.linkedin.com/in/moekyaw-aung',
  linkedinHandle: 'in/moekyaw-aung',
  playStore: 'https://play.google.com/store/apps/developer?id=Moe+Kyaw+Aung',
  years: 6,
} as const;

export const STATS = [
  { value: '8', label: 'Apps shipped', icon: 'rocket-outline' },
  { value: '1.2M+', label: 'Lifetime installs', icon: 'phone-portrait-outline' },
  { value: '99.8%', label: 'Crash-free sessions', icon: 'shield-checkmark-outline' },
  { value: '4.6\u2605', label: 'Avg Play rating', icon: 'star-outline' },
] as const;

export type Category = 'android' | 'ai' | 'backend' | 'product';

export const CATEGORIES: { key: Category | 'all'; label: string }[] = [
  { key: 'all', label: 'All work' },
  { key: 'android', label: 'Android apps' },
  { key: 'ai', label: 'AI / ML' },
  { key: 'backend', label: 'Backend' },
  { key: 'product', label: 'Product' },
];

export type Project = {
  id: string;
  title: string;
  monogram: string;
  icon: string;
  tagline: string;
  year: string;
  role: string;
  duration: string;
  team: string;
  categories: Category[];
  tags: string[];
  accent: readonly [string, string];
  featured?: boolean;
  metrics: { value: string; label: string }[];
  summary: string;
  decisions: { title: string; body: string }[];
  challenges: { title: string; body: string }[];
  outcomes: string[];
  stack: string[];
  links: { label: string; url: string; icon: string }[];
};

export const PROJECTS: Project[] = [
  {
    id: 'zaygo',
    title: 'ZayGo',
    monogram: 'ZG',
    icon: 'storefront-outline',
    tagline: 'Offline-first commerce super app for neighbourhood shops',
    year: '2024',
    role: 'Lead Android & product engineering',
    duration: '9 months',
    team: '4 engineers, 1 designer, 1 PM',
    categories: ['android', 'backend', 'product'],
    tags: ['Kotlin', 'Compose', 'Offline-first', 'Payments'],
    accent: ['#A78BFA', '#4F46E5'] as const,
    featured: true,
    metrics: [
      { value: '+38%', label: 'Activation' },
      { value: '120K', label: 'Monthly actives' },
      { value: '1.6s', label: 'Checkout time' },
    ],
    summary:
      'A commerce app for small retailers in areas with unreliable connectivity. The interesting part was never the catalogue — it was making a money flow feel trustworthy when the network drops mid-order.',
    decisions: [
      {
        title: 'Cut onboarding from 6 steps to 2',
        body: 'Funnel data showed 41% of installs died on step 4 (shop verification). I pushed to defer verification until after the first order, moving it behind a soft prompt. We kept fraud risk contained with a value-capped first order instead of a hard wall. Activation rose 38% in the following month with no measurable increase in disputed orders.',
      },
      {
        title: 'One screen for browse, cart and recovery',
        body: 'Three separate screens meant three places for state to desync. I merged browse + cart + sync-status into a single Compose surface driven by one UiState, so an offline order, a failed payment retry and a successful confirmation are all just states of the same screen. Support tickets about "lost carts" dropped to near zero.',
      },
      {
        title: 'Ship behind flags, not app releases',
        body: 'Every meaningful behaviour change went out through Remote Config staged rollouts (5% \u2192 25% \u2192 100%) with a kill switch. It turned release day from an event into a non-event.',
      },
    ],
    challenges: [
      {
        title: 'A sync protocol that survives bad networks',
        body: 'Designed an idempotent write queue: every local mutation carries a client-generated UUID and a logical clock, flushed by WorkManager on connectivity change with cursor-based delta pulls on the way back. Retries can never double-charge, and conflicts resolve deterministically server-side.',
      },
      {
        title: 'Compose performance at 120K users',
        body: 'Profiled recomposition hot spots in the product grid and replaced over-broad state reads with derivedStateOf + stable model classes. Cold start on a Redmi 9A went 2.9s \u2192 1.4s, and janky frames dropped from 6.1% to 0.9%.',
      },
      {
        title: 'Payments across three providers',
        body: 'Built a provider-agnostic payment gateway interface so mobile code never talks to an SDK directly \u2014 the backend owns routing, retry and reconciliation, and the app only ever sees one sealed set of outcomes.',
      },
    ],
    outcomes: [
      'Activation +38% within one month of the onboarding rewrite',
      'Checkout time cut from 4.2s to 1.6s (p50, mid-range devices)',
      '99.87% crash-free sessions across 120K monthly actives',
      '4.7\u2605 Play rating from 8,400+ reviews',
      'Cart-loss support tickets reduced to under 5 per week',
    ],
    stack: [
      'Kotlin',
      'Jetpack Compose',
      'Coroutines + Flow',
      'Hilt',
      'Room',
      'WorkManager',
      'Firebase Auth',
      'Firestore',
      'Cloud Functions',
      'Remote Config',
      'Ktor',
      'Postgres',
    ],
    links: [
      { label: 'Case repo', url: 'https://github.com/moekyaw-aung/zaygo-case-study', icon: 'logo-github' },
      { label: 'Play Store', url: 'https://play.google.com/store/apps/developer?id=Moe+Kyaw+Aung', icon: 'logo-google-playstore' },
    ],
  },
  {
    id: 'pyisai',
    title: 'PyiSai Flood AI',
    monogram: 'PS',
    icon: 'water-outline',
    tagline: 'On-device flood risk prediction for disconnected townships',
    year: '2024',
    role: 'ML engineer & Android lead',
    duration: '5 months',
    team: '2 engineers, 1 hydrologist, 1 field researcher',
    categories: ['ai', 'android', 'product'],
    tags: ['TensorFlow Lite', 'Time series', 'Offline-first', 'Localisation'],
    accent: ['#22D3EE', '#2563EB'] as const,
    featured: true,
    metrics: [
      { value: '92%', label: 'Precision' },
      { value: '<40ms', label: 'Inference' },
      { value: '0 bars', label: 'Works offline' },
    ],
    summary:
      'River-level forecasting for communities where the warning matters most exactly when the network is gone. The product constraint (no connectivity during a flood) dictated the architecture before any model did.',
    decisions: [
      {
        title: 'On-device inference was a product decision, not a technical one',
        body: 'A cloud model would have been more accurate and far easier to update. But the app is used during floods, in precisely the conditions where data dies. Shipping a quantised TFLite model that scores locally meant warnings still arrive at the worst possible moment \u2014 which is the only moment that counts.',
      },
      {
        title: 'SMS as a first-class interface',
        body: 'Field interviews showed most at-risk households had a feature phone or a smartphone with data off. I built a USSD/SMS fallback that pushes the same risk level in Burmese, so the app is the rich surface, not the only surface.',
      },
      {
        title: 'Communicate confidence, never false certainty',
        body: 'The UI shows a risk band with a plain-language reason ("rain upstream + tide") instead of a scary number. Overclaiming precision destroys trust after one false alarm, so the copy is deliberately conservative.',
      },
    ],
    challenges: [
      {
        title: 'A model small enough to live on the phone',
        body: 'Trained a gradient-boosted sequence model distilled into a 1.9MB quantised TFLite graph over 12 years of gauge data. Inference under 40ms on a 2019 mid-range device, with a graceful degradation path when a gauge goes silent.',
      },
      {
        title: 'Data pipelines with holes in them',
        body: 'Gauge telemetry is patchy and full of sensor drift. Built an ingestion layer in Python with outlier rejection, gap interpolation and provenance tags \u2014 the boring data work is what made the model trustworthy.',
      },
      {
        title: 'Deltas over downloads',
        body: 'Model and data updates ship as compressed deltas over a 2G-friendly channel, so a village with intermittent signal still converges to current predictions within a day.',
      },
    ],
    outcomes: [
      '92% precision / 88% recall on 6-hour-ahead flood risk',
      'Full offline operation \u2014 zero network calls at inference time',
      'Deployed with 3 townships; 41K warnings issued in the 2024 season',
      'Field-validated by two partner NGOs with a shared evaluation harness',
    ],
    stack: [
      'Python',
      'TensorFlow Lite',
      'pandas',
      'Kotlin',
      'Jetpack Compose',
      'Firebase ML Model Downloader',
      'Cloud Functions',
      'BigQuery',
    ],
    links: [
      { label: 'ML pipeline', url: 'https://github.com/moekyaw-aung/pyisai-ml', icon: 'logo-github' },
      { label: 'Android app', url: 'https://github.com/moekyaw-aung/pyisai-android', icon: 'logo-android' },
    ],
  },
  {
    id: 'nwayoo',
    title: 'Nway Oo Doctor',
    monogram: 'NO',
    icon: 'medkit-outline',
    tagline: 'Conversational symptom triage with cited clinical guidance',
    year: '2023',
    role: 'Product engineer (AI features)',
    duration: '6 months',
    team: '3 engineers, 2 clinicians',
    categories: ['ai', 'android', 'backend', 'product'],
    tags: ['Gemini API', 'RAG', 'Kotlin', 'Safety UX'],
    accent: ['#F0ABFC', '#7C3AED'] as const,
    metrics: [
      { value: '7 min', label: 'Saved per consult' },
      { value: '100%', label: 'Answers cited' },
      { value: '-31%', label: 'No-shows' },
    ],
    summary:
      'A triage assistant that turns a messy symptom description into structured questions for a clinic. The hard problem was never generation \u2014 it was making an LLM safe enough to sit in front of a patient.',
    decisions: [
      {
        title: 'Retrieval before generation, always',
        body: 'Free-LLM answers about symptoms are a liability. I built a RAG layer over a curated guideline corpus so every claim maps to a source the clinician can open. No retrieval hit, no answer \u2014 the assistant says so plainly instead of improvising.',
      },
      {
        title: 'Red-flag gating in front of the chat',
        body: 'Before any conversation, a short structured screen checks emergency red flags and routes straight to a clinic with an explicit "this is not a diagnosis" step. It is deliberately friction: safety beats engagement metrics here.',
      },
      {
        title: 'Design the escalation, not just the answer',
        body: 'The real output of a session is a structured summary the clinician reads in 20 seconds. I worked with the clinicians to shape that artifact first, then designed the conversation backwards from it.',
      },
    ],
    challenges: [
      {
        title: 'Grounding a model in a small, authoritative corpus',
        body: 'Chunked 900 pages of guidelines with clinical section boundaries, embedded them, and added a cross-encoder re-ranker. Hallucination rate on the eval set fell from 14% to under 2%, and every answer exposes its citation span.',
      },
      {
        title: 'Latency that does not feel like a chatbot',
        body: 'Streamed tokens over server-sent events with a first-token budget of 800ms, and rendered the structured summary incrementally. Perceived wait dropped more than measured wait \u2014 which is what users actually feel.',
      },
      {
        title: 'Burmese-language understanding',
        body: 'Clinical Burmese is verbose and script-dense. Normalised input, built a domain phrase table with the clinicians, and eval-tested per-language behaviour separately from English.',
      },
    ],
    outcomes: [
      'Average consultation prep time reduced by 7 minutes',
      '100% of generated claims traceable to a cited guideline section',
      'Clinic no-shows down 31% after structured follow-up reminders',
      'Under 2% hallucination rate on a 1,200-case clinician eval set',
    ],
    stack: [
      'Kotlin',
      'Jetpack Compose',
      'Gemini API',
      'Vertex AI',
      'Vector search',
      'Node + TypeScript',
      'Postgres + pgvector',
      'Firebase Auth',
      'Cloud Functions',
    ],
    links: [
      { label: 'RAG service', url: 'https://github.com/moekyaw-aung/nwayoo-rag', icon: 'logo-github' },
    ],
  },
  {
    id: 'thitsa',
    title: 'Thitsa',
    monogram: 'TH',
    icon: 'wallet-outline',
    tagline: 'Micro-saving app driven by behavioural nudges',
    year: '2023',
    role: 'Android engineer',
    duration: '7 months',
    team: '3 engineers, 1 behavioural researcher',
    categories: ['android', 'backend', 'product'],
    tags: ['Firebase', 'Growth', 'Retention', 'Payments'],
    accent: ['#34D399', '#0EA5E9'] as const,
    metrics: [
      { value: '41%', label: 'D30 retention' },
      { value: '+27%', label: 'Saves per user' },
      { value: '99.9%', label: 'Ledger accuracy' },
    ],
    summary:
      'A savings app for first-time formal-finance users. Every rupee is traceable, and every notification earns its place or gets cut.',
    decisions: [
      {
        title: 'Nudges tuned to behaviour, not calendar',
        body: 'Generic "save money" pushes were ignored. I instrumented a small experiment pipeline so the researcher could arm nudge variants and I could ship them via Remote Config. The winning trigger was payday-adjacent and amount-personalised, lifting saves per user 27%.',
      },
      {
        title: 'Ledger-first architecture',
        body: 'The account balance is never stored as a mutable number \u2014 it is derived from an append-only event log. This made reconciliation trivial, audits trivial, and a class of balance bugs structurally impossible.',
      },
      {
        title: 'Trust screens before feature screens',
        body: 'For a money product, the empty state, the error state and the "your money is safe" state got designed first and treated as primary screens, not afterthoughts.',
      },
    ],
    challenges: [
      {
        title: 'Exactly-once across flaky networks',
        body: 'Idempotency keys on every save request plus a client-side write-ahead log. A request can be replayed a dozen times and the ledger still records exactly one entry.',
      },
      {
      title: 'Firebase at a sane cost',
        body: 'Firestore read costs were growing faster than users. Moved hot read paths to cached snapshots, moved aggregation to Cloud Functions, and batched FCM by segment \u2014 infra cost per MAU fell 44%.',
      },
    ],
    outcomes: [
      'D30 retention at 41%, roughly 2x the category benchmark',
      'Saves per active user +27% after nudge experimentation',
      '99.9% ledger reconciliation accuracy over 14 months',
      'Infrastructure cost per MAU reduced 44%',
    ],
    stack: [
      'Kotlin',
      'Jetpack Compose',
      'Firebase Auth',
      'Firestore',
      'FCM',
      'Crashlytics',
      'Remote Config',
      'Cloud Functions',
      'Ktor',
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/moekyaw-aung/thitsa', icon: 'logo-github' },
    ],
  },
  {
    id: 'mingalar',
    title: 'Mingalar Compose Kit',
    monogram: 'MK',
    icon: 'grid-outline',
    tagline: 'A shared Compose design system for three product teams',
    year: '2022 \u2013 now',
    role: 'Creator & maintainer',
    duration: 'Ongoing',
    team: 'Solo-authored, adopted by 3 teams',
    categories: ['android', 'product'],
    tags: ['Design system', 'Open source', 'Tooling', 'Motion'],
    accent: ['#FBBF24', '#EC4899'] as const,
    metrics: [
      { value: '-45%', label: 'Feature build time' },
      { value: '60+', label: 'Composable primitives' },
      { value: '3', label: 'Teams adopting' },
    ],
    summary:
      'Three teams were shipping three different-looking apps under one brand. The fix was not more design review \u2014 it was packaging the decisions so nobody had to make them again.',
    decisions: [
      {
        title: 'Encode decisions, do not document them',
        body: 'A style guide nobody reads is a style guide nobody follows. I shipped opinionated composables (glass panels, form fields, metric rows, empty/error/loading states) so the correct choice is also the shortest one.',
      },
      {
      title: 'Accessibility and motion as defaults',
        body: 'Semantics, touch targets and reduced-motion support are on by default in every primitive. Teams opt out consciously rather than forgetting to opt in.',
      },
      {
        title: 'Versioned like a product',
        body: 'Semantic versioning, a changelog, snapshot tests per primitive, and a sample app in CI. Adoption grew because upgrading was cheaper than forking.',
      },
    ],
    challenges: [
      {
        title: 'A theming layer that survives rebrands',
        body: 'Token-based theming (colour, type, elevation, motion curves) resolved at runtime, so a brand refresh is a token diff, not a refactor.',
      },
      {
        title: 'Preventing regressions across teams',
        body: 'Paparazzi snapshot tests render every primitive in light/dark and font-scale variants on CI. Visual regressions fail the build before review.',
      },
    ],
    outcomes: [
      'Feature build time down ~45% across adopting teams',
      '60+ tested primitives with light/dark and font-scale coverage',
      'One consistent visual language across three products',
      'Adopted by 3 teams; 180+ GitHub stars',
    ],
    stack: [
      'Kotlin',
      'Jetpack Compose',
      'Material 3',
      'Paparazzi',
      'GitHub Actions',
      'Maven Publish',
    ],
    links: [
      { label: 'View on GitHub', url: 'https://github.com/moekyaw-aung/mingalar-compose-kit', icon: 'logo-github' },
    ],
  },
];

export const FEATURED = PROJECTS.filter((p) => p.featured);

export function getProject(id: string) {
  return PROJECTS.find((p) => p.id === id) ?? PROJECTS[0];
}

export function nextProject(id: string) {
  const i = PROJECTS.findIndex((p) => p.id === id);
  return PROJECTS[(i + 1) % PROJECTS.length];
}

export type SkillGroup = {
  id: string;
  title: string;
  icon: string;
  accent: readonly [string, string];
  blurb: string;
  level: number;
  years: string;
  skills: string[];
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'android',
    title: 'Android',
    icon: 'logo-android',
    accent: ['#34D399', '#22D3EE'] as const,
    blurb: 'Six years shipping Kotlin apps that stay stable at scale \u2014 measured, not assumed.',
    level: 0.95,
    years: '6 yrs',
    skills: ['Kotlin', 'Jetpack Compose', 'Coroutines + Flow', 'Hilt', 'Room', 'WorkManager', 'App Links', 'Baseline Profiles'],
  },
  {
    id: 'compose',
    title: 'Jetpack Compose UI',
    icon: 'color-palette-outline',
    accent: ['#A78BFA', '#6366F1'] as const,
    blurb: 'Unidirectional state, stable models, honest recomposition budgets and deliberate motion.',
    level: 0.93,
    years: '4 yrs',
    skills: ['Material 3', 'Custom Layout', 'Motion & Physics', 'Theming tokens', 'Accessibility', 'Compose Multiplatform'],
  },
  {
    id: 'ai',
    title: 'AI / ML',
    icon: 'sparkles-outline',
    accent: ['#F0ABFC', '#8B5CF6'] as const,
    blurb: 'On-device where latency and privacy matter, cloud where reasoning is heavy, hybrid in between.',
    level: 0.88,
    years: '3 yrs',
    skills: ['TensorFlow Lite', 'MediaPipe', 'Gemini API', 'RAG pipelines', 'Vector search', 'Prompt engineering', 'Model evaluation'],
  },
  {
    id: 'firebase',
    title: 'Firebase',
    icon: 'flame-outline',
    accent: ['#FBBF24', '#F97316'] as const,
    blurb: 'My default backend spine \u2014 auth, data, messaging, flags and crash gates wired to release process.',
    level: 0.9,
    years: '5 yrs',
    skills: ['Auth', 'Firestore', 'Cloud Functions', 'FCM', 'Crashlytics', 'Remote Config', 'App Distribution', 'Analytics'],
  },
  {
    id: 'backend',
    title: 'Backend integration',
    icon: 'server-outline',
    accent: ['#22D3EE', '#3B82F6'] as const,
    blurb: 'Contracts first, so mobile and backend ship in parallel instead of waiting on each other.',
    level: 0.85,
    years: '4 yrs',
    skills: ['Ktor', 'Node + TypeScript', 'REST + OpenAPI', 'GraphQL', 'gRPC', 'Postgres', 'Redis', 'Sync protocols'],
  },
  {
    id: 'product',
    title: 'Product thinking',
    icon: 'bulb-outline',
    accent: ['#EC4899', '#F43F5E'] as const,
    blurb: 'Start from the decision, define the one-line success metric, then be willing to cut the feature.',
    level: 0.9,
    years: '4 yrs',
    skills: ['Discovery interviews', 'Funnel analysis', 'Experiment design', 'Roadmapping', 'Metric definition', 'Stakeholder alignment'],
  },
];

export const PROCESS = [
  {
    step: '01',
    title: 'Find the decision',
    body: 'Discovery, funnel data and five real user conversations before a line of code. Most "technical" problems are product problems in disguise.',
    icon: 'search-outline',
  },
  {
    step: '02',
    title: 'Build the intelligent loop',
    body: 'Kotlin + Compose for the surface, resilient state and sync underneath, AI only where it changes a decision the user would otherwise get wrong.',
    icon: 'code-slash-outline',
  },
  {
    step: '03',
    title: 'Measure, then cut',
    body: 'Instrument the metric, ship behind flags, watch the cohort. Features that do not move the number get removed \u2014 including mine.',
    icon: 'analytics-outline',
  },
];

export const LEARNING = ['On-device LLMs (Gemini Nano)', 'Compose Multiplatform', 'Rust for Android libs', 'Eval-driven AI product design'];

export const CONTACT_METHODS = [
  {
    id: 'email',
    title: 'Email',
    value: PROFILE.email,
    icon: 'mail-outline',
    accent: ['#A78BFA', '#6366F1'] as const,
    action: 'link' as const,
    url: `mailto:${PROFILE.email}`,
  },
  {
    id: 'github',
    title: 'GitHub',
    value: PROFILE.githubHandle,
    icon: 'logo-github',
    accent: ['#E5E7EB', '#94A3B8'] as const,
    action: 'link' as const,
    url: PROFILE.github,
  },
  {
    id: 'linkedin',
    title: 'LinkedIn',
    value: PROFILE.linkedinHandle,
    icon: 'logo-linkedin',
    accent: ['#60A5FA', '#2563EB'] as const,
    action: 'link' as const,
    url: PROFILE.linkedin,
  },
  {
    id: 'play',
    title: 'Play Store',
    value: 'Apps by Moe Kyaw Aung',
    icon: 'logo-google-playstore',
    accent: ['#34D399', '#22D3EE'] as const,
    action: 'link' as const,
    url: PROFILE.playStore,
  },
];
