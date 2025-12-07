# Taskirra - Task Manager

<img src="src/assets/logo.png" width="200px">

A fast, responsive, and feature-rich task manager built with React, Bootstrap, and modern web technologies. Perfect for managing personal tasks, projects, and daily workflows.


## Features

### Core Functionality
- **Create, Edit, Delete Tasks** - Full CRUD operations with form validation
- **Subtasks** - Break down complex tasks into manageable steps
- **Tags & Categories** - Organize tasks with custom tags
- **Priority Levels** - High, Medium, Low priority management
- **Due Dates** - Track deadlines with overdue indicators
- **Recurring Tasks** - Daily, Weekly, Monthly repetition
- **Task Status** - To Do, In Progress, Done

### Advanced Features
- **Smart Filtering** - Filter by date, priority, tags, and status
- **Real-time Search** - Instant task search across title, description, and tags
- **Dashboard Analytics** - Visual progress tracking and statistics
- **Drag & Drop** - Reorder tasks with intuitive drag-and-drop
- **Bulk Actions** - Complete or delete multiple tasks at once
- **Undo Support** - Undo delete and complete actions
- **Dark Mode** - Beautiful light and dark themes
- **Local Storage** - Automatic data persistence
- **Export/Import** - Backup and restore your data as JSON
- **Keyboard Shortcuts** - Efficient keyboard navigation

### UI/UX
- **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- **Accessibility** - WCAG compliant with keyboard navigation and screen reader support
- **Bootstrap Icons** - Modern, professional icon set
- **Smooth Animations** - Polished transitions and micro-interactions
- **Toast Notifications** - Non-intrusive feedback system

## Demo

**Live Demo:** [https://taskirra.vercel.app](https://taskirra.vercel.app) 

## Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Task Management
![Task Form](./screenshots/task-form.png)

### Dark Mode
![Dark Mode](./screenshots/dark-mode.png)


## Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **UI Framework:** Bootstrap 5
- **Icons:** Bootstrap Icons
- **Drag & Drop:** @dnd-kit
- **State Management:** React Hooks + localStorage
- **Date Utilities:** Custom date utilities
- **Styling:** CSS3 with CSS Variables

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/jericho066/taskirra.git
   cd taskirra
```

2. **Install dependencies**
```bash
   npm install
```

3. **Start development server**
```bash
   npm run dev
```

4. **Open in browser**
```
   http://localhost:5173
```

### Build for Production
```bash
npm run build
```

The optimized build will be in the `dist/` folder.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + N` | Create new task |
| `Ctrl + K` or `/` | Focus search |
| `Esc` | Close modal / Clear selection |
| `Tab` | Navigate between elements |
| `Enter` | Submit form / Confirm action |
| `Space` | Toggle checkbox |



## Data Storage

Taskirra uses browser localStorage to persist your data. Your tasks are stored locally and never sent to any server, ensuring complete privacy.

**Storage Keys:**
- `taskirra:tasks` - All task data
- `taskirra:projects` - Project categories
- `taskirra:settings` - App settings
- `taskirra-theme` - Theme preference

## Privacy

- **100% Client-Side** - No data ever leaves your browser
- **No Tracking** - No analytics or tracking scripts
- **No Account Required** - Start using immediately
- **Export Anytime** - Full control over your data


