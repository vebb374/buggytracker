# BugTracker Pro - The Unreliable Edition
## Style Guide

### Project Identity
**Name**: BugTracker Pro - The Unreliable Edition  
**Tagline**: "Where bugs go to live forever"  
**Tone**: Quirky, self-aware, slightly sarcastic  
**Visual Style**: Clean, minimal, professional with subtle chaos hints

---

## 🎨 Color Palette

### Primary Colors (Corporate Base)
- **Primary Blue**: `#1890ff` - Main brand color, primary buttons, links
- **Primary Dark**: `#0050b3` - Hover states, darker accents
- **Primary Light**: `#69c0ff` - Light backgrounds, subtle highlights

### Secondary Colors (Professional Grays)
- **Text Primary**: `#262626` - Main text, headings
- **Text Secondary**: `#595959` - Secondary text, labels
- **Text Disabled**: `#bfbfbf` - Disabled states, placeholders
- **Background**: `#ffffff` - Main background
- **Background Light**: `#fafafa` - Card backgrounds, panels
- **Border**: `#d9d9d9` - Borders, dividers

### Status Colors (Warning System)
- **Success**: `#52c41a` - Completed tasks, success messages
- **Warning**: `#faad14` - Warning states, pending actions
- **Error**: `#ff4d4f` - Errors, critical issues
- **Info**: `#1890ff` - Information, neutral notifications

### "Chaos Hints" (Subtle Unreliability)
- **Chaos Orange**: `#ff7a45` - Subtle warning elements
- **Chaos Red**: `#ff4d4f` - Critical automation challenges
- **Chaos Yellow**: `#ffc53d` - Unpredictable elements

---

## 📝 Typography

### Font Families
- **Primary**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`
- **Monospace**: `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`

### Font Sizes (Tailwind Scale)
- **Headings H1**: `text-3xl` (30px) - Page titles
- **Headings H2**: `text-2xl` (24px) - Section titles  
- **Headings H3**: `text-xl` (20px) - Subsection titles
- **Body Large**: `text-lg` (18px) - Important content
- **Body**: `text-base` (16px) - Regular content
- **Body Small**: `text-sm` (14px) - Secondary content
- **Caption**: `text-xs` (12px) - Captions, metadata

### Font Weights
- **Bold**: `font-bold` (700) - Headings, emphasis
- **Semibold**: `font-semibold` (600) - Subheadings, important text
- **Medium**: `font-medium` (500) - Labels, buttons
- **Regular**: `font-normal` (400) - Body text

---

## 📏 Spacing System (Tailwind Based)

### Base Unit: 4px (1 unit = 0.25rem)
- **xs**: `p-1` (4px) - Tight spacing
- **sm**: `p-2` (8px) - Small spacing  
- **md**: `p-4` (16px) - Standard spacing
- **lg**: `p-6` (24px) - Large spacing
- **xl**: `p-8` (32px) - Extra large spacing
- **2xl**: `p-12` (48px) - Section spacing

### Component Spacing
- **Card Padding**: `p-6` (24px)
- **Button Padding**: `px-4 py-2` (16px/8px)
- **Input Padding**: `px-3 py-2` (12px/8px)
- **Column Gaps**: `gap-6` (24px)
- **Grid Gaps**: `gap-4` (16px)

---

## 🧩 Component Styles

### Cards (Ticket Cards, Panels)
```css
.card-base {
  @apply bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow;
}

.card-ticket {
  @apply card-base p-4 cursor-grab active:cursor-grabbing;
}

.card-ticket:hover {
  @apply border-blue-300 shadow-md;
}
```

### Buttons
```css
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-200 transition-colors;
}

.btn-danger {
  @apply bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition-colors;
}
```

### Form Elements
```css
.input-base {
  @apply border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.select-base {
  @apply input-base bg-white cursor-pointer;
}
```

### Priority Colors
- **High Priority**: `bg-red-100 text-red-800 border-red-200`
- **Medium Priority**: `bg-yellow-100 text-yellow-800 border-yellow-200`  
- **Low Priority**: `bg-green-100 text-green-800 border-green-200`

### Status Indicators
- **TODO**: `bg-blue-100 text-blue-800`
- **WORKING**: `bg-orange-100 text-orange-800`
- **DONE**: `bg-green-100 text-green-800`

---

## 🎭 "Chaos Hints" Design Elements

### Subtle Unreliability Elements
- **Loading Spinners**: Occasionally wobble or pause
- **Button States**: Brief enable/disable flickers
- **Alert Positioning**: Random slight offsets
- **Border Radius**: Occasional 1px variations

### Professional Baseline
- All elements maintain professional appearance
- Chaos hints are barely perceptible to users
- Automation scripts encounter the complexity, not humans

---

## 📱 Responsive Design

### Breakpoints (Tailwind)
- **sm**: 640px+ (Small tablets)
- **md**: 768px+ (Tablets) 
- **lg**: 1024px+ (Laptops)
- **xl**: 1280px+ (Desktops)

### Column Layout
- **Mobile**: Single column stack
- **Tablet**: Two columns (TODO+WORKING, DONE)
- **Desktop**: Three full columns

---

## 🎯 Animation & Transitions

### Standard Transitions
- **Default**: `transition-all duration-200 ease-in-out`
- **Hover Effects**: `transition-colors duration-150`
- **Transform**: `transition-transform duration-200`

### Drag & Drop
- **Drag Start**: Scale down 95%, rotate 2-5 degrees
- **Drop Zone**: Highlight with blue border
- **Drop Success**: Brief scale bounce

### Chaos Elements
- **Loading**: Variable durations (1-4s)
- **Alerts**: Fade out in exactly 1.5s
- **DevTools Detection**: Immediate close

---

## ✅ Style Guide Implementation

This style guide provides the foundation for consistent design across all BugTracker Pro components while incorporating the intentional automation challenges through subtle "chaos hints" that maintain professional appearance.

