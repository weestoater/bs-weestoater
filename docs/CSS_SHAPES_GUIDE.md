# CSS Shape Functions Guide

## Overview

This guide covers the CSS shape functions implemented in `src/scss/utils/_shapes.scss`. These classes allow you to create rounded spaces around non-square icons and images, making text flow naturally around them.

## Core Concepts

CSS Shape functions use three main properties:
- **`shape-outside`**: Defines the shape that text wraps around
- **`clip-path`**: Visually clips the image to match the shape
- **`shape-margin`**: Adds spacing between the shape and surrounding content

## Available Shape Classes

### 1. Circle Shapes

#### `.shape-circle`
Perfect for avatars, profile pictures, and circular logos.

```html
<!-- Right-aligned circular image -->
<img src="avatar.png" alt="Profile" class="shape-circle right shape-md" />
<p>Your text content flows naturally around the circular image...</p>

<!-- Left-aligned circular image -->
<img src="logo.png" alt="Logo" class="shape-circle left shape-lg" />
<p>Content wraps smoothly around the left side...</p>
```

**Best for**: Avatars, profile pictures, circular logos

---

### 2. Ellipse Shapes

#### `.shape-ellipse-vertical`
For portrait-oriented images (taller than wide).

```html
<img src="portrait.jpg" alt="Portrait" class="shape-ellipse-vertical right shape-md" />
<p>Text flows around the vertical ellipse shape...</p>
```

#### `.shape-ellipse-horizontal`
For landscape-oriented images (wider than tall).

```html
<img src="landscape.jpg" alt="Scene" class="shape-ellipse-horizontal left shape-lg" />
<p>Content wraps around the horizontal ellipse...</p>
```

**Best for**: Portrait photos, landscape imagery, artistic layouts

---

### 3. Rounded Rectangle Shapes

#### `.shape-rounded-rect`
Moderate rounded corners (20px radius).

```html
<img src="screenshot.png" alt="Screenshot" class="shape-rounded-rect right shape-xl" />
<p>Professional look with subtle rounded corners...</p>
```

#### `.shape-rounded-rect-soft`
Extra rounded corners (40px radius) for a softer appearance.

```html
<img src="product.png" alt="Product" class="shape-rounded-rect-soft left shape-lg" />
<p>Softer, more approachable design...</p>
```

**Best for**: Screenshots, product images, UI mockups

---

### 4. Polygon Shapes

#### `.shape-octagon`
Eight-sided shape for distinctive layouts.

```html
<img src="featured.jpg" alt="Featured" class="shape-octagon right shape-md" />
<p>Creates a unique, geometric look...</p>
```

#### `.shape-hexagon`
Six-sided shape, great for badges and logos.

```html
<img src="badge.png" alt="Badge" class="shape-hexagon left shape-sm" />
<p>Perfect for achievement badges and icons...</p>
```

#### `.shape-shield` ⚽
Shield shape - **perfect for football club badges!**

```html
<img src="motherwell.png" alt="Motherwell FC" class="shape-shield right shape-md" />
<p>Traditional football badge shape for club crests...</p>
```

**Best for**: Badges, emblems, creative designs, football club logos

---

### 5. Special Shapes

#### `.shape-football-badge`
Enhanced styling specifically for football badges with background and shadow.

```html
<img src="dundee-united.png" alt="Dundee United" class="shape-football-badge right shape-lg" />
<p>Premium football badge presentation with white background and shadow...</p>
```

**Features**:
- White background padding
- Subtle shadow effect
- Rounded corners
- `object-fit: contain` to preserve badge proportions

**Best for**: Football club badges, sports logos, official emblems

---

#### `.avatar-enhanced`
Circular avatar with border and shadow for profile pictures.

```html
<img src="profile.jpg" alt="Ian Burrett" class="avatar-enhanced right shape-md" />
<p>Professional profile picture with white border and shadow...</p>
```

**Features**:
- 3px white border
- Soft shadow
- Circular shape
- Perfect for the existing avatar usage in WhoIsWeestoater.tsx

**Best for**: Profile pictures, team member photos, author avatars

---

### 6. Image URL Based Shapes

#### `.shape-from-image`
Text wraps around the **actual visible pixels** of transparent PNG images.

```html
<img src="transparent-logo.png" alt="Logo" class="shape-from-image right" />
<p>Text wraps precisely around the non-transparent parts of the image...</p>
```

**Requirements**:
- Image must be PNG with transparency
- Works best with clear silhouettes
- May have browser performance considerations

**Best for**: Logos with transparent backgrounds, custom shapes, irregular objects

---

## Size Classes

Control the dimensions of your shaped images:

