# PocketFlow Landing Page — Wireframe & Specification

**Version:** 1.0  
**Target:** Production-ready fintech SaaS landing page  
**Implementation:** Pass to Jules for build  
**Theme:** Dark mode, modern, professional

---

## Design System Reference

### Colors

```properties
Primary Background: #0a0a0a (deepest black)
Secondary Background: #1a1a1a (card backgrounds)
Tertiary Background: #2d2d2d (elevated elements)
Accent Primary: Linear gradient #10b981 → #059669 (emerald/green - trust, growth)
Accent Secondary: Linear gradient #667eea → #764ba2 (purple - premium)
Text Primary: #ffffff (pure white)
Text Secondary: #a0a0a0 (muted gray)
Text Muted: #6b7280 (subtle gray)
Border: #2d2d2d (subtle separation)
Success: #22c55e (green)
Warning: #fbbf24 (amber)
Error: #ef4444 (red)
```

### Typography

```css
Font Family: 'Inter', -apple-system, system-ui, sans-serif
Heading XL: 56px / 64px, weight 700, letter-spacing -0.02em
Heading L: 48px / 56px, weight 700, letter-spacing -0.02em
Heading M: 36px / 44px, weight 700
Heading S: 28px / 36px, weight 600
Body L: 20px / 32px, weight 400
Body M: 16px / 24px, weight 400
Body S: 14px / 20px, weight 400
Caption: 12px / 16px, weight 500
```

### Spacing Scale

```css
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px, 128px
```

### Border Radius

```css
sm: 6px
md: 8px
lg: 12px
xl: 16px
2xl: 24px
full: 9999px
```

---

## Page Structure

```sh
/ (root)
├── Navigation Bar (sticky)
├── Hero Section
├── Problem → Relief Section
├── Core Capabilities Section
├── Trust & Security Section
├── How It Works Section
├── Final CTA Section
├── FAQ Section
└── Footer
```

---

## Section 1: Navigation Bar

**Layout:** Sticky, full-width, backdrop blur

**Structure:**

```sh
┌─────────────────────────────────────────────────────────────┐
│  [Logo] PocketFlow                    [Sign In] [Get Started]│
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Specifications:**

- **Height:** 72px
- **Background:** rgba(10, 10, 10, 0.8) with backdrop-filter blur(12px)
- **Border:** 1px solid rgba(255,255,255,0.05) bottom
- **Shadow:** 0 4px 24px rgba(0,0,0,0.12) when scrolled
- **Container:** max-width 1280px, centered, padding 0 32px

**Left Side:**

- **Logo:** Wallet icon (same as app) in emerald gradient
- **Text:** "PocketFlow" — 20px, weight 600, white

**Right Side:**

- **Sign In Button:**
  - Style: Ghost button
  - Size: 40px height, padding 12px 20px
  - Text: 16px, `#a0a0a0`
  - Hover: background `#1a1a1a`, text white
  - Border radius: 8px

- **Get Started Button:**
  - Style: Primary CTA
  - Size: 40px height, padding 12px 24px
  - Background: emerald gradient (`#10b981` → `#059669`)
  - Text: 16px, weight 600, white
  - Border radius: 8px
  - Hover: slight scale (1.02), increased shadow
  - Shadow: 0 4px 12px rgba(16, 185, 129, 0.3)

**Mobile Behavior (<768px):**

- Logo on left
- Hamburger menu on right
- Full-screen overlay menu when opened

---

## Section 2: Hero Section

**Purpose:** Immediate clarity on what PocketFlow solves

**Layout:** Centered content with optional screenshot

**Structure:**

```sh
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│                    [Headline]                                 │
│                    [Subheadline]                              │
│                    [CTA Buttons]                              │
│                                                               │
│              [Dashboard Screenshot]                           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Specifications:**

- **Background:** `#0a0a0a` with subtle noise texture (opacity 0.03)
- **Padding:** 128px top, 96px bottom
- **Container:** max-width 1280px, centered

**Headline:**

```properties
"Never miss a bill. Never wonder where your money went."
```

