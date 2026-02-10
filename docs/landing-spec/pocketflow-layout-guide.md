# PocketFlow Landing Page — Visual Layout Guide

**Companion to:** pocketflow-landing-wireframe.md  
**Purpose:** Quick visual reference for section layouts

---

## Page Flow (Vertical Scroll)

```sh
┌────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ═══════════════════════════════════════════════════════════   │ ← NAVIGATION (sticky)
│  Logo PocketFlow                    [Sign In] [Get Started]     │   72px height
│  ═══════════════════════════════════════════════════════════   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │                   HERO SECTION                            │  │ ← Section 1
│  │                                                            │  │   Dark bg #0a0a0a
│  │          "Never miss a bill.                              │  │   128px top padding
│  │           Never wonder where your money went."            │  │
│  │                                                            │  │
│  │          [Create Free Account] [View Demo]                │  │
│  │                                                            │  │
│  │              [Dashboard Screenshot]                       │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │          PROBLEM → RELIEF SECTION                         │  │ ← Section 2
│  │                                                            │  │   Dark bg #0a0a0a
│  │   "From financial chaos to financial clarity"            │  │   128px padding
│  │                                                            │  │
│  │   ┌──────────────────┐         ┌──────────────────┐     │  │
│  │   │   BEFORE         │    →    │   AFTER          │     │  │
│  │   │   The usual mess │         │   The PocketFlow │     │  │
│  │   │                  │         │   way            │     │  │
│  │   │   ✗ Problems     │         │   ✓ Solutions    │     │  │
│  │   │   ✗ Pain points  │         │   ✓ Benefits     │     │  │
│  │   │   ✗ Stress       │         │   ✓ Calm         │     │  │
│  │   └──────────────────┘         └──────────────────┘     │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │          CORE CAPABILITIES SECTION                        │  │ ← Section 3
│  │                                                            │  │   Gradient bg
│  │      "Everything you need. Nothing you don't."           │  │   128px padding
│  │                                                            │  │
│  │   ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐              │  │
│  │   │  📅  │  │  🎯  │  │  📊  │  │  🏆  │              │  │
│  │   │      │  │      │  │      │  │      │              │  │
│  │   │Bills │  │Budget│  │Spend │  │Goals │              │  │
│  │   │      │  │      │  │      │  │      │              │  │
│  │   └──────┘  └──────┘  └──────┘  └──────┘              │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │          TRUST & SECURITY SECTION                         │  │ ← Section 4
│  │                                                            │  │   bg #1a1a1a
│  │     "Your data. Your control. Your privacy."             │  │   96px padding
│  │                                                            │  │
│  │   [🛡️ Firebase]  [🔒 Private]  [🏦 No Bank Access]     │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │          HOW IT WORKS SECTION                             │  │ ← Section 5
│  │                                                            │  │   bg #0a0a0a
│  │        "Three steps to financial clarity"                │  │   128px padding
│  │                                                            │  │
│  │      ┌─────┐         ┌─────┐         ┌─────┐            │  │
│  │      │  1  │  ────→  │  2  │  ────→  │  3  │            │  │
│  │      │ Add │         │ See │         │Stay │            │  │
│  │      └─────┘         └─────┘         └─────┘            │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │          FINAL CTA SECTION                                │  │ ← Section 6
│  │                                                            │  │   bg with emerald glow
│  │           "Ready to take control?"                        │  │   128px padding
│  │                                                            │  │
│  │         [Create Free Account]                             │  │
│  │                                                            │  │
│  │  ✓ No credit card  ✓ Free forever  ✓ Takes 30 seconds   │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │          FAQ SECTION                                      │  │ ← Section 7
│  │                                                            │  │   bg #1a1a1a
│  │            "Common questions"                             │  │   96px padding
│  │                                                            │  │
│  │   ┌──────────────────┐  ┌──────────────────┐            │  │
│  │   │ Q1 ▼            │  │ Q5 ▼            │            │  │
│  │   │ Q2 ▼            │  │ Q6 ▼            │            │  │
│  │   │ Q3 ▼            │  │ Q7 ▼            │            │  │
│  │   │ Q4 ▼            │  │ Q8 ▼            │            │  │
│  │   └──────────────────┘  └──────────────────┘            │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ═══════════════════════════════════════════════════════════   │
│                                                                  │ ← FOOTER
│  PocketFlow    Product    Support    Legal                     │   bg #0a0a0a
│                                                                  │   64px padding
│  © 2026 PocketFlow. Built with care.                           │
│                                                                  │
│  ═══════════════════════════════════════════════════════════   │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

---

## Detailed Section Layouts

### Navigation Bar (Sticky)

```sh
Desktop (>1024px):
┌────────────────────────────────────────────────────────────────┐
│                                                                  │
│  [💰] PocketFlow                      [Sign In] [Get Started]   │
│  ← 20px weight 600                    ← Ghost   ← Primary CTA   │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
Height: 72px | Max-width: 1280px | Backdrop blur | Sticky top


