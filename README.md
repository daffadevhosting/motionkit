# MotionKit Documentation

MotionKit is a modern component library for React applications, providing a rich set of animated UI components. Built with **TypeScript** for type safety, **Framer Motion** for declarative animations, and **Anime.js** via a custom hook for general-purpose entry animations, it offers a blend of performance, flexibility, and stunning visuals.

## Installation

```bash
npm install motionkit
```

## Usage

```jsx
import { Button, Card, Input, Checkbox, Select, Tabs, Toggle } from 'motionkit';
import React, { useState } from 'react';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedOption, setSelectedOption] = useState('option1');
  const [activeTab, setActiveTab] = useState('tab1');
  const [isToggled, setIsToggled] = useState(false);

  return (
    <div className="p-8 space-y-8">
      {/* Button Example */}
      <Button variant="default" animateOn={{ type: 'slideUp' }}>Click me</Button>
      <Button variant="destructive" loading>Loading...</Button>
      
      {/* Card Example */}
      <Card hover="lift" animateOn={{ type: 'scale' }}>
        <Card.Header>
          <Card.Title>Card Title</Card.Title>
        </Card.Header>
        <Card.Content>
          <p>Card content</p>
          <Input placeholder="Enter text..." />
        </Card.Content>
      </Card>

      {/* Input Example */}
      <Input placeholder="Enter text..." variant="default" size="md" animateOn={{ type: 'fadeIn' }} />
      <Input placeholder="Error state" variant="error" />
      
      {/* Checkbox Example */}
      <Checkbox checked={isChecked} onCheckedChange={setIsChecked} label="Remember me" />

      {/* RadioGroup Example */}
      <RadioGroup value={selectedOption} onValueChange={setSelectedOption} orientation="horizontal">
        <RadioGroupItem value="option1">Option 1</RadioGroupItem>
        <RadioGroupItem value="option2">Option 2</RadioGroupItem>
      </RadioGroup>

      {/* Select Example */}
      <Select value={selectedOption} onValueChange={setSelectedOption} placeholder="Select an option">
        <SelectTrigger />
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectSeparator />
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>

      {/* Tabs Example */}
      <Tabs defaultValue="tab1" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content for Tab 1</TabsContent>
        <TabsContent value="tab2">Content for Tab 2</TabsContent>
      </Tabs>

      {/* Tooltip Example */}
      <Tooltip>
        <TooltipTrigger>
          <Button variant="outline">Hover for info</Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          This is a tooltip!
        </TooltipContent>
      </Tooltip>

      {/* ProgressBar Example */}
      <ProgressBar value={75} />

      {/* Spinner Example */}
      <Spinner size="lg" color="#0ea5e9" />

      {/* Alert Example */}
      <Alert variant="info" title="Heads up!" description="This is an informational alert." closable />

      {/* Modal Example (trigger button) */}
      <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Card.Header><Card.Title>Modal Title</Card.Title></Card.Header>
        <Card.Content><p>This is the modal content.</p></Card.Content>
      </Modal>

      {/* Toggle Example */}
      <Toggle enabled={isToggled} onChange={setIsToggled} label="Enable Feature" />
    </div>
  );
}
```

## Components

### Core Principles
- **Animations:** All components come with built-in animations using Framer Motion for interactive effects (hover, tap, enter/exit) and Anime.js (via `useAnimation` hook) for general entry animations.
- **Styling:** Powered by Tailwind CSS for utility-first styling and easy customization.
- **Accessibility:** Designed with ARIA attributes and keyboard navigation in mind.

### Button
- **Description:** A highly customizable button with variants, sizes, ripple effect, and loading states.
- **Variants:** `default`, `destructive`, `outline`, `ghost`
- **Sizes:** `sm`, `md`, `lg`
- **Features:** Ripple effect, loading state, Framer Motion animations (`whileHover`, `whileTap`), and Anime.js entry animations (`animateOn` prop).

### Card
- **Description:** A flexible container component for grouping content, with header, title, and content sub-components.
- **Variants:** `default`, `elevated`, `glass`
- **Hover Effects:** `none`, `lift`, `glow`
- **Features:** Animated entrance, staggered children animations, and Anime.js entry animations (`animateOn` prop).