- **Typography:** Heading XL (56px/64px)
- **Color:** White
- **Max-width:** 800px
- **Alignment:** Center
- **Gradient accent:** Optional subtle gradient on "Never" words using emerald

**Subheadline:**

```properties
"Track expenses, monitor bills, and understand your spending — all in one calm, secure place. No complexity. No bank access required."
```

- **Typography:** Body L (20px/32px)
- **Color:** `#a0a0a0`
- **Max-width:** 600px
- **Alignment:** Center
- **Margin-top:** 24px

**CTA Buttons:**

- **Container:** Flex row, gap 16px, margin-top 48px, justify center
- **Primary CTA:** "Create Free Account"
  - Same style as nav Get Started button
  - Larger: 56px height, padding 16px 32px
  - Text: 18px, weight 600
- **Secondary CTA:** "View Demo" (optional)
  - Ghost button with border
  - Border: 1px solid `#2d2d2d`
  - Text: `#a0a0a0`
  - Hover: border emerald, text white

**Dashboard Screenshot:**

- **Margin-top:** 96px
- **Style:** Perspective mockup (slight 3D tilt)
- **Image:** Use [Dashboard Hero](./assets/dashboard-hero.JPG) (dashboard view)
- **Border:** 1px solid rgba(255,255,255,0.08)
- **Border-radius:** 16px
- **Shadow:** 0 24px 64px rgba(0,0,0,0.4), 0 0 100px rgba(16,185,129,0.15)
- **Max-width:** 1100px
- **Animation:** Subtle fade-up on load

---

## Section 3: Problem → Relief

**Purpose:** Show the chaos users experience, then show the calm

**Layout:** Two-column layout with visual contrast

**Structure:**

```sh
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌──────────────────┐           ┌──────────────────┐        │
│  │  BEFORE          │           │  AFTER           │        │
│  │  [Chaos visual]  │    →      │  [Calm visual]   │        │
│  │  Problems list   │           │  Solutions list  │        │
│  └──────────────────┘           └──────────────────┘        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Specifications:**

- **Background:** #0a0a0a
- **Padding:** 128px vertical
- **Container:** max-width 1200px

**Section Title (above cards):**

```md
"From financial chaos to financial clarity"
```

- **Typography:** Heading L (48px/56px)
- **Color:** White
- **Alignment:** Center
- **Margin-bottom:** 64px

**Before Card (Left):**

- **Background:** Subtle gradient from #1a1a1a to transparent red tint (rgba(239,68,68,0.05))
- **Border:** 1px solid rgba(239,68,68,0.2)
- **Border-radius:** 16px
- **Padding:** 48px

**Title:** "The usual mess"

- Typography: Heading S (28px/36px)
- Color: #ef4444 (red)
- Icon: Crossed-out calendar or stressed face emoji

**Problems List:**

- "Late payment fees from forgotten bills"
- "Subscriptions charging you for months unnoticed"
- "Panic wondering if you can afford something"
- "Guessing how much you spent on food this month"
- "Spreadsheets you abandoned in February"

**Styling:**

- Each line: 18px/28px, #a0a0a0
- Icon before each: Red X or alert triangle
- Gap: 20px between items

**After Card (Right):**

- **Background:** Subtle gradient from #1a1a1a to transparent emerald tint (rgba(16,185,129,0.05))
- **Border:** 1px solid rgba(16,185,129,0.3)
- **Border-radius:** 16px
- **Padding:** 48px

**Title:** "The PocketFlow way"

- Typography: Heading S (28px/36px)
- Color: #10b981 (emerald)
- Icon: Check circle or peaceful emoji

**Solutions List:**

- "See every upcoming bill before it hits"
- "Know exactly what's draining your account"
- "Budgets that show real-time progress"
- "Spending patterns you can actually understand"
- "All your finance data in one secure dashboard"

**Styling:**

- Each line: 18px/28px, white
- Icon before each: Emerald checkmark
- Gap: 20px between items

**Arrow Between Cards:**

- Large arrow pointing right (desktop)
- Down arrow (mobile)
- Color: emerald gradient
- Size: 48px

**Mobile (<768px):**

- Stack vertically
- Arrow points down
- Before card first, after card second

---

## Section 4: Core Capabilities

**Purpose:** Show 3-4 key features without overwhelming

**Layout:** Icon-grid layout

**Structure:**

```sh
┌─────────────────────────────────────────────────────────────┐
│                    [Section Title]                            │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Feature1 │  │ Feature2 │  │ Feature3 │  │ Feature4 │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Specifications:**

