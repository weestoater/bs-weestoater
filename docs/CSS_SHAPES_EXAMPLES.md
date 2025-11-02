
# CSS Shapes - Before & After Examples

## Example 1: Avatar Enhancement

### Before
```tsx
<img
  src={burtIcon}
  alt="avatar of weestoater"
  className="right avatar"
/>
```

**Result**: Square or basic rounded image floated right

### After (Option 1: Enhanced Avatar)
```tsx
<img
  src={burtIcon}
  alt="avatar of weestoater"
  className="avatar-enhanced right shape-md"
/>
```

**Result**: Circular avatar with white border and shadow, text wraps smoothly around it

### After (Option 2: Simple Circle)
```tsx
<img
  src={burtIcon}
  alt="avatar of weestoater"
  className="shape-circle right shape-md"
/>
```

**Result**: Perfect circle shape with natural text wrapping

---

## Example 2: Football Badge

### Before
```tsx
<img
  src={motherwell}
  alt="Motherwell F.C. Logo"
  className="img-responsive"
/>
```

**Result**: Standard image display

### After (Option 1: Football Badge Style)
```tsx
<img
  src={motherwell}
  alt="Motherwell F.C. Logo"
  className="shape-football-badge right shape-lg"
/>
```

**Result**: Badge with white background, padding, rounded corners, and shadow - text wraps around it

### After (Option 2: Shield Shape)
```tsx
<img
  src={motherwell}
  alt="Motherwell F.C. Logo"
  className="shape-shield right shape-md"
/>
```

**Result**: Traditional football badge shield shape with text wrapping

---

## Example 3: Content Images

### Before
```tsx
<img src={contentImage} alt="Description" className="fluid" />
```

**Result**: Full-width responsive image, text appears below

### After (Rounded Rectangle)
```tsx
<img 
  src={contentImage} 
  alt="Description" 
  className="shape-rounded-rect-soft right shape-xl" 
/>
```

**Result**: Image floated right with soft rounded corners, text wraps around left side

---

## Example 4: Blog Post Hero Image

### Before
```tsx
<img src={heroImage} alt="Article topic" className="right w10" />
```

**Result**: Image floated right, rectangular with sharp corners

### After (Ellipse Shape)
```tsx
<img 
  src={heroImage} 
  alt="Article topic" 
  className="shape-ellipse-horizontal left shape-xl shape-spacious" 
/>
```

**Result**: Elegant elliptical shape with extra breathing room, text flows around the curved edges

---

## Example 5: Small Inline Icons

### Before
```tsx
<img src={icon} alt="Icon" />
```

**Result**: Inline icon, breaks text flow

### After
```tsx
<img 
  src={icon} 
  alt="Icon" 
  className="shape-circle right shape-sm shape-tight" 
/>
```

**Result**: Small circular icon floated right with tight text wrapping

---

## Visual Comparison

### Traditional Square Image
```
┌──────────┐
│          │
│  IMAGE   │
│          │
└──────────┘
Text starts here, below the image.
More text continues in a normal flow.
```

### With Shape Functions (Circle)
```
      ╭─────╮
    ╱         ╲
   │   IMAGE   │  Text wraps
   │           │  around the
    ╲         ╱   circular
      ╰─────╯     shape here
Text continues to wrap naturally
around the curved edges.
```

### With Shape Functions (Shield)
```
      ╱╲
     ╱  ╲
    │IMAGE│  Text flows
    │     │  smoothly
    │     │  around the
     ╲   ╱   shield
      ╲ ╱    shape
Text continues below...
```

---

## Real-World Usage in Your Project

### Update `WhoIsWeestoater.tsx`

**Current Code:**
```tsx
<img
  src={burtIcon}
  alt="avatar of weestoater"
  className="right avatar"
/>
```

**Recommended Update:**
```tsx
<img
  src={burtIcon}
  alt="avatar of weestoater"
  className="avatar-enhanced right shape-md"
/>
```

**Why**: Adds professional styling with border and shadow while maintaining the circular shape

---

### Update `FootballIntro.tsx`

**Current Code:**
```tsx
<img
  src={motherwell}
  alt="Motherwell F.C. Logo"
  className="img-responsive"
/>
```

**Recommended Update:**
```tsx
<img
  src={motherwell}
  alt="Motherwell F.C. Logo"
  className="shape-football-badge right shape-lg"
/>
```

**Why**: Displays the badge with proper football club badge styling, text wraps naturally

---

## Testing Checklist

After applying shape classes, verify:

- [ ] Text wraps around the image smoothly
- [ ] Adequate spacing between text and image
- [ ] Image shape is clearly defined
- [ ] Works on mobile devices (< 768px)
- [ ] Accessible with screen readers
- [ ] No layout breaking on different screen sizes

---

## Common Combinations

### Professional Look
```tsx
className="avatar-enhanced right shape-lg"
```

### Sporty Look
```tsx
className="shape-shield left shape-md"
```

### Modern Look
```tsx
className="shape-rounded-rect-soft right shape-xl"
```

### Compact Look
```tsx
className="shape-circle right shape-sm shape-tight"
```

### Spacious Look
```tsx
className="shape-ellipse-horizontal left shape-lg shape-spacious"
```

---

## Tips for Best Results

1. **Sufficient Text**: Ensure there's enough text content to wrap around the image
2. **Image Quality**: Use high-resolution images for larger sizes
3. **Contrast**: Ensure good contrast between image and background
4. **Alt Text**: Always include descriptive alt text for accessibility
5. **Test Mobile**: Check appearance on smaller screens

---

**Ready to implement?** Start with one image and see the difference!