```html
<!-- Small: 100x100px -->
<img src="icon.png" class="shape-circle right shape-sm" />

<!-- Medium: 150x150px -->
<img src="icon.png" class="shape-circle right shape-md" />

<!-- Large: 200x200px -->
<img src="icon.png" class="shape-circle right shape-lg" />

<!-- Extra Large: 250x250px -->
<img src="icon.png" class="shape-circle right shape-xl" />
```

---

## Positioning Classes

### `.right`
Floats the image to the right with appropriate margins.

```html
<img src="image.png" class="shape-circle right shape-md" />
```

### `.left`
Floats the image to the left with appropriate margins.

```html
<img src="image.png" class="shape-circle left shape-md" />
```

---

## Utility Classes

### Spacing Control

#### `.shape-spacious`
Increases shape-margin to 30px for more breathing room.

```html
<img src="image.png" class="shape-circle right shape-md shape-spacious" />
```

#### `.shape-tight`
Reduces shape-margin to 10px for tighter text wrapping.

```html
<img src="image.png" class="shape-circle left shape-sm shape-tight" />
```

### Object Fit Control

#### `.shape-contain`
Ensures entire image fits within bounds (may show background).

```html
<img src="logo.png" class="shape-circle right shape-md shape-contain" />
```

#### `.shape-cover`
Fills entire shape area (may crop image).

```html
<img src="photo.jpg" class="shape-circle left shape-lg shape-cover" />
```

---

## Practical Examples for Your Project

### 1. Update Avatar in WhoIsWeestoater.tsx

**Before:**
```tsx
<img
  src={burtIcon}
  alt="avatar of weestoater"
  className="right avatar"
/>
```

**After (Enhanced):**
```tsx
<img
  src={burtIcon}
  alt="avatar of weestoater"
  className="avatar-enhanced right shape-md"
/>
```

---

### 2. Football Badge in FootballIntro.tsx

**Before:**
```tsx
<img
  src={motherwell}
  alt="Motherwell F.C. Logo"
  className="img-responsive"
/>
```

**After (with shape):**
```tsx
<img
  src={motherwell}
  alt="Motherwell F.C. Logo"
  className="shape-football-badge right shape-lg"
/>
```

Or for a shield style:
```tsx
<img
  src={motherwell}
  alt="Motherwell F.C. Logo"
  className="shape-shield right shape-lg"
/>
```

---

### 3. General Content Images

For images in blog posts or content sections:

```tsx
<img
  src={contentImage}
  alt="Description"
  className="shape-rounded-rect-soft right shape-xl"
/>
<p>Your article content that will wrap around the image...</p>
```

---

## Browser Support

All modern browsers support CSS Shapes:
- ✅ Chrome/Edge 37+
- ✅ Firefox 62+
- ✅ Safari 10.1+
- ⚠️ IE/Old Edge: Falls back gracefully (no text wrapping, but image still displays)

---

## Responsive Behavior

On mobile devices (< 768px):
- Shape margins automatically reduce to 10px
- Maximum width constrained to 120px
- Maintains readability on small screens

---

## Performance Tips

1. **Use `clip-path` and `shape-outside` together** for consistent appearance
2. **Avoid `shape-from-image` on very large images** - can impact performance
3. **Test text wrapping** with various content lengths
4. **Consider accessibility** - ensure images have proper alt text

---

## Common Combinations

### Professional Profile Picture
```html
<img src="profile.jpg" alt="Name" 
     class="avatar-enhanced right shape-md" />
```

### Football Club Badge
```html
<img src="club-badge.png" alt="Club Name" 
     class="shape-football-badge right shape-lg shape-spacious" />
```

### Featured Article Image
```html
<img src="article-hero.jpg" alt="Article topic" 
     class="shape-rounded-rect-soft left shape-xl" />
```

### Small Icon/Logo
```html
<img src="icon.png" alt="Company Logo" 
     class="shape-circle right shape-sm shape-tight" />
```

---

## Troubleshooting

### Text not wrapping around image?
- Ensure the element has `float: left` or `float: right`
- Check that there's enough text content to wrap
- Verify `shape-outside` is supported in your browser

### Image appears square despite shape class?
- Check if `clip-path` is supported
- Ensure image has loaded properly
- Verify class names are spelled correctly

### Shape looks wrong on mobile?
- Check responsive media queries are loading
- Test on actual device, not just browser resize
- Consider simpler shapes for mobile views

---

## Next Steps

1. Compile your SCSS: `npm run build` or your build command
2. Test in your components
3. Adjust `shape-margin` values if needed
4. Experiment with different shape combinations

**Happy shaping! ⚽🎨**