- **Background:** Linear gradient from #0a0a0a to #1a1a1a
- **Padding:** 128px vertical
- **Container:** max-width 1200px

**Section Title:**

```md
"Everything you need. Nothing you don't."
```

- **Typography:** Heading L (48px/56px)
- **Color:** White
- **Alignment:** Center
- **Margin-bottom:** 64px

**Feature Grid:**

- **Layout:** 4 columns (desktop), 2 columns (tablet), 1 column (mobile)
- **Gap:** 32px

**Feature Card Structure:**
Each card contains:

1. Icon container (top)
2. Title
3. Description

**Card Styling:**

- **Background:** #1a1a1a
- **Border:** 1px solid #2d2d2d
- **Border-radius:** 16px
- **Padding:** 40px 32px
- **Hover:** Border color changes to emerald, slight translate up (-4px)
- **Transition:** all 0.3s ease

**Icon Container:**

- **Size:** 64px × 64px
- **Background:** Emerald gradient (10% opacity)
- **Border-radius:** 12px
- **Icon color:** Emerald gradient
- **Icon size:** 32px
- **Margin-bottom:** 24px

---

### Feature 1: Bills & Subscriptions

**Icon:** Calendar with checkmarks

**Title:** "Never miss a payment"

- Typography: Heading S (24px/32px)
- Color: White
- Margin-bottom: 12px

**Description:**

```md
"See all your bills and subscriptions in one timeline. Get reminded before due dates. Mark them paid with a tap."
```

- Typography: Body M (16px/24px)
- Color: #a0a0a0

---

### Feature 2: Smart Budgets

**Icon:** Target/bullseye

**Title:** "Stay within your limits"

- Typography: Heading S (24px/32px)
- Color: White
- Margin-bottom: 12px

**Description:**

```md
"Set monthly budgets by category. Watch real-time progress bars. Get alerts before you overspend."
```

- Typography: Body M (16px/24px)
- Color: #a0a0a0

---

### Feature 3: Spending Insights

**Icon:** Bar chart rising

**Title:** "Understand where it goes"

- Typography: Heading S (24px/32px)
- Color: White
- Margin-bottom: 12px

**Description:**

```md
"Visual breakdowns by category. Trends over time. Clear answers to 'how much did I spend on…'"
```

- Typography: Body M (16px/24px)
- Color: #a0a0a0

---

### Feature 4: Financial Goals

**Icon:** Trophy or mountain flag

**Title:** "Build your future"

- Typography: Heading S (24px/32px)
- Color: White
- Margin-bottom: 12px

**Description:**

```md
"Set savings goals. Track progress automatically. Get notified when you hit milestones."
```

- Typography: Body M (16px/24px)
- Color: #a0a0a0

---

## Section 5: Trust & Security

**Purpose:** Address safety concerns upfront

**Layout:** Centered content with trust badges

**Structure:**

