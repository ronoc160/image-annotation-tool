# 🖼️ Image Annotation Tool

A web-based image annotation interface built with **Vue 3** and **Pinia**, supporting precise polygon and arrow markup on uploaded images.

demo of the site in action [Here](https://zippy-bavarois-170431.netlify.app/)

---

## ✨ Features

### 📤 Image Upload

- Drag-and-drop or click-to-upload
- Uploader auto-hides once an image is active
- Toggle uploader visibility from the toolbar

### 🔺 Polygon Annotations

- Click to place points
- Click near the first point to close the shape
- Drag points or move the entire polygon
- Double-click a point to remove it
- Press `Esc` to cancel drawing

### ➡️ Arrow Annotations

- Click and drag to draw an arrow
- Drag start or end points to adjust
- Drag center handle to move the entire arrow

### 📋 Sidebar Zone Management

- View all annotation zones
- Inline rename and label editing
- Select or delete annotations
- Real-time canvas sync

### 🛠 Toolbar

- Tool selection: `Select`, `Polygon`, `Arrow`
- JSON export button (visible only when data exists)
- Toggle image uploader

### ⌨️ Keyboard Shortcuts

- `Esc`: Deselect or cancel current action
- `Backspace` / `Delete`: Remove selected annotation

---

## 🧪 Tech Stack

- [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/)
- TypeScript
- Composition API
- SVG for overlays

---

---

## 📦 Annotation JSON Format

### Polygon & Arrow

````json

{
  "id": "unique-id",
  "type": "polygon",
  "name": "Zone A",
  "subLabel": "Operational Area",
  "points": [
    { "x": 0.25, "y": 0.4 },
    { "x": 0.3, "y": 0.5 }
  ]
}

Arrow


{
  "id": "unique-id",
  "type": "arrow",
  "name": "Direction 1",
  "subLabel": "Flow",
  "start": { "x": 0.1, "y": 0.2 },
  "end": { "x": 0.4, "y": 0.6 }
}


## Project Setup

```sh
npm install
````

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

# image-annotation-tool