Mobile (<768px):
┌────────────────────────────────────────────────────────────────┐
│                                                                  │
│  [💰] PocketFlow                                    [☰]         │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

---

### Hero Section

```sh
┌────────────────────────────────────────────────────────────────┐
│                                                                  │
│                          <128px gap>                             │
│                                                                  │
│                   "Never miss a bill.                            │
│            Never wonder where your money went."                  │
│                 ← 56px/64px, max-width 800px                     │
│                                                                  │
│                          <24px gap>                              │
│                                                                  │
│     "Track expenses, monitor bills, and understand your          │
│      spending — all in one calm, secure place."                 │
│                 ← 20px/32px, max-width 600px                     │
│                                                                  │
│                          <48px gap>                              │
│                                                                  │
│         [Create Free Account]    [View Demo]                     │
│         ← 56px height              ← Optional                    │
│                                                                  │
│                          <96px gap>                              │
│                                                                  │
│    ╔══════════════════════════════════════════════╗             │
│    ║                                              ║             │
│    ║      [Dashboard Screenshot]                 ║             │
│    ║      Perspective tilt, subtle 3D            ║             │
│    ║      Max-width: 1100px                      ║             │
│    ║      Border radius: 16px                    ║             │
│    ║                                              ║             │
│    ╚══════════════════════════════════════════════╝             │
│                                                                  │
│                          <96px gap>                              │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
Padding: 128px top, 96px bottom | Background: #0a0a0a
```

---

### Problem → Relief Section