```sh
┌─────────────────────────────────────────────────────────────┐
│                    [Section Title]                            │
│                    [Main Message]                             │
│                                                               │
│         [Badge 1]    [Badge 2]    [Badge 3]                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Specifications:**

- **Background:** #1a1a1a
- **Padding:** 96px vertical
- **Container:** max-width 900px, centered

**Section Title:**

```md
"Your data. Your control. Your privacy."
```

- **Typography:** Heading L (48px/56px)
- **Color:** White
- **Alignment:** Center
- **Margin-bottom:** 24px

**Main Message:**

```md
"PocketFlow takes security seriously. We use industry-standard encryption and never ask for your bank login. Your financial data stays yours."
```

- **Typography:** Body L (20px/32px)
- **Color:** #a0a0a0
- **Alignment:** Center
- **Max-width:** 700px
- **Margin-bottom:** 64px

**Trust Badges:**

- **Layout:** 3 columns, flex, justify center, gap 48px
- **Mobile:** Stack vertically

**Badge Structure:**
Each badge:

1. Icon (top)
2. Title
3. Short description

---

### Badge 1: Secure Authentication

**Icon:** Shield with checkmark (emerald)

**Title:** "Firebase Auth"

- Typography: 18px/24px, weight 600
- Color: White
- Margin-bottom: 8px

**Description:**

```md
"Industry-leading authentication. Your credentials never touch our servers."
```

- Typography: 14px/20px
- Color: #a0a0a0
- Text-align: center
- Max-width: 240px

---

### Badge 2: Private Data

**Icon:** Lock closed (emerald)

**Title:** "Your data stays yours"

- Typography: 18px/24px, weight 600
- Color: White
- Margin-bottom: 8px

**Description:**

```md
"We never sell your data. No third-party tracking. No ads. Ever."
```

- Typography: 14px/20px
- Color: #a0a0a0
- Text-align: center
- Max-width: 240px

---

### Badge 3: No Bank Access

**Icon:** Bank building with X (emerald)

**Title:** "No bank login required"

- Typography: 18px/24px, weight 600
- Color: White
- Margin-bottom: 8px

**Description:**

```md
"Manual tracking means you're in control. We never need access to your accounts."
```

- Typography: 14px/20px
- Color: #a0a0a0
- Text-align: center
- Max-width: 240px

---

## Section 6: How It Works

**Purpose:** Show simplicity in 3 steps

**Layout:** Horizontal step flow

**Structure:**

```sh
┌─────────────────────────────────────────────────────────────┐
│                    [Section Title]                            │
│                                                               │
│    ┌─────┐         ┌─────┐         ┌─────┐                 │
│    │  1  │  ───→   │  2  │  ───→   │  3  │                 │
│    └─────┘         └─────┘         └─────┘                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Specifications:**

- **Background:** #0a0a0a
- **Padding:** 128px vertical
- **Container:** max-width 1200px

**Section Title:**

```md
"Three steps to financial clarity"
```

- **Typography:** Heading L (48px/56px)
- **Color:** White
- **Alignment:** Center
- **Margin-bottom:** 64px

**Steps Container:**

- **Layout:** 3 columns, gap 48px
- **Mobile:** Stack vertically, arrows point down

---

### Step 1: Add Your Info

**Number Badge:** Large "1" in emerald circle (80px diameter)

**Title:** "Add your financial data"

- Typography: Heading S (24px/32px)
- Color: White
- Margin-top: 24px
- Margin-bottom: 12px

**Description:**

```md
"Manually log expenses, set up recurring bills, create budgets by category. Import CSV if you have historical data."
```

- Typography: Body M (16px/24px)
- Color: #a0a0a0

**Visual Aid (optional):** Screenshot or illustration of transaction form

---

### Step 2: Get Visibility

**Number Badge:** Large "2" in emerald circle (80px diameter)

**Title:** "See your financial picture"

- Typography: Heading S (24px/32px)
- Color: White
- Margin-top: 24px
- Margin-bottom: 12px

**Description:**

```md
"Your dashboard shows income vs expenses, spending by category, upcoming bills, and budget progress — all in real-time."
```

- Typography: Body M (16px/24px)
- Color: #a0a0a0

**Visual Aid (optional):** Screenshot of dashboard charts

---

### Step 3: Stay on Track

**Number Badge:** Large "3" in emerald circle (80px diameter)

**Title:** "Get insights and stay ahead"

- Typography: Heading S (24px/32px)
- Color: White
- Margin-top: 24px
- Margin-bottom: 12px

**Description:**

```md
"Receive email alerts for budget limits, upcoming bills, and goal achievements. Review patterns and adjust your habits."
```

- Typography: Body M (16px/24px)
- Color: #a0a0a0

**Visual Aid (optional):** Screenshot of notification or insight

**Arrows Between Steps:**

- Style: Thin arrow (2px stroke)
- Color: #2d2d2d
- Size: 64px long
- Desktop only (hidden mobile)

