## Lighthouse Performance Requirements

Target Lighthouse Scores:

- Performance: 95+
- Accessibility: 95+
- Best Practices: 100
- SEO: 100

Target Devices:

- Mobile First
- Desktop Optimized

### Core Web Vitals

- LCP < 2.5s
- INP < 200ms
- CLS < 0.1

### Next.js Rules

- Use Server Components by default
- Use Client Components only when necessary
- Avoid unnecessary useEffect
- Avoid unnecessary state management
- Prefer async Server Components

### Images

- Use next/image for all images
- Lazy load non-critical images
- Use AVIF or WebP formats
- Define width and height explicitly
- Prevent layout shifts

### Fonts

- Use next/font
- Self-host fonts
- Avoid loading multiple font families
- Use font-display swap

### Animations

- Framer Motion animations must be lightweight
- Use transform and opacity only
- Avoid animating width, height, top, left
- Use will-change sparingly
- Disable complex animations on mobile when needed

### GSAP Usage

- Use GSAP only for hero sections or advanced scroll effects
- Avoid GSAP on every section
- Prevent layout thrashing
- Clean up all animations properly

### JavaScript Budget

- Minimize client-side JavaScript
- Lazy load heavy components
- Dynamic import large sections
- Avoid unnecessary third-party packages

### SEO

- Metadata API for every page
- Open Graph support
- Twitter Cards support
- Structured Data JSON-LD
- Semantic HTML

### Accessibility

- Keyboard navigation support
- Proper heading hierarchy
- ARIA labels where required
- Sufficient color contrast
- Reduced motion support

### Build Validation

Before generating code:

1. Check Lighthouse impact.
2. Avoid CLS issues.
3. Avoid hydration mismatches.
4. Ensure responsive design.
5. Optimize bundle size.
6. Ensure TypeScript strict compatibility.

If a feature significantly hurts Lighthouse performance, suggest an alternative implementation.
