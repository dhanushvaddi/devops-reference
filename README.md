# DevOps & SRE Interview Prep Platform

A comprehensive, free interview preparation platform covering **18 DevOps/SRE tools** with concept breakdowns, code examples, and **112+ practice Q&A items** with granular progress tracking.

Built by [master.devops](https://www.instagram.com/master.devops/)

## Features

- **18 DevOps Tools** — Linux, Git, GitHub Actions, Jenkins, Docker, Kubernetes, Helm, ArgoCD, and more
- **112+ Interview Q&A** — Real interview questions with detailed answers
- **39 Concept Sections** — Organized breakdowns with code examples
- **Granular Progress Tracking** — Check off individual sections and Q&A items (saved to localStorage)
- **Striver-style Accordion Layout** — Expandable categories with per-tool progress
- **Interview Strategy Guide** — Answer templates, deployment strategies, SLI/SLO/SLA reference
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Dark/Light Mode** — Toggle in the navbar

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v6 |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/devops-reference.git
cd devops-reference

# Install dependencies
cd client
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
cd client
npm run build
```

The output will be in `client/dist/` — serve with any static file server.

### Preview Production Build

```bash
cd client
npm run preview
```

## Project Structure

```
devops-reference/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx      # Floating bubble navigation
│   │   │   │   └── Footer.tsx      # Multi-column footer
│   │   │   ├── CodeBlock.tsx       # Syntax-highlighted code blocks
│   │   │   ├── ProgressBar.tsx     # Progress bar component
│   │   │   ├── ToolCard.tsx        # Tool card component
│   │   │   └── ToolIcon.tsx        # Lucide icon mapper for tools
│   │   ├── context/
│   │   │   └── ThemeContext.tsx     # Dark/light mode context
│   │   ├── data/
│   │   │   └── tools.ts           # All 18 tools data (sections, Q&A, tips)
│   │   ├── hooks/
│   │   │   └── useProgress.ts     # Granular progress tracking hook
│   │   ├── pages/
│   │   │   ├── HomePage.tsx        # Dashboard with stats + accordion categories
│   │   │   ├── ToolDetailPage.tsx  # Tool detail with checkboxes
│   │   │   ├── TrackerPage.tsx     # Full progress tracker
│   │   │   └── StrategyPage.tsx    # Interview strategy guide
│   │   ├── App.tsx                # Router + layout
│   │   ├── main.tsx               # Entry point
│   │   └── index.css              # Tailwind + theme variables
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── index.html                  # Original static version (reference)
├── plan.md                     # Full-stack conversion plan
└── README.md
```

## Content Coverage

### Core DevOps (10 tools)
| Tool | Sections | Q&A |
|------|----------|-----|
| Linux | 5 | 9 |
| Git | 4 | 9 |
| GitHub Actions | 4 | 8 |
| Jenkins | 4 | 8 |
| Build Tools (Maven/Gradle) | 3 | 7 |
| Docker | 4 | 9 |
| Kubernetes | 5 | 9 |
| Helm | 3 | 7 |
| ArgoCD | 3 | 7 |
| DevOps/SRE Concepts | 4 | 9 |

### Security & Quality (3 tools)
| Tool | Sections | Q&A |
|------|----------|-----|
| SonarQube | 2 | 6 |
| OWASP / DevSecOps | 3 | 7 |
| JFrog Artifactory | 2 | 5 |

### Observability (3 tools)
| Tool | Sections | Q&A |
|------|----------|-----|
| Prometheus | 3 | 7 |
| Grafana | 2 | 6 |
| Splunk | 2 | 5 |

### Cloud (2 tools)
| Tool | Sections | Q&A |
|------|----------|-----|
| AWS | 3 | 7 |
| Azure | 2 | 6 |

## Roadmap

See [plan.md](plan.md) for the full-stack conversion plan including:

- [ ] Backend (Node.js + Express + PostgreSQL)
- [ ] OAuth authentication (Google + GitHub)
- [ ] Database-backed progress tracking
- [ ] Focus/bookmark mode
- [ ] AI Interview Coach
- [ ] AdSense integration

## Contributing

Contributions are welcome! Feel free to:

1. Add more interview Q&A items
2. Expand existing tool sections
3. Fix typos or improve explanations
4. Add new DevOps tools
5. Improve the UI/UX

## License

MIT