---

## Section 7: Final CTA

**Purpose:** Strong conversion push with social proof

**Layout:** Centered hero-style CTA

**Structure:**

```sh
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│                    [Headline]                                 │
│                    [Subtext]                                  │
│                    [CTA Button]                               │
│                    [Reassurance Text]                         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Specifications:**

- **Background:** Subtle emerald gradient radial overlay (10% opacity from center)
- **Base background:** #0a0a0a
- **Padding:** 128px vertical
- **Container:** max-width 800px, centered

**Headline:**

```md
"Ready to take control?"
```

- **Typography:** Heading XL (56px/64px)
- **Color:** White
- **Alignment:** Center
- **Margin-bottom:** 16px

**Subtext:**

```md
"Join users who've stopped stressing about money. It's free to start, no credit card required."
```

- **Typography:** Body L (20px/32px)
- **Color:** #a0a0a0
- **Alignment:** Center
- **Margin-bottom:** 48px

**CTA Button:**

```md
"Create Free Account"
```

- **Size:** 64px height, padding 20px 48px
- **Background:** Emerald gradient (#10b981 → #059669)
- **Text:** 20px, weight 700, white
- **Border-radius:** 12px
- **Shadow:** 0 8px 24px rgba(16, 185, 129, 0.4)
- **Hover:** Scale 1.05, increased shadow
- **Animation:** Subtle pulse on load

**Reassurance Text (below button):**

```md
"✓ No credit card required ✓ Free forever ✓ Takes 30 seconds"
```

- **Typography:** 14px/20px
- **Color:** #6b7280
- **Alignment:** Center
- **Margin-top:** 24px
- **Icons:** Emerald checkmarks

---

## Section 8: FAQ

**Purpose:** Address common objections

**Layout:** Two-column accordion (desktop), single column (mobile)

**Structure:**

```md
┌─────────────────────────────────────────────────────────────┐
│ [Section Title] │
│ │
│ ┌──────────────────┐ ┌──────────────────┐ │
│ │ Q1 │ │ Q4 │ │
│ │ Q2 │ │ Q5 │ │
│ │ Q3 │ │ Q6 │ │
│ └──────────────────┘ └──────────────────┘ │
│ │
└─────────────────────────────────────────────────────────────┘
```

**Specifications:**

- **Background:** #1a1a1a
- **Padding:** 96px vertical
- **Container:** max-width 1100px

**Section Title:**

```md
"Common questions"
```

- **Typography:** Heading L (48px/56px)
- **Color:** White
- **Alignment:** Center
- **Margin-bottom:** 64px

**FAQ Item Styling:**

- **Background:** Transparent
- **Border-bottom:** 1px solid #2d2d2d
- **Padding:** 24px 0
- **Hover:** Question text turns emerald

**Question (collapsed state):**

- **Typography:** 18px/24px, weight 600
- **Color:** White
- **Cursor:** pointer
- **Icon:** Chevron down (right-aligned)

**Answer (expanded state):**

- **Typography:** 16px/24px
- **Color:** #a0a0a0
- **Margin-top:** 16px
- **Max-width:** 500px
- **Animation:** Smooth height expansion

---

### FAQ Content

**Q1: Is PocketFlow really free?**

```md
Yes, completely free. No hidden fees, no premium tiers, no credit card required. We built this to help people take control of their finances, not to charge them for it.
```

**Q2: Do you need access to my bank account?**

```md
No. PocketFlow is manual tracking only. You log your own transactions, which means we never need (or want) access to your bank credentials. Your accounts stay private.
```

**Q3: What data do you collect?**

```md
Only what you explicitly enter: transactions, budgets, bills, and goals. We use Firebase for secure authentication, but we never sell your data, share it with third parties, or show you ads.
```

**Q4: Can I import my existing data?**

```md
Yes! You can upload CSV files from your bank or existing spreadsheets. We'll map the columns and import your transaction history so you can start with context, not from scratch.
```

**Q5: What if I have a question or need help?**

```md
We're a small team, but we're responsive. Reach out via the in-app feedback button or email us at [support@pocketflow.app](ayomidekay7@gmail.com). We typically respond within 24 hours.
```

**Q6: Will there be a mobile app?**

```md
The web app is fully responsive and works great on mobile browsers. A native iOS/Android app is on our roadmap based on user demand. Let us know if you'd use it!
```

**Q7: How is this different from Mint or YNAB?**

```md
PocketFlow is simpler and privacy-first. Unlike Mint, we don't connect to your bank or show ads. Unlike YNAB, we're free and don't require envelope budgeting. We're the calm middle ground for people who want visibility without complexity.
```

**Q8: Can I export my data?**

```md
Absolutely. You can export all your transactions, budgets, and bills to CSV at any time. Your data is yours to keep, delete, or move elsewhere.
```

---

## Section 9: Footer

**Purpose:** Legal, links, branding

**Layout:** Multi-column footer

**Structure:**

```sh
┌─────────────────────────────────────────────────────────────┐
│  [Logo/Tagline]    [Product]    [Support]    [Legal]        │
│                                                               │
│  ────────────────────────────────────────────────────────── │
│                                                               │
│  [Copyright] © 2026 PocketFlow. Built with care.             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Specifications:**