```sh
Desktop (>1024px):
┌────────────────────────────────────────────────────────────────┐
│                                                                  │
│           "From financial chaos to financial clarity"           │
│                      ← 48px/56px centered                        │
│                                                                  │
│                          <64px gap>                              │
│                                                                  │
│  ╔══════════════════════╗              ╔══════════════════════╗ │
│  ║ BEFORE               ║              ║ AFTER                ║ │
│  ║ Red tint background  ║      →       ║ Green tint bg        ║ │
│  ║                      ║              ║                      ║ │
│  ║ "The usual mess"     ║              ║ "The PocketFlow way" ║ │
│  ║ ← 28px, red          ║              ║ ← 28px, emerald      ║ │
│  ║                      ║              ║                      ║ │
│  ║ ✗ Late fees          ║              ║ ✓ See upcoming bills ║ │
│  ║ ✗ Forgotten subs     ║              ║ ✓ Track spending     ║ │
│  ║ ✗ Financial panic    ║              ║ ✓ Real-time budgets  ║ │
│  ║ ✗ Spending guess     ║              ║ ✓ Clear patterns     ║ │
│  ║ ✗ Abandoned sheets   ║              ║ ✓ One dashboard      ║ │
│  ║                      ║              ║                      ║ │
│  ║ 18px/28px, gray      ║              ║ 18px/28px, white     ║ │
│  ║ 20px gap between     ║              ║ 20px gap between     ║ │
│  ╚══════════════════════╝              ╚══════════════════════╝ │
│   ← 48px padding                        ← 48px padding           │
│   ← Border radius 16px                  ← Border radius 16px     │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
Padding: 128px vertical | Max-width: 1200px | Gap: 32px between cards


Mobile (<768px):
┌────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ╔══════════════════════╗                                       │
│  ║ BEFORE               ║                                       │
│  ║ (full card)          ║                                       │
│  ╚══════════════════════╝                                       │
│                                                                  │
│            ↓ (arrow points down)                                │
│                                                                  │
│  ╔══════════════════════╗                                       │
│  ║ AFTER                ║                                       │
│  ║ (full card)          ║                                       │
│  ╚══════════════════════╝                                       │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

---

### Core Capabilities Section

```sh
Desktop (4 columns):
┌────────────────────────────────────────────────────────────────┐
│                                                                  │
│        "Everything you need. Nothing you don't."                │
│                   ← 48px/56px centered                           │
│                                                                  │
│                          <64px gap>                              │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │          │  │          │  │          │  │          │       │
│  │  [📅]   │  │  [🎯]   │  │  [📊]   │  │  [🏆]   │       │
│  │  64×64   │  │  64×64   │  │  64×64   │  │  64×64   │       │
│  │  emerald │  │  emerald │  │  emerald │  │  emerald │       │
│  │          │  │          │  │          │  │          │       │
│  │  "Never  │  │  "Stay   │  │"Understand│  │  "Build  │       │
│  │   miss a │  │  within  │  │  where it │  │   your   │       │
│  │  payment"│  │   your   │  │   goes"   │  │  future" │       │
│  │  24px    │  │  limits" │  │  24px     │  │  24px    │       │
│  │  white   │  │  24px    │  │  white    │  │  white   │       │
│  │          │  │  white   │  │           │  │          │       │
│  │  [desc]  │  │  [desc]  │  │  [desc]   │  │  [desc]  │       │
│  │  16px    │  │  16px    │  │  16px     │  │  16px    │       │
│  │  gray    │  │  gray    │  │  gray     │  │  gray    │       │
│  │          │  │          │  │           │  │          │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│  ← 40px vert   ← 32px gap →  ← 32px gap →   ← 32px gap →      │
│    32px horiz                                                   │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
Background: Gradient #0a0a0a → #1a1a1a | Padding: 128px vertical


Tablet (2 columns):
┌────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌──────────┐  ┌──────────┐                                    │
│  │ Feature1 │  │ Feature2 │                                    │
│  └──────────┘  └──────────┘                                    │
│                                                                  │
│  ┌──────────┐  ┌──────────┐                                    │
│  │ Feature3 │  │ Feature4 │                                    │
│  └──────────┘  └──────────┘                                    │
│                                                                  │
└────────────────────────────────────────────────────────────────┘


Mobile (1 column):
┌────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌──────────┐                                                   │
│  │ Feature1 │                                                   │
│  └──────────┘                                                   │
│  ┌──────────┐                                                   │
│  │ Feature2 │                                                   │
│  └──────────┘                                                   │
│  ┌──────────┐                                                   │
│  │ Feature3 │                                                   │
│  └──────────┘                                                   │
│  ┌──────────┐                                                   │
│  │ Feature4 │                                                   │
│  └──────────┘                                                   │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

---

### Trust & Security Section

