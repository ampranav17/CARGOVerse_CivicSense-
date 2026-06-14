ContainerVerse
Autonomous Intermodal Logistics Ecosystem
AI-Powered Container Tracking  ·  Real-Time Disaster Response  ·  Multi-Modal Routing


FastAPI	React 18	Claude AI	GDELT+GDACS	DB+JR Rail	No DB Req.

Overview
ContainerVerse is a full-stack autonomous logistics platform built for a hackathon, connecting vessels, ports, and rail through a real-time AI backbone. It replaces fragmented manual workflows with a single, self-healing ecosystem powered by Claude Sonnet AI.

Containers	20 active containers with live geo-position tracking
Vessels	6 ships with speed, fuel, ETA, MMSI/IMO data
Ports	12 global ports with capacity % and berth status
Update Cycle	WebSocket push every 4–9 seconds
Disaster Modes	Earthquake, Typhoon, Geopolitical — fully automated
AI Model	Claude Sonnet 4.5 via Anthropic SDK

Key Features
Real-Time Digital Twin
•WebSocket /ws endpoint pushes live state to all connected clients
•Container geo-positions update on every simulation tick
•Ship speed, fuel, ETA and port berth availability refresh dynamically
•Google Maps embed renders global shipping lane positions

Claude AI Agent Backbone
Six specialised AI agents drive autonomous decisions across the platform:

Disaster Coordinator	Earthquake / Typhoon / Geopolitical crisis response
Container Agent	Temp breach detection, priority re-classification
Ship Routing Agent	Weather windows, speed & ETA optimisation
Auction Agent	Fairness scoring & berth allocation via LLM
Customs AI Agent	Batch scan, risk flagging, pre-clearance
Geopolitical Risk Agent	GDELT + GDACS cross-reference & reroute

Autonomous Disaster Response
•Earthquake — Osaka capacity drops to 20%, critical containers escalate to HUMANITARIAN priority, DB Cargo & JR Freight slots auto-booked
•Typhoon — Yokohama restricted, 3 vessels rerouted, JR Freight fallback Kobe→Tokyo activated
•Geopolitical — GDELT ingests 10 maritime articles + GDACS 8 alerts, Cape of Good Hope alternative route proposed

Multi-Modal Routing
•Sea routing: 6 vessels with speed optimisation (18→22 kts, saving 6h ETA)
•DB Cargo API: Hamburg→Munich freight slot booking with automatic rebooking on cancellation
•JR Freight: Kobe→Tokyo, Osaka→Nagoya rail slots (simulated with realistic departure times)

Reputation Scoring & Marketplace Auction
GOLD (Score ≥ 90)	Priority berth allocation, pre-cleared customs
SILVER (75–90)	Expedited customs, preferred auction weighting
STANDARD (< 75)	Standard queue, no priority access

Auction formula: score = priority_weight × 0.40 + reputation × 0.30 + cargo_premium × 0.20 + random × 0.10. Cargo premium +20 for VACCINES / MEDICAL / PHARMA.

Customs AI & Pre-Clearance
•Batch scan of 10 containers per call via POST /api/customs/scan
•HS code assignment (4-digit + 2-digit harmonised system)
•70% pre-clearance rate; 20% inspection flag chance for non-cleared containers
•LLM risk analysis logged: standard 48 hrs vs pre-cleared 18 min

Sustainability & Carbon Tracking
•Every container carries a co2_kg field (120–800 kg range)
•Sustainability Agent logs EU ETS savings per rerouting event (€240 per 338 kg saved)
•Lower-emission routes contribute to higher reputation score over time
•Supports IMO 2030 carbon intensity targets

System Architecture
Frontend	React 18 · React Router v6 · Context API (AuthContext) · Google Maps Embed
Backend	FastAPI (Python 3.11) · Uvicorn ASGI · WebSocket /ws · Background simulation
AI Layer	Anthropic SDK · claude-sonnet-4-5 · llm_agent_decision() · 6 agent prompts
Data Feeds	GDELT v2 REST · GDACS RSS XML · DB Cargo API · JR Freight (simulated)
State	In-memory Python dicts · WebSocket broadcast · No database required
DevOps	requirements.txt · .env.example · run.bat / powershell.cmd

API Reference
WS  /ws	Real-time broadcast — full state push on connect
GET  /api/state	Full snapshot of containers, ships, ports, agent log
GET  /api/containers	All 20 container objects
GET  /api/ships	6 vessel objects with speed, fuel, ETA
GET  /api/ports	12 port objects with capacity & berths
GET  /api/gdelt	Latest 10 GDELT maritime/logistics articles
GET  /api/gdacs	Latest 8 GDACS active disaster alerts
GET  /api/rail/db	DB Cargo Hamburg→Munich freight slots
GET  /api/rail/jr	JR Freight Kobe→Tokyo slots
POST  /api/agent/decide	Trigger LLM reasoning for any agent + context
POST  /api/disaster/{type}	earthquake / typhoon / geopolitical / reset
POST  /api/auction	Run marketplace auction with LLM fairness check
POST  /api/customs/scan	Batch HS codes, risk flags, clearance times

Getting Started
Prerequisites
•Python 3.11+
•Node.js 18+ and npm
•Anthropic API key (required for AI agents)
•Deutsche Bahn API key (optional — falls back to simulation)

Backend Setup
cd backend
cp .env.example .env          # Add your ANTHROPIC_API_KEY
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

Frontend Setup
cd frontend
cp .env.example .env          # Set REACT_APP_API_URL
npm install
npm start                     # Runs on http://localhost:3000

Quick Start (Windows)
run.bat        # or: powershell.cmd

Demo Credentials
Admin	admin@containerverse.io / any 6+ char password
User	user@containerverse.io / any 6+ char password

Environment Variables
Backend (.env)
ANTHROPIC_API_KEY	Required — Claude Sonnet agent reasoning
DB_API_KEY	Optional — Deutsche Bahn Timetables API
AIS_API_KEY	Optional — AISStream WebSocket (key-gated)

Frontend (.env)
REACT_APP_API_URL	Backend URL, e.g. http://localhost:8000
REACT_APP_MAPS_KEY	Google Maps Embed API key (optional)

Demo Walk-Through
1.Open http://localhost:3000 and explore the animated landing page with live counters.
2.Log in as admin — watch the real-time agent log scroll with AI-generated decisions.
3.Click Disaster → Earthquake. Osaka turns RESTRICTED; containers flip to HUMANITARIAN priority.
4.Run Auction — Claude scores two containers and justifies the winner in real time.
5.Click Customs Scan — 340 containers batch-processed with LLM risk analysis.
6.View GDELT & GDACS feeds — live news events and disaster alerts from real external sources.
7.Log in as user — see personal container tracking, reputation tier, CO₂ footprint, and ETA.