- **Background:** #0a0a0a
- **Border-top:** 1px solid #2d2d2d
- **Padding:** 64px vertical, 32px horizontal
- **Container:** max-width 1280px

**Column 1: Branding**
**Logo:** Wallet icon + "PocketFlow"

- Same as nav
- Margin-bottom: 16px

**Tagline:**

```md
"Simple finance tracking for people who value their privacy."
```

- Typography: 14px/20px
- Color: #6b7280
- Max-width: 240px

**Column 2: Product**
**Title:** "Product"

- Typography: 14px, weight 600, uppercase, letter-spacing 0.05em
- Color: #a0a0a0
- Margin-bottom: 16px

**Links:**

- Dashboard
- Features
- How it Works
- Pricing (shows "Free")

**Link styling:**

- Typography: 14px/28px
- Color: #6b7280
- Hover: color emerald, underline

**Column 3: Support**
**Title:** "Support"

- Same styling as Column 2 title

**Links:**

- Help Center
- Contact Us
- Feature Requests
- Report a Bug

**Column 4: Legal**
**Title:** "Legal"

- Same styling as Column 2 title

**Links:**

- Privacy Policy
- Terms of Service
- Cookie Policy

**Bottom Bar:**

- **Separator:** 1px solid #2d2d2d, margin 48px vertical
- **Text:** "© 2026 PocketFlow. Built with care."
  - Typography: 14px
  - Color: #6b7280
  - Alignment: center

---

## Responsive Breakpoints

```css
/* Desktop */
@media (min-width: 1024px) {
  /* Default layouts above */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  - Hero headline: 42px
  - Section titles: 36px
  - Feature grid: 2 columns
  - How it works: 2 columns (step 3 below)
  - Footer: 2 columns
}

/* Mobile */
@media (max-width: 767px) {
  - Nav: Hamburger menu
  - Hero headline: 36px
  - All sections: Stack vertically
  - Feature grid: 1 column
  - How it works: 1 column
  - FAQ: 1 column
  - Footer: 1 column
  - Padding: 64px vertical (halved)
  - Container padding: 24px horizontal
}
```

---

## Animations & Interactions

### On Page Load

1. **Hero:** Fade up from bottom (0.8s ease-out, 0.2s delay)
2. **Dashboard Screenshot:** Fade up from bottom (1s ease-out, 0.4s delay)
3. **CTA Button (final section):** Subtle pulse (2s infinite)

### On Scroll (Intersection Observer)

- **Section titles:** Fade up when entering viewport (0.6s)
- **Feature cards:** Stagger fade up (each +0.1s delay)
- **How it works steps:** Fade in sequentially

### Hover States

- **Buttons:** Scale 1.02, shadow increase (0.2s ease)
- **Feature cards:** Translate up -4px, border color change (0.3s ease)
- **FAQ questions:** Text color to emerald (0.2s ease)

### Focus States

- All interactive elements: 2px emerald outline, offset 2px

---

## Accessibility

