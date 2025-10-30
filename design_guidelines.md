# Helloneil Language Learning App - Design Guidelines

## Design Approach
**Reference-Based: Duolingo-Inspired**
Primary inspiration from Duolingo's gamified learning platform, emphasizing playful engagement, clear progression, and friendly interactions. Adaptation focuses on maintaining the core motivational design patterns while creating a unique identity.

## Core Design Principles
1. **Playful Gamification**: Every interaction reinforces progress and achievement
2. **Clarity Over Complexity**: Learning interfaces prioritize comprehension
3. **Friendly Approachability**: Welcoming design that reduces learning anxiety
4. **Visual Feedback**: Immediate, clear responses to user actions

## Typography System
- **Primary Headings (H1)**: Bold, rounded sans-serif, 2.5rem-3rem desktop, 2rem mobile
- **Section Headings (H2)**: Semi-bold, 1.75rem-2rem desktop, 1.5rem mobile  
- **Lesson Titles**: Medium weight, 1.25rem-1.5rem
- **Body Text**: Regular weight, 1rem, optimized for readability
- **Buttons/CTAs**: Bold, uppercase tracking for primary actions, sentence case for secondary
- **Font Stack**: Use Nunito or similar friendly rounded sans-serif via Google Fonts

## Layout & Spacing System
**Tailwind Units**: Consistently use 4, 6, 8, 12, 16, 24 for spacing (p-4, m-6, gap-8, etc.)
- Component padding: p-6 to p-8
- Section spacing: py-12 to py-16 mobile, py-16 to py-24 desktop
- Card gaps: gap-4 to gap-6
- Container max-width: max-w-6xl for main content, max-w-4xl for lesson interface

## Component Library

### Language Selection Screen
**Layout**: Full-screen centered grid experience
- Hero section (60vh): Centered logo, tagline "Start Learning Today", mascot character illustration
- Language grid: 2 columns mobile (grid-cols-2), 3 columns desktop (md:grid-cols-3)
- Language cards: 
  - Flag icon/illustration at top
  - Language name in heading font
  - Learner count ("2M+ learners") in smaller text
  - Rounded corners (rounded-2xl), elevated shadow
  - Hover lift effect (translate-y slight movement)

### Dashboard/Home Screen
**Layout**: Left sidebar navigation (hidden mobile, drawer menu), main content area

**Sidebar (Desktop)**:
- Width: w-64
- Sticky positioning
- User profile section at top: avatar (rounded-full, w-16 h-16), username, current streak
- Navigation items: Practice, Leaderboards, Shop, Profile (icon + label, p-3, rounded-lg for active state)

**Main Content Area**:
- Language header: Selected language with flag, switch language button, progress overview
- Stats row: Current level badge (large, centered), XP count, streak flame icon with count (flex layout, gap-8)
- Lesson path: Vertical scrolling progression tree
  - Nodes represent lessons, connected by dotted lines
  - Node states: locked (grayscale), available (vibrant), completed (checkmark)
  - Node size: w-16 h-16 circles, hover scale-110
  - Level markers every 5 lessons with larger decorative badges
  - Zigzag pattern: alternating left/right positioning

### Lesson Interface
**Layout**: Centered single-column (max-w-2xl), full-height viewport

**Header Bar**:
- Progress indicator: Linear bar showing lesson completion (h-2 rounded-full)
- Exit button (top-left), Hearts/Lives counter (top-right with heart icons)

**Question Container**:
- Centered vertically
- Question text: Large, 1.5rem-2rem, mb-8
- Instruction text: Above question in lighter weight

**Question Types**:

**Multiple Choice**:
- Grid: 2 columns (grid-cols-1 md:grid-cols-2)
- Choice buttons: Large touch targets (min-h-16), full-width, rounded-xl, p-4
- Text + small icon/image if visual aid
- Selected state: border highlight with thick border (border-4)

**Fill-in-the-Blank**:
- Sentence with underlined gaps
- Input fields: inline, underlined style (border-b-2), auto-width based on content
- Virtual keyboard at bottom for special characters

**Translation**:
- Source text: Box with subtle background, p-6, rounded-xl, mb-6
- Input area: Large textarea, rounded-xl, border, min-h-32
- Character audio button: Speaker icon

**Answer Feedback Panel** (Bottom sheet):
- Slides up from bottom on answer submission
- Correct: Positive background treatment, checkmark icon, "Excellent!" heading
- Incorrect: Shows correct answer, explanation text, "Try Again" or "Continue" button
- Height: ~30vh, rounded-t-3xl

**Action Button** (Bottom):
- Full-width mobile, max-w-md desktop
- Large (h-14), bold text, rounded-full
- Fixed to bottom with p-6 container padding
- States: "CHECK" (default), "CONTINUE" (after answer), "SKIP" (if available)

### Progress Celebration
**Level Up Modal**:
- Centered overlay (backdrop blur)
- Animated mascot character (w-48 h-48)
- Level badge with glowing effect
- XP earned display
- "Continue" button

**Streak Milestone**:
- Toast notification top-right
- Flame icon, streak count, encouraging message
- Auto-dismiss after 4 seconds

## Interactive Elements

### Buttons
**Primary**: Large rounded-full, bold text, prominent shadow, min-h-12
**Secondary**: Rounded-lg, border style, medium weight text
**Icon Buttons**: Circular (rounded-full), w-12 h-12, centered icon

### Cards
**Standard**: rounded-2xl, shadow-md, p-6, hover shadow-lg transition
**Lesson Cards**: rounded-xl, border, p-4, icon + text layout

### Inputs
**Text Fields**: rounded-lg, border-2, p-3, focus ring offset
**Special Character Keys**: Small buttons (h-10 w-10), rounded-lg, grid layout

## Mascot Integration
- Character illustration appears on: language selection hero, lesson completion, level up, empty states
- Style: Friendly, owl-like character (not Duo, but inspired), simple vector illustration
- Positions: Floating bottom-right on dashboard, centered in modals, peeking from lesson progress bar

## Animation Guidelines
**Use Sparingly - Strategic Moments Only**:
- Level up celebration: Scale + fade entrance
- Correct answer: Checkmark bounce-in
- Card hovers: Subtle lift (translate-y-1)
- Progress bar: Smooth width transition
- Modal entrances: Scale from 95% to 100%
- NO scroll animations, NO parallax, NO continuous animations

## Images
**Hero Section**: 
- Full-width illustration or mascot character scene
- Placement: Language selection screen hero (60vh height)
- Style: Friendly, educational, welcoming atmosphere
- Treatment: Centered, with subtle graphic elements

**Language Cards**: Flag icons/illustrations (w-12 h-12) centered above language names

**Lesson Visuals**: Small illustrative icons for vocabulary (w-16 h-16), image-based multiple choice when relevant

## Responsive Behavior
**Mobile** (< 768px):
- Single column layouts
- Hamburger menu for navigation
- Full-width buttons
- Reduced spacing (py-12 vs py-16)
- Stacked stats display

**Desktop** (≥ 768px):
- Sidebar navigation persistent
- Multi-column grids for language selection
- Larger touch targets become hover-optimized
- Increased whitespace and breathing room

**Key Breakpoints**: Use Tailwind's md: (768px) and lg: (1024px) primarily

## Accessibility
- All interactive elements: min-h-44px (11rem in Tailwind scale) touch targets
- Form inputs: Clear labels, visible focus states (ring-2 ring-offset-2)
- Lesson text: Minimum 16px, high contrast
- Skip navigation link for keyboard users
- ARIA labels on icon-only buttons
- Progress announcements for screen readers