```sh
┌────────────────────────────────────────────────────────────────┐
│                                                                  │
│      "Your data. Your control. Your privacy."                   │
│                ← 48px/56px centered                              │
│                                                                  │
│                          <24px gap>                              │
│                                                                  │
│    "PocketFlow takes security seriously. We use industry-        │
│     standard encryption and never ask for your bank login."      │
│                ← 20px/32px, max-width 700px                      │
│                                                                  │
│                          <64px gap>                              │
│                                                                  │
│     ┌────────────┐    ┌────────────┐    ┌────────────┐         │
│     │            │    │            │    │            │         │
│     │   [🛡️]    │    │   [🔒]    │    │   [🏦]    │         │
│     │  Emerald   │    │  Emerald   │    │  Emerald   │         │
│     │  48px      │    │  48px      │    │  48px      │         │
│     │            │    │            │    │            │         │
│     │ "Firebase  │    │   "Your    │    │ "No bank   │         │
│     │   Auth"    │    │  data stays│    │   login    │         │
│     │  18px bold │    │   yours"   │    │  required" │         │
│     │            │    │  18px bold │    │  18px bold │         │
│     │            │    │            │    │            │         │
│     │ Industry-  │    │  We never  │    │  Manual    │         │
│     │  leading   │    │  sell your │    │ tracking   │         │
│     │   auth     │    │   data     │    │  means you │         │
│     │ 14px gray  │    │ 14px gray  │    │ 14px gray  │         │
│     │ max 240px  │    │ max 240px  │    │ max 240px  │         │
│     │            │    │            │    │            │         │
│     └────────────┘    └────────────┘    └────────────┘         │
│     ← 48px gap →      ← 48px gap →                              │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
Background: #1a1a1a | Padding: 96px vertical | Max-width: 900px
```

---

### How It Works Section

```sh
Desktop:
┌────────────────────────────────────────────────────────────────┐
│                                                                  │
│          "Three steps to financial clarity"                     │
│                   ← 48px/56px centered                           │
│                                                                  │
│                          <64px gap>                              │
│                                                                  │
│   ┌─────────────┐         ┌─────────────┐         ┌─────────┐ │
│   │             │         │             │         │         │ │
│   │     ①      │  ────→  │     ②      │  ────→  │    ③   │ │
│   │   80px Ø   │  64px   │   80px Ø   │  64px   │  80px Ø │ │
│   │  Emerald   │  arrow  │  Emerald   │  arrow  │ Emerald │ │
│   │            │         │            │         │         │ │
│   │   "Add     │         │   "See     │         │  "Stay  │ │
│   │    your    │         │    your    │         │    on   │ │
│   │ financial  │         │ financial  │         │  track" │ │
│   │   data"    │         │  picture"  │         │         │ │
│   │  24px bold │         │  24px bold │         │ 24px    │ │
│   │            │         │            │         │  bold   │ │
│   │ [desc]     │         │ [desc]     │         │ [desc]  │ │
│   │ 16px gray  │         │ 16px gray  │         │ 16px    │ │
│   │            │         │            │         │  gray   │ │
│   │ Optional:  │         │ Optional:  │         │Optional:│ │
│   │ Screenshot │         │ Screenshot │         │ Screen  │ │
│   │            │         │            │         │         │ │
│   └─────────────┘         └─────────────┘         └─────────┘ │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
Background: #0a0a0a | Padding: 128px vertical | 3 columns


Mobile (Stack vertically):
┌────────────────────────────────────────────────────────────────┐
│                                                                  │
│   ┌─────────────┐                                               │
│   │      ①      │                                               │
│   │   [Step 1]  │                                               │
│   └─────────────┘                                               │
│         ↓                                                        │
│   ┌─────────────┐                                               │
│   │      ②      │                                               │
│   │   [Step 2]  │                                               │
│   └─────────────┘                                               │
│         ↓                                                        │
│   ┌─────────────┐                                               │
│   │      ③      │                                               │
│   │   [Step 3]  │                                               │
│   └─────────────┘                                               │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

---

### Final CTA Section

```sh
┌────────────────────────────────────────────────────────────────┐
│                                                                  │
│                                                                  │
│                    "Ready to take control?"                      │
│                      ← 56px/64px centered                        │
│                                                                  │
│                          <16px gap>                              │
│                                                                  │
│   "Join users who've stopped stressing about money.             │
│        It's free to start, no credit card required."            │
│                      ← 20px/32px gray                            │
│                                                                  │
│                          <48px gap>                              │
│                                                                  │
│              ╔═══════════════════════════════╗                  │
│              ║  Create Free Account          ║                  │
│              ║  64px height, emerald glow    ║                  │
│              ║  20px text, 700 weight        ║                  │
│              ╚═══════════════════════════════╝                  │
│                      ← Subtle pulse animation                    │
│                                                                  │
│                          <24px gap>                              │
│                                                                  │
│      ✓ No credit card   ✓ Free forever   ✓ Takes 30 seconds    │
│                      ← 14px gray, centered                       │
│                                                                  │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
Background: #0a0a0a with radial emerald glow (10% opacity)
Padding: 128px vertical | Max-width: 800px centered
```

---

### FAQ Section

```sh
Desktop (2 columns):
┌────────────────────────────────────────────────────────────────┐
│                                                                  │
│                  "Common questions"                             │
│                    ← 48px/56px centered                          │
│                                                                  │
│                          <64px gap>                              │
│                                                                  │
│  ┌───────────────────────────┐  ┌───────────────────────────┐  │
│  │                           │  │                           │  │
│  │ Q1: Is it free? ▼         │  │ Q5: Need help? ▼          │  │
│  │ ━━━━━━━━━━━━━━━━━━━━━━  │  │ ━━━━━━━━━━━━━━━━━━━━━━  │  │
│  │ [Answer hidden]           │  │ [Answer hidden]           │  │
│  │                           │  │                           │  │
│  │ Q2: Bank access? ▼        │  │ Q6: Mobile app? ▼         │  │
│  │ ━━━━━━━━━━━━━━━━━━━━━━  │  │ ━━━━━━━━━━━━━━━━━━━━━━  │  │
│  │ [Answer hidden]           │  │ [Answer hidden]           │  │
│  │                           │  │                           │  │
│  │ Q3: Data collection? ▼    │  │ Q7: vs competitors? ▼     │  │
│  │ ━━━━━━━━━━━━━━━━━━━━━━  │  │ ━━━━━━━━━━━━━━━━━━━━━━  │  │
│  │ [Answer hidden]           │  │ [Answer hidden]           │  │
│  │                           │  │                           │  │
│  │ Q4: Import data? ▼        │  │ Q8: Export data? ▼        │  │
│  │ ━━━━━━━━━━━━━━━━━━━━━━  │  │ ━━━━━━━━━━━━━━━━━━━━━━  │  │
│  │ [Answer hidden]           │  │ [Answer hidden]           │  │
│  │                           │  │                           │  │
│  └───────────────────────────┘  └───────────────────────────┘  │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
Background: #1a1a1a | Padding: 96px vertical | Max-width: 1100px