- **Semantic HTML:** header, nav, main, section, footer
- **Headings:** Proper h1, h2, h3 hierarchy
- **Alt text:** All images and icons
- **ARIA labels:** Buttons, links, and interactive elements
- **Keyboard navigation:** All interactive elements focusable
- **Color contrast:** WCAG AA minimum (4.5:1 for text)
- **Focus indicators:** Visible emerald outline

---

## Performance

- **Images:** WebP format with fallback, lazy loading below fold
- **Fonts:** Preload Inter font, subset for used glyphs
- **CSS:** Critical CSS inlined, rest async loaded
- **JS:** Code splitting, lazy load components below fold
- **Target:** Lighthouse score 90+ on all metrics

---

## Copy Principles

✅ **DO:**

- Use short, punchy sentences
- Lead with benefits, not features
- Use "you" language
- Be specific (not "manage money" but "see every upcoming bill")
- Show outcomes (not "budgets" but "never overspend again")

❌ **DON'T:**

- Use jargon ("liquidity," "cash flow optimization")
- Make grand claims ("revolutionize," "transform")
- Mention competitors by name
- Over-explain features (let the app speak)
- Use exclamation marks excessively

---

## Implementation Notes for Jules

### Tech Stack Suggestion

- **Framework:** React (matches existing app)
- **Styling:** Tailwind CSS for rapid implementation
- **Animations:** Framer Motion for scroll animations
- **Icons:** Lucide React (matches existing app)
- **Deployment:** Vercel or Netlify

### File Structure

```sh
/landing
├── components/
│   ├── Navigation.tsx
│   ├── Hero.tsx
│   ├── ProblemRelief.tsx
│   ├── Capabilities.tsx
│   ├── Trust.tsx
│   ├── HowItWorks.tsx
│   ├── FinalCTA.tsx
│   ├── FAQ.tsx
│   └── Footer.tsx
├── styles/
│   └── landing.css
└── pages/
    └── index.tsx (landing page)
```

### Critical Path

1. Build navigation bar with routing
2. Hero section with CTA linking to `/auth`
3. Core capabilities section (most important)
4. FAQ section (addresses objections)
5. Final CTA
6. Footer with legal pages
7. Add animations last (progressive enhancement)

### Authentication Check

```typescript
// Redirect logic
if (isAuthenticated) {
  router.push('/dashboard');
} else {
  // Show landing page
}
```

### CTA Destinations

- **"Get Started"** → `/auth?mode=signup`
- **"Sign In"** → `/auth?mode=login`
- **"Create Free Account"** → `/auth?mode=signup`

---

## Assets Needed

### Screenshots

1. [Dashboard Hero](./assets/dashboard-hero.JPG)
2. [Budget View](./assets/budgets-view.JPG)
3. Transaction form (optional, create a screenshot if you can)

### Icons (Lucide React)

- Logo: Wallet
- Feature 1: CalendarCheck
- Feature 2: Target
- Feature 3: BarChart3
- Feature 4: Trophy
- Trust 1: ShieldCheck
- Trust 2: Lock
- Trust 3: Building2
- FAQ: ChevronDown

### Graphics (Optional)

- Abstract patterns for section backgrounds
- Subtle noise texture overlay

---

## Success Metrics

### What to Track

- CTA click rate (Get Started button)
- Scroll depth (how far users get)
- FAQ expansion rate
- Time to signup completion

### What Success Looks Like

- 15%+ of visitors click primary CTA
- 60%+ scroll past capabilities section
- Average session > 45 seconds
- Bounce rate < 60%

---

## Final Checklist

Before launching:

- [ ] All CTAs link to `/auth`
- [ ] Mobile responsive on all devices
- [ ] All links in footer functional
- [ ] Images optimized (<500KB total page weight)
- [ ] Privacy policy and ToS pages created
- [ ] Contact email working
- [ ] Analytics installed (optional: Plausible)
- [ ] SEO meta tags added
- [ ] Open Graph images set
- [ ] Lighthouse score > 90

---

## **End of Specification**

This document is ready for implementation. Jules should be able to build a production-ready landing page from this spec.