### Input
- **Description:** A styled input field component.
- **Variants:** `default`, `error`, `success` (for visual feedback)
- **Sizes:** `sm`, `md`, `lg`
- **Features:** Anime.js entry animations (`animateOn` prop).

### Modal
- **Description:** An animated, accessible modal dialog with overlay.
- **Features:** Animated entry/exit, escape key close, basic focus management, and scroll locking on body.

### Toggle
- **Description:** An animated toggle switch component.
- **Sizes:** `sm`, `md`, `lg`
- **Features:** Customizable active/inactive colors, label support, and accessibility (`role="switch"`, `aria-checked`).

### Avatar
- **Description:** A component to display user profile pictures or fallback initials.
- **Sizes:** `sm`, `md`, `lg`, `xl`
- **Shapes:** `circle`, `square`
- **Features:** Framer Motion `whileHover` animation and Anime.js entry animations (`animateOn` prop).

### Badge
- **Description:** A small, informative component for displaying notifications, labels, or status.
- **Variants:** `default`, `primary`, `secondary`, `destructive`, `outline`, `ghost`
- **Sizes:** `sm`, `md`, `lg`
- **Rounded:** `sm`, `md`, `lg`, `full`
- **Features:** Framer Motion `whileHover`, `whileTap` animations, and Anime.js entry animations (`animateOn` prop).

### Alert
- **Description:** A component to display important, contextual messages to the user.
- **Variants:** `default`, `info`, `success`, `warning`, `destructive`
- **Features:** Animated entry/exit, closable with `onClose` callback, default icons based on variant, and accessibility (`role="alert"`, `aria-live`).

---

### Checkbox
- **Description:** A customizable checkbox input with animated states.
- **Features:** Controlled `checked` state, `onCheckedChange` callback, disabled state, and Anime.js entry animations (`animateOn` prop).
- **Accessibility:** Proper `role="checkbox"` and `aria-checked` attributes.

### RadioGroup
- **Description:** A group of radio buttons where only one option can be selected at a time.
- **Sub-components:** `RadioGroupItem`
- **Features:** Controlled `value` and `onValueChange`, disabled states, horizontal/vertical orientation, and Anime.js entry animations (`animateOn` prop) on the group.
- **Accessibility:** Proper `role="radiogroup"` and `role="radio"` attributes.

### Select
- **Description:** A customizable dropdown/select component for choosing an option from a list.
- **Sub-components:** `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectSeparator`
- **Features:** Controlled `value` and `onValueChange`, disabled state, custom placeholder, animated dropdown content, and Anime.js entry animations (`animateOn` prop) on the trigger.
- **Accessibility:** Proper `role="combobox"`, `aria-haspopup`, `aria-expanded` attributes.

### Tabs
- **Description:** A set of layered content areas, with only one visible at a time.
- **Sub-components:** `TabsList`, `TabsTrigger`, `TabsContent`
- **Features:** Controlled `value` and `onValueChange`, animated tab content transitions, and an animated indicator for the active tab.
- **Accessibility:** Proper `role="tablist"`, `role="tab"`, `role="tabpanel"` attributes.

### Tooltip
- **Description:** A small, contextual popup that displays information about an element on hover or focus.
- **Sub-components:** `TooltipTrigger`, `TooltipContent`
- **Features:** Customizable side, alignment, and offset; animated content entry/exit; and configurable delay for showing/hiding.
- **Accessibility:** Proper `aria-describedby` and `role="tooltip"` attributes.

### ProgressBar
- **Description:** A visual indicator of progress toward the completion of a task.
- **Features:** Animated progress indication and Anime.js entry animations (`animateOn` prop).
- **Accessibility:** Proper `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` attributes.

### Spinner
- **Description:** A visual indicator for loading states.
- **Features:** Customizable size and color, continuous rotation animation.
- **Accessibility:** Proper `role="status"` and `aria-label`.

## Features

- Built with TypeScript for type safety
- Framer Motion for smooth animations and complex orchestrations
- Anime.js (via `useAnimation` hook) for general component entry animations
- Tailwind CSS for styling
- Responsive design
- Accessible components

## Development

To run the development server:

```bash
npm run dev
```

To build the library:

```bash
npm run build
```

## License

MIT