Expanded state example:
┌───────────────────────────────┐
│                               │
│ Q1: Is PocketFlow free? ▲     │  ← White, 18px bold
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━ │  ← Border #2d2d2d
│                               │
│ Yes, completely free. No      │  ← Gray, 16px
│ hidden fees, no premium       │     Margin-top 16px
│ tiers, no credit card         │     Max-width 500px
│ required...                   │
│                               │
└───────────────────────────────┘


Mobile (1 column, full width):
┌────────────────────────────────────────────────────────────────┐
│                                                                  │
│  Q1: Is it free? ▼                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Q2: Bank access? ▼                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Q3: Data collection? ▼                                         │
│  ...                                                             │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

---

### Footer

```sh
Desktop:
┌────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐ │
│  │            │  │            │  │            │  │          │ │
│  │ [💰]      │  │  Product   │  │  Support   │  │  Legal   │ │
│  │ PocketFlow │  │  14px caps │  │  14px caps │  │ 14px caps│ │
│  │            │  │            │  │            │  │          │ │
│  │ "Simple    │  │ Dashboard  │  │ Help Center│  │ Privacy  │ │
│  │  finance   │  │ Features   │  │ Contact Us │  │ Terms    │ │
│  │  tracking" │  │ How Works  │  │ Feature Req│  │ Cookies  │ │
│  │            │  │ Pricing    │  │ Report Bug │  │          │ │
│  │ 14px gray  │  │            │  │            │  │          │ │
│  │ max 240px  │  │ 14px/28px  │  │ 14px/28px  │  │ 14px/28px│ │
│  │            │  │ gray       │  │ gray       │  │ gray     │ │
│  │            │  │            │  │            │  │          │ │
│  └────────────┘  └────────────┘  └────────────┘  └──────────┘ │
│                                                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                  │
│              © 2026 PocketFlow. Built with care.                │
│                        ← 14px gray centered                      │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
Background: #0a0a0a | Border-top: #2d2d2d | Padding: 64px


Mobile (Stack):
┌────────────────────────────────────────────────────────────────┐
│                                                                  │
│  [💰] PocketFlow                                                │
│  "Simple finance tracking..."                                   │
│                                                                  │
│  Product                                                         │
│  Dashboard, Features, How Works, Pricing                        │
│                                                                  │
│  Support                                                         │
│  Help Center, Contact Us, Feature Req, Report Bug              │
│                                                                  │
│  Legal                                                           │
│  Privacy, Terms, Cookies                                        │
│                                                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                  │
│  © 2026 PocketFlow. Built with care.                            │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

---

## Color Reference (Quick Lookup)

```sh
Backgrounds:
  #0a0a0a  ▓▓▓▓▓  Deepest (main page bg)
  #1a1a1a  ▓▓▓▓░  Dark (cards)
  #2d2d2d  ▓▓░░░  Light (elevated)

