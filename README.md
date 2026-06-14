# ContainerVerse 🚢

**Autonomous Intermodal Logistics Ecosystem**

> AI-Powered Container Tracking · Real-Time Disaster Response · Multi-Modal Routing

![FastAPI](https://img.shields.io/badge/FastAPI-0891B2?style=flat&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React_18-06B6D4?style=flat&logo=react&logoColor=white)
![Claude AI](https://img.shields.io/badge/Claude_Sonnet-7C3AED?style=flat&logo=anthropic&logoColor=white)
![GDELT](https://img.shields.io/badge/GDELT+GDACS-059669?style=flat&logoColor=white)
![DB Cargo](https://img.shields.io/badge/DB+JR_Rail-F59E0B?style=flat&logoColor=white)
![No DB](https://img.shields.io/badge/No_DB_Required-EF4444?style=flat&logoColor=white)

---

## Overview

ContainerVerse is a full-stack autonomous logistics platform that connects vessels, ports, and rail via a real-time AI backbone — replacing fragmented manual workflows with a single, self-healing ecosystem powered by **Claude Sonnet AI**.

| | |
|---|---|
| **Containers** | 20 active containers with live geo-position tracking |
| **Vessels** | 6 ships with speed, fuel, ETA, MMSI/IMO data |
| **Ports** | 12 global ports with capacity % and berth status |
| **Update Cycle** | WebSocket push every 4–9 seconds |
| **Disaster Modes** | Earthquake, Typhoon, Geopolitical — fully automated |
| **AI Model** | Claude Sonnet 4.5 via Anthropic SDK |

---

## Key Features

### 🌐 Real-Time Digital Twin
- WebSocket `/ws` endpoint pushes live state to all connected clients
- Container geo-positions update on every simulation tick
- Ship speed, fuel, ETA and port berth availability refresh dynamically
- Google Maps embed renders global shipping lane positions

### 🤖 Claude AI Agent Backbone

Six specialised AI agents drive autonomous decisions across the platform:

| Agent | Role |
|---|---|
| Disaster Coordinator | Earthquake / Typhoon / Geopolitical crisis response |
| Container Agent | Temp breach detection, priority re-classification |
| Ship Routing Agent | Weather windows, speed & ETA optimisation |
| Marketplace Auction Agent | Fairness scoring & berth allocation via LLM |
| Customs AI Agent | Batch scan, risk flagging, pre-clearance |
| Geopolitical Risk Agent | GDELT + GDACS cross-reference & reroute |

Each agent uses a constrained prompt via `llm_agent_decision()`:

```python
prompt = f"""You are {agent_name} in an autonomous maritime logistics ecosystem.
Context: {json.dumps(context)}
In 1-2 sentences, state your decision and key reason."""

msg = claude.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=120,
    messages=[{"role": "user", "content": prompt}]
)
```

### 🚨 Autonomous Disaster Response

Triggered via `POST /api/disaster/{type}` — one endpoint, full autonomous recovery:

- **Earthquake** — Osaka capacity → 20% RESTRICTED, 5 containers escalate to HUMANITARIAN priority, DB Cargo + JR Freight slots auto-booked
- **Typhoon** — Yokohama restricted, 3 vessels rerouted, JR Freight fallback Kobe→Tokyo activated
- **Geopolitical** — GDELT ingests 10 maritime articles + GDACS 8 alerts, Cape of Good Hope alternative route proposed

### 🚂 Multi-Modal Routing

- **Sea routing** — 6 vessels with speed optimisation (18→22 kts, saving 6h ETA)
- **DB Cargo** — Hamburg→Munich freight slot booking with automatic rebooking on cancellation
- **JR Freight** — Kobe→Tokyo, Osaka→Nagoya rail slots (simulated with realistic departure times)

### 🏆 Reputation Scoring & Marketplace Auction

| Tier | Score | Perks |
|---|---|---|
| 🥇 GOLD | ≥ 90 | Priority berth allocation, pre-cleared customs |
| 🥈 SILVER | 75–90 | Expedited customs, preferred auction weighting |
| STANDARD | < 75 | Standard queue, no priority access |

**Auction formula:**
```
score = priority_weight × 0.40
      + reputation_score × 0.30
      + cargo_premium   × 0.20
      + random_factor   × 0.10

Priority weights: HUMANITARIAN→100, CRITICAL→80, HIGH→60, MEDIUM→40, LOW→20
Cargo premium: +20 for VACCINES / MEDICAL / PHARMA
```

### 🛃 Customs AI & Pre-Clearance

- Batch scan of 10 containers per call via `POST /api/customs/scan`
- HS code assignment (4-digit + 2-digit harmonised system)
- 70% pre-clearance rate; 20% inspection flag chance for non-cleared containers
- LLM risk analysis: standard **48 hrs** vs pre-cleared **18 min**

### 🌱 Sustainability & Carbon Tracking

- Every container carries a `co2_kg` field (120–800 kg range)
- Sustainability Agent logs EU ETS savings per rerouting event (€240 per 338 kg saved)
- Lower-emission routes earn higher reputation score over time
- Supports IMO 2030 carbon intensity targets

---

## System Architecture

```
┌────────────────────────────────────────────────────────────┐
│         FRONTEND  (React 18 + React Router v6)             │
│  LandingPage · AuthPage · AdminDashboard · UserDashboard   │
└──────────────────────┬─────────────────────────────────────┘
                       │ REST + WebSocket
┌──────────────────────▼─────────────────────────────────────┐
│         BACKEND  (FastAPI + Python 3.11)                   │
│    REST API · WebSocket /ws · Background Simulation        │
└──────────────────────┬─────────────────────────────────────┘
                       │ Anthropic SDK
┌──────────────────────▼─────────────────────────────────────┐
│         AI LAYER  (Claude Sonnet 4.5)                      │
│  llm_agent_decision() · 6 Specialised Agent Prompts        │
└──────────────────────┬─────────────────────────────────────┘
                       │
┌──────────────────────▼─────────────────────────────────────┐
│         EXTERNAL DATA FEEDS                                │
│  GDELT v2 · GDACS RSS · DB Cargo API · JR Freight (sim)   │
└────────────────────────────────────────────────────────────┘
```

All layers communicate via async WebSocket broadcasts — state is pushed to all connected clients in real time. **No database required** (demo-ready in-memory state).

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `WS` | `/ws` | Real-time broadcast — full state push on connect |
| `GET` | `/api/state` | Full snapshot of containers, ships, ports, agent log |
| `GET` | `/api/containers` | All 20 container objects with position & status |
| `GET` | `/api/ships` | 6 vessel objects with speed, fuel, ETA |
| `GET` | `/api/ports` | 12 port objects with capacity % and berths |
| `GET` | `/api/gdelt` | Latest 10 GDELT maritime/logistics articles |
| `GET` | `/api/gdacs` | Latest 8 GDACS active disaster alerts |
| `GET` | `/api/rail/db` | DB Cargo Hamburg→Munich freight slots |
| `GET` | `/api/rail/jr` | JR Freight Kobe→Tokyo slots |
| `POST` | `/api/agent/decide` | Trigger LLM reasoning for any agent + context payload |
| `POST` | `/api/disaster/{type}` | `earthquake` / `typhoon` / `geopolitical` / `reset` |
| `POST` | `/api/auction` | Run marketplace auction with LLM fairness check |
| `POST` | `/api/customs/scan` | Batch HS codes, risk flags, clearance times |

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+ and npm
- Anthropic API key (required for AI agents)
- Deutsche Bahn API key (optional — falls back to simulation)

### Backend Setup

```bash
cd backend
cp .env.example .env        # Add your ANTHROPIC_API_KEY
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
cp .env.example .env        # Set REACT_APP_API_URL=http://localhost:8000
npm install
npm start                   # Runs on http://localhost:3000
```

### Quick Start (Windows)

```bash
run.bat        # or: powershell.cmd
```

### Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@containerverse.io` | any 6+ char password |
| User | `user@containerverse.io` | any 6+ char password |

---

## Environment Variables

### Backend (`.env`)

```env
ANTHROPIC_API_KEY=sk-ant-...     # Required — Claude Sonnet agent reasoning
DB_API_KEY=                      # Optional — Deutsche Bahn Timetables API
AIS_API_KEY=                     # Optional — AISStream WebSocket
```

### Frontend (`.env`)

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_MAPS_KEY=              # Optional — Google Maps Embed API key
```

---

## Technology Stack

| Layer | Stack |
|---|---|
| **Backend** | FastAPI · Python 3.11 · Uvicorn ASGI · httpx · feedparser |
| **AI / LLM** | Anthropic SDK · claude-sonnet-4-5 · 6 specialised agent prompts |
| **Frontend** | React 18 · React Router v6 · Context API · Google Maps Embed |
| **Data Feeds** | GDELT v2 REST · GDACS RSS XML · DB Cargo API · JR Freight (sim) |
| **State** | In-memory Python dicts · WebSocket broadcast · No DB required |
| **DevOps** | requirements.txt · .env.example · run.bat / powershell.cmd |

---

## Demo Walk-Through

1. Open `http://localhost:3000` — explore the animated landing page with live counters
2. **Login as Admin** — watch the real-time agent log scroll with AI-generated decisions
3. Click **Disaster → Earthquake** — Osaka turns RESTRICTED; containers flip to HUMANITARIAN priority
4. Click **Run Auction** — Claude scores containers and justifies the winner in real time
5. Click **Customs Scan** — 340 containers batch-processed with LLM risk analysis
6. View **GDELT & GDACS** feeds — live news events and disaster alerts from real external sources
7. **Login as User** — see personal container tracking, reputation tier, CO₂ footprint, and ETA

---

## Dashboards

### 🛡 Admin Dashboard
- Live agent log with real-time scrolling event feed
- Disaster controls — trigger Earthquake / Typhoon / Geopolitical
- Container world map with live position updates
- Auction runner with LLM-scored winner selection
- Customs batch scan with flagging report
- GDELT & GDACS feed viewers
- DB Cargo + JR Freight rail slot viewer

### 👤 User Dashboard
- Personal container tracking — status, temperature, humidity
- Reputation score & tier display (GOLD / SILVER / STANDARD)
- ETA and deadline countdown for owned containers
- Risk level indicator (LOW / MEDIUM / HIGH)
- CO₂ footprint per container
- Pre-clearance status and HS code display
- LLM-generated agent update notifications

---

*ContainerVerse — Autonomous. Intelligent. Resilient.*  
*Built with FastAPI · React 18 · Claude Sonnet · GDELT · GDACS · DB Cargo · JR Freight*

<img width="801" height="380" alt="image" src="https://github.com/user-attachments/assets/49dd5b81-5cb8-4c16-a9f1-5696f4498276" />
