export { Button } from './components/button'
export { Checkbox } from './components/checkbox'
export { RadioGroup, RadioGroupItem } from './components/radio-group'
export { Select, SelectTrigger, SelectContent, SelectItem, SelectSeparator } from './components/dropdown-select'
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/tabs'
export { Tooltip, TooltipTrigger, TooltipContent } from './components/tooltip'
export { ProgressBar } from './components/progress-bar'
export { Spinner } from './components/spinner'
export { Card, CardHeader, CardTitle, CardContent } from './components/card'
export { Input } from './components/input'
export { Modal } from './components/modal'
export { Toggle } from './components/toggle'
export { Avatar, AvatarGroup } from './components/avatar'
export { Badge, BadgeGroup } from './components/badge'
export { Alert, AlertGroup } from './components/alert'
export { cn } from './lib/utils'
export { useAnimation, type AnimationConfig, type AnimationType } from './hooks/useAnimation'

// Ripple effect CSS injection
if (typeof document !== 'undefined') {
  const rippleCss = `
    .ripple {
      position: absolute;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
    }

    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  const style = document.createElement('style');
  style.textContent = rippleCss;
  document.head.appendChild(style);
}