Text:
  #ffffff  ████  Primary (headings)
  #a0a0a0  ███░  Secondary (body)
  #6b7280  ██░░  Muted (captions)

Accents:
  #10b981 → #059669  Emerald gradient (primary CTA)
  #667eea → #764ba2  Purple gradient (secondary)
  #22c55e  Green (success)
  #ef4444  Red (error)

Borders:
  #2d2d2d  ▓░  Subtle separation
  rgba(255,255,255,0.05)  Almost invisible
  rgba(16,185,129,0.3)  Emerald 30% (trust cards)
```

---

## Component Interaction States

```sh
Buttons:
  Default:  [Button Text]
  Hover:    [Button Text]  ← Scale 1.02, shadow ↑
  Focus:    [Button Text]  ← 2px emerald outline
  Active:   [Button Text]  ← Scale 0.98

Feature Cards:
  Default:  ┌─────────┐  Border #2d2d2d
            │ Card    │
            └─────────┘
  Hover:    ┌─────────┐  Border emerald, translateY(-4px)
            │ Card    │
            └─────────┘

FAQ Items:
  Collapsed: Question text ▼  ← White
  Expanded:  Question text ▲  ← Emerald
             Answer text      ← Gray, smooth height expand
```

---

## Animation Timeline

```sh
Page Load (0-2s):
  0.0s  Navigation fades in (opacity 0 → 1)
  0.2s  Hero headline fades up (translateY 20px → 0)
  0.4s  Dashboard screenshot fades up
  0.6s  Problem card left fades in
  0.7s  Problem card right fades in

On Scroll (Intersection Observer):
  Enter viewport → Fade up (0.6s ease-out)
  Feature cards → Stagger 0.1s each
  Steps 1-2-3 → Sequential 0.2s each

Continuous:
  Final CTA button → Subtle pulse (2s infinite)
  Hover states → 0.2-0.3s transitions
```

---

## Mobile Breakpoints Summary

```sh
Desktop (1024px+):
  - 4 feature columns
  - 2 FAQ columns
  - Horizontal how-it-works
  - 4 footer columns

Tablet (768-1023px):
  - 2 feature columns
  - 2 FAQ columns
  - 2 how-it-works (step 3 below)
  - 2 footer columns

Mobile (<768px):
  - 1 feature column
  - 1 FAQ column
  - 1 how-it-works column (vertical)
  - 1 footer column (stacked)
  - Hamburger menu
  - Reduced paddings (128px → 64px)
```

---

## **End of Visual Layout Guide**

Use this alongside the main wireframe spec for rapid visual reference during implementation.
