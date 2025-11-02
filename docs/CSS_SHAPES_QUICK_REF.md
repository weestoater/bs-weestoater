# CSS Shapes Quick Reference

## Most Common Combinations

### Avatar / Profile Picture
```html
<img src="avatar.jpg" alt="Name" class="avatar-enhanced right shape-md" />
```

### Football Badge
```html
<img src="club-badge.png" alt="Club" class="shape-football-badge right shape-lg" />
<!-- OR -->
<img src="club-badge.png" alt="Club" class="shape-shield right shape-md" />
```

### Blog/Article Image
```html
<img src="article.jpg" alt="Topic" class="shape-rounded-rect-soft right shape-xl" />
```

### Small Icon/Logo
```html
<img src="icon.png" alt="Icon" class="shape-circle right shape-sm" />
```

---

## All Shape Types

| Class | Description | Best For |
|-------|-------------|----------|
| `.shape-circle` | Perfect circle | Avatars, logos |
| `.shape-ellipse-vertical` | Tall oval | Portrait photos |
| `.shape-ellipse-horizontal` | Wide oval | Landscapes |
| `.shape-rounded-rect` | Rounded corners (20px) | Screenshots, UI |
| `.shape-rounded-rect-soft` | Extra rounded (40px) | Modern images |
| `.shape-octagon` | 8-sided | Geometric design |
| `.shape-hexagon` | 6-sided | Badges, icons |
| `.shape-shield` | Football badge shape | Sports crests |
| `.shape-football-badge` | Badge with styling | Club badges |
| `.avatar-enhanced` | Circle + border + shadow | Profile pics |

---

## Size Classes

| Class | Size | Use For |
|-------|------|---------|
| `.shape-sm` | 100x100px | Small icons |
| `.shape-md` | 150x150px | Standard images |
| `.shape-lg` | 200x200px | Featured images |
| `.shape-xl` | 250x250px | Hero images |

---

## Position Classes

| Class | Effect |
|-------|--------|
| `.right` | Float right |
| `.left` | Float left |

---

## Spacing Utilities

| Class | Effect |
|-------|--------|
| `.shape-spacious` | More space (30px) |
| `.shape-tight` | Less space (10px) |

---

## Object Fit

| Class | Effect |
|-------|--------|
| `.shape-contain` | Fit entire image (may show background) |
| `.shape-cover` | Fill shape (may crop) |

---

## Formula

```
[shape-type] + [position] + [size] + [optional-utilities]
```

### Examples:
- `shape-circle right shape-md`
- `shape-shield left shape-lg shape-spacious`
- `avatar-enhanced right shape-xl shape-tight`

---

## Browser Support

✅ Chrome/Edge 37+  
✅ Firefox 62+  
✅ Safari 10.1+  
⚠️ IE: Falls back gracefully

---

## Implementation Checklist

- [ ] Import shapes SCSS (already done in `_index.scss`)
- [ ] Compile SCSS (`npm run build`)
- [ ] Apply classes to images
- [ ] Test with sufficient text content
- [ ] Check mobile responsiveness

---

**See full documentation:** `docs/CSS_SHAPES_GUIDE.md`  
**Demo component:** `src/content/about/ShapesDemo.tsx`

