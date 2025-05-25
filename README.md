# 🖼️ Image Annotation Tool

A web-based image annotation interface built with **Vue 3** and **Pinia**, supporting precise polygon and arrow markup on uploaded images.

---

## ✨ Features

- **📤 Image Upload**

  - Drag-and-drop or click-to-upload
  - Uploader auto-hides when an image is active
  - Show/hide toggle for uploader from the toolbar

- **🔺 Polygon Annotations**

  - Click to place points
  - Click near the first point to close the shape
  - Drag points or move the entire shape
  - Double-click a point to remove it
  - Press `Esc` to cancel drawing

- **➡️ Arrow Annotations**

  - Click and drag to create an arrow
  - Edit start or end point by dragging
  - Drag center to move the whole arrow

- **📋 Sidebar Zone Management**

  - Displays all annotation zones
  - Inline editing for names and labels
  - Select or delete annotations
  - Live updates with canvas

- **🛠 Toolbar**

  - Select tools: `Select`, `Polygon`, `Arrow`
  - JSON export (only shown when data is present)
  - Toggle image uploader

- **⌨️ Keyboard Shortcuts**
  - `Esc`: Deselect or cancel current action
  - `Backspace` / `Delete`: Remove selected annotation

---

## 🧪 Tech Stack

- [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/)
- TypeScript
- Composition API
- SVG overlays for drawing

---

## 📦 Annotation JSON Format

Polygon:

````json
{
  "id": "unique-id",
  "type": "polygon",
  "name": "Zone A",
  "subLabel": "Operational Area",
  "points": [{ "x": 0.25, "y": 0.4 }, { "x": 0.3, "y": 0.5 }]
}

Arrow:

```json


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
