# Changelog

All notable changes to the MotionKit project will be documented in this file.

## [Unreleased] - 2025-01-01

### Added
- Avatar component with size variants (sm, md, lg, xl) and shape options (circle, square)
- AvatarGroup component for displaying multiple avatars with overflow indicator
- Badge component with variants (default, primary, secondary, destructive, outline, ghost) and size options
- BadgeGroup component for grouping badges with separators
- Alert component with variants (default, info, success, warning, destructive) and closable option
- AlertGroup component for grouping alerts

### Changed
- Updated Button component to include ripple effect and loading states
- Enhanced Card component with lift and glow hover effects
- Improved documentation in README.md with detailed component information
- Created comprehensive documentation page (index.html) with component usage examples
- Built attractive landing page (demo.html) showcasing all components
- Refactored component code to handle TypeScript conflicts with Framer Motion
- Converted project to use consistent light mode theme to prevent text visibility issues
- Enhanced animation strategies to align with README.md descriptions
- Improved accessibility and responsive design across all components

### Fixed
- Resolved TypeScript error conflicts between React and Framer Motion props
- Fixed dark mode text visibility issues in all HTML files
- Corrected import paths and module resolution issues
- Fixed component export structure in index.ts
- Resolved build process errors and warnings
- Updated CSS styling to prevent color contrast problems

### Removed
- Dark mode theme from all HTML documentation and landing pages
- Unused import statements causing type errors
- Deprecated animation implementations that caused conflicts

## [0.0.1-alpha.1] - 2024-11-20

### Added
- Initial component library with Button, Card (with sub-components), Input, Modal, and Toggle
- Framer Motion integration for smooth animations
- TypeScript support with proper typing
- Vite build configuration for library
- Tailwind CSS for styling
- Base component creation utilities
- Animation hook with multiple animation types
- Build and development scripts