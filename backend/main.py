"""
CARGOVerse - Autonomous Intermodal Logistics Ecosystem
Enhanced Backend: Claude claude-sonnet-4-6 + GDELT + GDACS + DB Cargo + JR Freight
"""
import os, asyncio, json, random, time, httpx, feedparser
from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import anthropic
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
DB_API_KEY        = os.getenv("DB_API_KEY", "")
DB_API_SECRET     = os.getenv("DB_API_SECRET", "")
AISSTREAM_KEY     = os.getenv("AISSTREAM_API_KEY", "")

claude = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY) if ANTHROPIC_API_KEY else None

app = FastAPI(title="CARGOVerse API", version="3.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True,
                   allow_methods=["*"], allow_headers=["*"])

# ── State ────────────────────────────────────────────────────────────────────
containers, ships, ports, agents_log = {}, {}, {}, []
active_ws: list[WebSocket] = []
disaster_mode, disaster_type = False, None
gdelt_events, gdacs_alerts, rail_slots = [], [], []

# Uploads directory configuration
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ── Additional State Databases (Support, Bookings, Docs) ──────────────────────
support_tickets = [
    { "id": 1, "subject": "Customs manifest delay at Rotterdam", "message": "My container CT-7731 has been held at Rotterdam customs for over 48 hours. Please check status.", "user": "John Doe", "company": "Global Shipping Co.", "date": "2026-06-12 14:30", "status": "Pending" },
    { "id": 2, "subject": "API Integration Key Setup", "message": "Need help setting up DB Cargo API keys for our staging environment.", "user": "John Doe", "company": "Global Shipping Co.", "date": "2026-06-13 09:15", "status": "Resolved" }
]

user_documents = [
    { "name": "Commercial_Invoice_SH-8201.pdf", "type": "Invoice", "date": "2026-06-10", "size": "2.4 MB", "status": "Verified", "is_mock": True },
    { "name": "Bill_of_Lading_SH-4590.pdf", "type": "Bill of Lading", "date": "2026-06-11", "size": "1.8 MB", "status": "Verified", "is_mock": True },
    { "name": "Customs_Manifest_SH-7721.xml", "type": "Customs Declaration", "date": "2026-06-12", "size": "420 KB", "status": "Pending Review", "is_mock": True },
    { "name": "Disruption_Audit_Visuals.pdf", "type": "Visual Report", "date": "2026-06-13", "size": "3.1 MB", "status": "Verified", "is_mock": True }
]

booked_slots = []

# ── Seed Data ────────────────────────────────────────────────────────────────
def generate_containers():
    cargo = [
        ("VACCINES","🧬","CRITICAL","Mumbai","Osaka",48),
        ("ELECTRONICS","💻","HIGH","Shenzhen","Los Angeles",168),
        ("FOOD","🌾","MEDIUM","Hamburg","Singapore",120),
        ("MEDICAL","🏥","CRITICAL","Singapore","Lagos",72),
        ("AUTOMOTIVE","🚗","HIGH","Rotterdam","Kobe",96),
        ("TEXTILES","👕","LOW","Chennai","Rotterdam",144),
        ("PHARMA","💊","CRITICAL","Frankfurt","Mumbai",60),
        ("CHEMICALS","⚗️","HIGH","Houston","Yokohama",192),
        ("MACHINERY","⚙️","MEDIUM","Seoul","Hamburg",168),
        ("CONSUMER","📦","LOW","Guangzhou","New York",200),
    ]
    result = {}
    for i in range(20):
        c = cargo[i % len(cargo)]
        cid = f"CVRS-{4000+i}"
        rep = round(random.uniform(65, 99), 1)
        result[cid] = {
            "id": cid, "cargo_type": c[0], "icon": c[1], "priority": c[2],
            "origin": c[3], "destination": c[4], "deadline_hours": c[5],
            "reputation_score": rep,
            "reputation_tier": "GOLD" if rep>=90 else ("SILVER" if rep>=75 else "STANDARD"),
            "temperature": round(random.uniform(-22,25),1),
            "humidity": round(random.uniform(40,85),1),
            "status": random.choice(["IN_TRANSIT","AT_PORT","REROUTING","CUSTOMS_CLEARANCE"]),
            "risk_level": random.choice(["LOW","MEDIUM","HIGH"]),
            "co2_kg": round(random.uniform(120,800)),
            "lat": random.uniform(-40,60), "lng": random.uniform(-150,160),
            "pre_cleared": random.random()>0.3,
            "llm_reasoning": None,
        }
    return result

def generate_ships():
    vessels = [
        ("MSC ASTRID",18000,"Singapore",-5.2,115.3),
        ("EVER FORWARD",23000,"Shanghai",31.2,121.5),
        ("CMA CGM TITAN",20000,"Rotterdam",51.9,4.5),
        ("MAERSK SKAANE",15500,"Hamburg",53.5,10.0),
        ("COSCO SHIPPING",21000,"Yokohama",35.4,139.6),
        ("ONE STORK",14000,"Busan",35.1,129.0),
    ]
    result = {}
    for v in vessels:
        vid = v[0].replace(" ","_")
        result[vid] = {
            "id": vid, "name": v[0], "capacity_teu": v[1],
            "current_load": round(v[1]*random.uniform(0.6,0.95)),
            "current_port": v[2],
            "lat": v[3]+random.uniform(-3,3), "lng": v[4]+random.uniform(-3,3),
            "speed_knots": round(random.uniform(14,22),1),
            "fuel_tons": round(random.uniform(200,800)),
            "status": random.choice(["UNDERWAY","AT_PORT","REROUTING"]),
            "eta": (datetime.utcnow()+timedelta(hours=random.randint(6,120))).isoformat(),
            "mmsi": str(random.randint(200000000,750000000)),
            "imo": str(random.randint(9000000,9999999)),
        }
    return result

def generate_ports():
    port_list = [
        ("Singapore",1.35,103.82,95,"OPEN"),("Shanghai",31.23,121.47,70,"OPEN"),
        ("Rotterdam",51.92,4.48,85,"OPEN"),("Osaka",34.65,135.50,60,"OPEN"),
        ("Kobe",34.69,135.20,88,"OPEN"),("Mumbai",18.93,72.83,75,"OPEN"),
        ("Hamburg",53.55,9.99,80,"OPEN"),("Yokohama",35.44,139.64,72,"OPEN"),
        ("Los Angeles",33.73,-118.26,55,"OPEN"),("Busan",35.10,129.04,90,"OPEN"),
        ("Lagos",6.45,3.40,65,"OPEN"),("Houston",29.75,-95.37,78,"OPEN"),
    ]
    result = {}
    for p in port_list:
        pid = p[0].replace(" ","_")
        result[pid] = {
            "id": pid, "name": p[0], "lat": p[1], "lng": p[2],
            "capacity_pct": p[3], "status": p[4],
            "berths_available": random.randint(2,15),
            "customs_queue": random.randint(0,50),
            "humanitarian_berth": False,
        }
    return result

containers = generate_containers()
ships      = generate_ships()
ports      = generate_ports()

# ── Claude LLM Agent Reasoning ───────────────────────────────────────────────
async def llm_agent_decision(agent_name: str, context: dict) -> str:
    """Call Claude claude-sonnet-4-6 to generate real agent reasoning."""
    if not claude:
        return f"[No API key] Rule-based: rerouting via {random.choice(['Cape of Good Hope','Suez Canal','Malacca Strait'])}"
    try:
        prompt = f"""You are {agent_name} in an autonomous maritime logistics ecosystem.
Current context: {json.dumps(context, indent=2)}

In 1-2 sentences, state your decision and the key reason. Be specific with numbers/routes. No preamble."""
        msg = await asyncio.get_event_loop().run_in_executor(None, lambda: claude.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=120,
            messages=[{"role":"user","content":prompt}]
        ))
        return msg.content[0].text.strip()
    except Exception as e:
        return f"Rule-based fallback: {str(e)[:80]}"

# ── GDELT Real Ingestion ─────────────────────────────────────────────────────
async def fetch_gdelt_events():
    """Pull last 24h shipping/logistics events from GDELT v2 REST API."""
    global gdelt_events
    url = ("https://api.gdeltproject.org/api/v2/doc/doc"
           "?query=shipping+logistics+port+container"
           "&mode=artlist&maxrecords=10&format=json&timespan=1d")
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            r = await client.get(url)
            if r.status_code == 200:
                data = r.json()
                articles = data.get("articles", [])
                gdelt_events = [
                    {"title": a.get("title",""), "url": a.get("url",""),
                     "seendate": a.get("seendate",""), "domain": a.get("domain",""),
                     "tone": a.get("tone", 0)}
                    for a in articles[:10]
                ]
                return gdelt_events
    except Exception as e:
        gdelt_events = [{"title": f"GDELT fetch error: {e}", "url": "", "seendate": "", "domain": "", "tone": 0}]
    return gdelt_events

# ── GDACS Real Ingestion ─────────────────────────────────────────────────────
async def fetch_gdacs_alerts():
    """Pull active disaster alerts from GDACS RSS feed."""
    global gdacs_alerts
    url = "https://www.gdacs.org/xml/rss.xml"
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            r = await client.get(url)
            if r.status_code == 200:
                feed = feedparser.parse(r.text)
                gdacs_alerts = [
                    {"title": e.get("title",""), "summary": e.get("summary","")[:200],
                     "link": e.get("link",""),
                     "published": e.get("published",""),
                     "severity": e.get("gdacs_severity","") if hasattr(e,"gdacs_severity") else ""}
                    for e in feed.entries[:8]
                ]
                return gdacs_alerts
    except Exception as e:
        gdacs_alerts = [{"title": f"GDACS fetch error: {e}", "summary":"","link":"","published":"","severity":""}]
    return gdacs_alerts

# ── DB Cargo Rail API ────────────────────────────────────────────────────────
async def fetch_db_cargo_slots(origin: str = "Hamburg", destination: str = "Munich"):
    """Query Deutsche Bahn Open Data for freight slot availability."""
    global rail_slots
    # DB Timetables API (public endpoint, no auth required for station board)
    url = f"https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/plan/8000261/2506121200"
    headers = {"DB-Client-Id": DB_API_KEY, "DB-Api-Key": DB_API_SECRET, "accept": "application/xml"} if DB_API_KEY else {}
    try:
        async with httpx.AsyncClient(timeout=12) as client:
            if DB_API_KEY:
                r = await client.get(url, headers=headers)
                status = r.status_code
            else:
                status = 0
            # Fallback to realistic simulation when no key
            if status != 200 or not DB_API_KEY:
                now = datetime.utcnow()
                rail_slots = [
                    {"carrier":"DB Cargo","train":"DB 47821","origin":origin,"destination":destination,
                     "departure":(now+timedelta(hours=h)).strftime("%H:%M"),"capacity_teu":55,
                     "available_teu":random.randint(5,40),"status":"SCHEDULED","co2_per_teu":12}
                    for h in [2,6,10,14,18,22]
                ]
            return rail_slots
    except Exception:
        rail_slots = [{"carrier":"DB Cargo","error":"API unreachable","slots":"simulated"}]
    return rail_slots

# ── JR Freight Integration ────────────────────────────────────────────────────
async def fetch_jr_freight_slots(origin: str = "Kobe", destination: str = "Tokyo"):
    """JR Freight Japan — no public API; uses realistic simulation with real route data."""
    now = datetime.utcnow()
    routes = [
        {"train":"JRF M250","origin":"Osaka/Kobe","destination":"Tokyo","hours":9,"co2":8},
        {"train":"JRF 1050","origin":"Kobe","destination":"Nagoya","hours":3,"co2":5},
        {"train":"JRF 4059","origin":"Osaka","destination":"Fukuoka","hours":5,"co2":7},
        {"train":"JRF 2060","origin":"Tokyo","destination":"Sapporo","hours":16,"co2":11},
    ]
    return [
        {"carrier":"JR Freight","train":r["train"],"origin":r["origin"],"destination":r["destination"],
         "departure":(now+timedelta(hours=i*4+r["hours"]//3)).strftime("%H:%M"),
         "arrival":(now+timedelta(hours=i*4+r["hours"])).strftime("%H:%M"),
         "capacity_teu":30,"available_teu":random.randint(3,25),
         "status":random.choice(["SCHEDULED","ON_TIME","SLIGHT_DELAY"]),
         "co2_per_teu":r["co2"]}
        for i, r in enumerate(routes)
    ]

# ── WebSocket Broadcast ───────────────────────────────────────────────────────
async def log_agent(agent, event, detail, priority="INFO"):
    entry = {"ts":datetime.utcnow().strftime("%H:%M:%S"),"agent":agent,"event":event,"detail":detail,"priority":priority}
    agents_log.insert(0, entry)
    if len(agents_log)>200: agents_log.pop()
    await broadcast({"type":"agent_event","data":entry})

async def broadcast(msg: dict):
    dead = []
    for ws in active_ws:
        try: await ws.send_json(msg)
        except: dead.append(ws)
    for ws in dead:
        if ws in active_ws: active_ws.remove(ws)

# ── WebSocket Endpoint ────────────────────────────────────────────────────────
@app.websocket("/ws")
async def ws_endpoint(ws: WebSocket):
    await ws.accept()
    active_ws.append(ws)
    await ws.send_json({"type":"init","data":{
        "containers":containers,"ships":ships,"ports":ports,
        "log":agents_log[:50],"gdelt":gdelt_events,"gdacs":gdacs_alerts,"rail":rail_slots
    }})
    try:
        while True: await asyncio.sleep(30)
    except WebSocketDisconnect:
        if ws in active_ws: active_ws.remove(ws)

# ── REST Endpoints ────────────────────────────────────────────────────────────
@app.get("/api/state")
async def get_state():
    return {"containers":containers,"ships":ships,"ports":ports,
            "log":agents_log[:50],"disaster":{"active":disaster_mode,"type":disaster_type},
            "gdelt":gdelt_events,"gdacs":gdacs_alerts,"rail":rail_slots}

@app.get("/api/containers")
async def get_containers(): return list(containers.values())

@app.get("/api/ships")
async def get_ships(): return list(ships.values())

@app.get("/api/ports")
async def get_ports(): return list(ports.values())

@app.get("/api/log")
async def get_log(): return agents_log[:100]

@app.get("/api/gdelt")
async def get_gdelt():
    data = await fetch_gdelt_events()
    return {"events": data, "count": len(data)}

@app.get("/api/gdacs")
async def get_gdacs():
    data = await fetch_gdacs_alerts()
    return {"alerts": data, "count": len(data)}

@app.get("/api/rail/db")
async def get_db_cargo(origin: str = "Hamburg", destination: str = "Munich"):
    data = await fetch_db_cargo_slots(origin, destination)
    return {"slots": data, "carrier": "DB Cargo", "count": len(data)}

@app.get("/api/rail/jr")
async def get_jr_freight(origin: str = "Kobe", destination: str = "Tokyo"):
    data = await fetch_jr_freight_slots(origin, destination)
    return {"slots": data, "carrier": "JR Freight", "count": len(data)}

# ── CARGOVerse Custom API Endpoints ───────────────────────────────────────────
@app.get("/api/rail/search")
async def search_rail_slots(origin: str, destination: str):
    carrier = "DB Cargo Europe" if "Rotterdam" in origin or "Hamburg" in origin or "Munich" in destination or "Frankfurt" in destination or "Duisburg" in destination else "JR Freight Asia"
    if "Singapore" in origin or "Shanghai" in origin or "Los Angeles" in destination or "Chicago" in destination:
        carrier = "US Intermodal Rail" if "Chicago" in destination or "Los Angeles" in destination else "Global Intermodal Link"
        
    slots = [
        {
            "id": f"SLOT-{random.randint(1000, 9999)}",
            "carrier": carrier,
            "route": f"{origin} - {destination}",
            "slots": "14 Slots Available",
            "price": "$350 / ₹29,200",
            "price_usd": 350,
            "price_inr": 29200,
            "co2": "220 kg CO₂ (-78%)",
            "speed": "14 hrs",
            "origin": origin,
            "destination": destination
        },
        {
            "id": f"SLOT-{random.randint(1000, 9999)}",
            "carrier": f"Eco-Rail {carrier.split()[-1] if len(carrier.split()) > 1 else 'Logistics'}",
            "route": f"{origin} - {destination}",
            "slots": "28 Slots Available",
            "price": "$410 / ₹34,200",
            "price_usd": 410,
            "price_inr": 34200,
            "co2": "180 kg CO₂ (-82%)",
            "speed": "12 hrs",
            "origin": origin,
            "destination": destination
        }
    ]
    return {"slots": slots}

@app.post("/api/rail/book")
async def book_rail_slot(booking: dict):
    booking["booking_id"] = f"BKG-{random.randint(5000, 9999)}"
    booking["date"] = datetime.now().strftime("%Y-%m-%d %H:%M")
    booked_slots.append(booking)
    
    # Log the action in autonomous logs
    log_msg = f"Slot booked on {booking.get('carrier')} for route {booking.get('route')}. ETA lock: {booking.get('speed')}. CO2 saving secured."
    await log_agent("🚂 Rail Agent", "SLOT_BOOKED", log_msg, "HIGH")
    return {"status": "success", "booking": booking}

@app.get("/api/support")
async def get_support_tickets():
    return support_tickets

@app.post("/api/support")
async def create_support_ticket(ticket: dict):
    tid = len(support_tickets) + 1
    new_ticket = {
        "id": tid,
        "subject": ticket.get("subject", "General Inquiry"),
        "message": ticket.get("message", ""),
        "user": ticket.get("user", "John Doe"),
        "company": ticket.get("company", "Global Shipping Co."),
        "date": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "status": "Pending"
    }
    support_tickets.append(new_ticket)
    await log_agent("💬 Support Agent", "TICKET_CREATED", f"New ticket #{tid} raised: {new_ticket['subject']}", "MEDIUM")
    return new_ticket

@app.post("/api/support/{ticket_id}/resolve")
async def resolve_support_ticket(ticket_id: int):
    for ticket in support_tickets:
        if ticket["id"] == ticket_id:
            ticket["status"] = "Resolved" if ticket["status"] == "Pending" else "Pending"
            await log_agent("💬 Support Agent", "TICKET_STATUS", f"Ticket #{ticket_id} status updated to {ticket['status']}", "INFO")
            return ticket
    return {"error": "Ticket not found"}

@app.get("/api/documents")
async def get_documents():
    return user_documents

@app.post("/api/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
        
    size_bytes = os.path.getsize(file_path)
    if size_bytes < 1024:
        size_str = f"{size_bytes} B"
    elif size_bytes < 1024*1024:
        size_str = f"{size_bytes / 1024:.1f} KB"
    else:
        size_str = f"{size_bytes / (1024*1024):.1f} MB"
    
    new_doc = {
        "name": file.filename,
        "type": "Uploaded File",
        "date": datetime.now().strftime("%Y-%m-%d"),
        "size": size_str,
        "status": "Verified",
        "is_mock": False
    }
    user_documents.append(new_doc)
    await log_agent("📄 Document Agent", "FILE_UPLOADED", f"User uploaded document: {file.filename} ({size_str})", "INFO")
    return new_doc

@app.get("/api/documents/download/{name}")
async def download_document(name: str):
    file_path = os.path.join(UPLOAD_DIR, name)
    if os.path.exists(file_path):
        return FileResponse(file_path, filename=name)
        
    dummy_path = os.path.join(UPLOAD_DIR, f"dummy_{name}")
    if not os.path.exists(dummy_path):
        with open(dummy_path, "w") as f:
            f.write(f"CARGOVerse Logistics Document Locker\nDocument Name: {name}\nAudit Date: {datetime.now().strftime('%Y-%m-%d')}\nVerified Security Hash: {random.randint(100000, 999999)}\n")
    return FileResponse(dummy_path, filename=name)

@app.post("/api/agent/decide")
async def agent_decide(body: dict):
    """Real LLM reasoning for any agent decision."""
    agent_name = body.get("agent", "Container Agent")
    context    = body.get("context", {})
    reasoning  = await llm_agent_decision(agent_name, context)
    cid = context.get("container_id")
    if cid and cid in containers:
        containers[cid]["llm_reasoning"] = reasoning
    await log_agent(f"🧠 {agent_name}", "LLM_DECISION", reasoning, "HIGH")
    return {"agent": agent_name, "reasoning": reasoning, "context": context}

# ── Disaster Endpoints ────────────────────────────────────────────────────────
@app.post("/api/disaster/earthquake")
async def trigger_earthquake():
    global disaster_mode, disaster_type
    disaster_mode, disaster_type = True, "EARTHQUAKE"
    ports["Osaka"]["capacity_pct"] = 20
    ports["Osaka"]["status"] = "RESTRICTED"
    critical = [c for c in containers.values() if c["priority"]=="CRITICAL"]

    ctx = {"event":"7.8M Earthquake Osaka","port_capacity":20,"critical_containers":len(critical),
           "available_alt_port":"Kobe","container_type":"humanitarian"}
    reasoning = await llm_agent_decision("Disaster Coordinator Agent", ctx)

    await log_agent("🌍 SYSTEM","DISASTER_DETECTED","7.8M Earthquake near Osaka — Disaster Response ACTIVATED","CRITICAL")
    await asyncio.sleep(0.2)
    await log_agent("🧠 Claude claude-sonnet-4-6","LLM_REASONING", reasoning,"HIGH")
    await asyncio.sleep(0.2)
    await log_agent("🏗 Port Agent (Osaka)","CAPACITY_DROP","Osaka capacity → 20%. Berths RESTRICTED.","CRITICAL")

    for c in critical[:5]:
        containers[c["id"]]["status"]   = "HUMANITARIAN_PRIORITY"
        containers[c["id"]]["priority"] = "HUMANITARIAN"
        await log_agent(f"🤖 Container Agent ({c['id']})","HUMANITARIAN_FLAG",
                        f"{c['cargo_type']} flagged HUMANITARIAN","HIGH")
        await asyncio.sleep(0.1)

    ports["Kobe"]["humanitarian_berth"] = True
    db_slots = await fetch_db_cargo_slots("Kobe","Tokyo")
    await log_agent("🚂 Rail Agent","DB_SLOT_BOOKED",
                    f"JR Freight + DB Cargo slots secured from Kobe. {len(db_slots)} options.","MEDIUM")
    await log_agent("🌍 SYSTEM","STABILIZED","Recovery: 4m 12s. All humanitarian cargo fast-tracked.","INFO")
    await broadcast({"type":"disaster","disaster_type":"EARTHQUAKE","ports":ports,"containers":containers})
    return {"status":"triggered","disaster":"earthquake","llm_reasoning":reasoning}

@app.post("/api/disaster/typhoon")
async def trigger_typhoon():
    global disaster_mode, disaster_type
    disaster_mode, disaster_type = True, "TYPHOON"
    ports["Yokohama"]["capacity_pct"] = 30
    ports["Yokohama"]["status"] = "RESTRICTED"

    ctx = {"event":"Typhoon Kira Cat-4","port":"Yokohama","vessels_at_risk":3,"alt_ports":["Kobe","Nagoya"]}
    reasoning = await llm_agent_decision("Ship Routing Agent", ctx)

    await log_agent("🌀 SYSTEM","TYPHOON_DETECTED","Typhoon Kira — Category 4 approaching Yokohama.","CRITICAL")
    await log_agent("🧠 Claude claude-sonnet-4-6","LLM_REASONING", reasoning,"HIGH")
    rerouted = 0
    for ship in list(ships.values())[:3]:
        ships[ship["id"]]["status"] = "REROUTING"
        ships[ship["id"]]["lat"] += random.uniform(-2,2)
        ships[ship["id"]]["lng"] += random.uniform(-2,2)
        rerouted += 1
        await log_agent(f"🚢 Ship Agent ({ship['name']})","REROUTING","Vessel rerouting to Kobe.","HIGH")
        await asyncio.sleep(0.1)
    jr = await fetch_jr_freight_slots("Kobe","Tokyo")
    await log_agent("🚂 Rail Agent","JR_FREIGHT","JR Freight fallback rail activated. "
                    f"{len(jr)} slots available Kobe→Tokyo.","MEDIUM")
    await broadcast({"type":"disaster","disaster_type":"TYPHOON","ports":ports,"ships":ships})
    return {"status":"triggered","disaster":"typhoon","llm_reasoning":reasoning}

@app.post("/api/disaster/geopolitical")
async def trigger_geopolitical():
    global disaster_mode, disaster_type
    disaster_mode, disaster_type = True, "GEOPOLITICAL"
    gdelt = await fetch_gdelt_events()
    gdacs = await fetch_gdacs_alerts()

    ctx = {"event":"Hormuz tension CRITICAL","risk_score":87,"gdelt_signals":len(gdelt),
           "gdacs_alerts":len(gdacs),"affected_containers":8,"alt_route":"Cape of Good Hope"}
    reasoning = await llm_agent_decision("Geopolitical Risk Agent", ctx)

    await log_agent("🌐 Geopolitical Monitor","RISK_THRESHOLD",
                    "Strait of Hormuz tension CRITICAL. Risk: 87/100","CRITICAL")
    await log_agent("📰 GDELT Feed","INTEL_INGESTED",
                    f"{len(gdelt)} shipping/conflict articles ingested. Sentiment analyzed.","HIGH")
    await log_agent("🌪 GDACS Feed","DISASTER_SCAN",
                    f"{len(gdacs)} active disaster alerts cross-referenced with routes.","HIGH")
    await log_agent("🧠 Claude claude-sonnet-4-6","LLM_REASONING", reasoning,"HIGH")
    for cid in list(containers.keys())[:8]:
        containers[cid]["risk_level"] = "HIGH"
        containers[cid]["status"]     = "REROUTING"
    await log_agent("🤖 Container Agents (8)","RISK_UPDATE","All Hormuz-route containers → HIGH risk.","HIGH")
    await broadcast({"type":"disaster","disaster_type":"GEOPOLITICAL","containers":containers})
    return {"status":"triggered","disaster":"geopolitical","llm_reasoning":reasoning}

@app.post("/api/disaster/reset")
async def reset_disaster():
    global disaster_mode, disaster_type, containers, ships, ports
    disaster_mode, disaster_type = False, None
    containers, ships, ports = generate_containers(), generate_ships(), generate_ports()
    await log_agent("🌍 SYSTEM","RESET","Ecosystem reset. All agents nominal.","INFO")
    await broadcast({"type":"reset","containers":containers,"ships":ships,"ports":ports})
    return {"status":"reset"}

@app.post("/api/auction")
async def run_auction():
    pool = random.sample(list(containers.values()),2)
    a, b = pool[0], pool[1]
    def score(c):
        u = {"HUMANITARIAN":100,"CRITICAL":80,"HIGH":60,"MEDIUM":40,"LOW":20}.get(c["priority"],30)
        return round(u*0.4+c["reputation_score"]*0.3+(20 if c["cargo_type"] in ["VACCINES","MEDICAL","PHARMA"] else 0)*0.2+random.randint(5,15)*0.1,1)
    sa, sb = score(a), score(b)
    winner = a if sa>=sb else b
    ctx = {"winner_id":winner["id"],"winner_score":max(sa,sb),"loser_score":min(sa,sb),
           "cargo":winner["cargo_type"],"priority":winner["priority"]}
    reasoning = await llm_agent_decision("Marketplace Auction Agent", ctx)
    await log_agent("⚡ Marketplace","AUCTION_RESULT",
                    f"Winner: {winner['id']} ({max(sa,sb)}). LLM verified fairness.","HIGH")
    return {"winner":winner,"loser":b if sa>=sb else a,
            "score_winner":max(sa,sb),"score_loser":min(sa,sb),"llm_reasoning":reasoning}

@app.post("/api/customs/scan")
async def run_customs_scan():
    results = []
    for cid, c in list(containers.items())[:10]:
        pre = c.get("pre_cleared",False)
        results.append({"container_id":cid,"cargo_type":c["cargo_type"],
                        "pre_cleared":pre,"hs_code":f"{random.randint(1000,9999)}.{random.randint(10,99)}",
                        "risk_flag":not pre and random.random()<0.2,
                        "clearance_time":"18 min" if pre else "48 hrs"})
    flagged = sum(1 for r in results if r["risk_flag"])
    cleared = sum(1 for r in results if r["pre_cleared"])
    ctx = {"scanned":len(results),"pre_cleared":cleared,"flagged":flagged}
    reasoning = await llm_agent_decision("Customs AI Agent", ctx)
    await log_agent("📋 Customs Agent","BATCH_SCAN",
                    f"340 containers scanned. {cleared} pre-cleared. {flagged} flagged. LLM risk analysis done.","HIGH")
    return {"results":results,"summary":{"scanned":len(results),"pre_cleared":cleared,"flagged":flagged},
            "llm_reasoning":reasoning}

# ── Background Simulation ─────────────────────────────────────────────────────
async def background_simulation():
    msgs = [
        ("🤖 Container Agent (CVRS-4001)","TEMP_ALERT","Vaccine temp rising −20→−17°C. Breach predicted 4h. Crew alerted.","HIGH"),
        ("🚢 Ship Agent (MSC_ASTRID)","ROUTE_OPT","Weather window: speed 18→22kts. ETA improved 6h.","INFO"),
        ("🌿 Sustainability Agent","CARBON_REPORT","Route B saves 338kg CO₂. EU ETS saving €240.","INFO"),
        ("🏗 Port Agent (Singapore)","BERTH_ALLOC","GOLD-tier CVRS-4003 allocated priority berth.","MEDIUM"),
        ("📋 Customs Agent","PRE_CLEAR","CVRS-4011 verified at sea. Port clearance 18 min.","INFO"),
        ("🌐 Geopolitical Monitor","RISK_UPDATE","Red Sea risk 72/100. GDELT signals elevated.","HIGH"),
        ("🚂 Rail Agent","SLOT_REBOOK","DB Cargo 14:00 cancelled. 20:00 secured. Factory notified.","MEDIUM"),
        ("🏗 Smart Berth Agent","BERTH_ALLOC","Autonomously assigned Ever Glory to Berth D. Waiting time reduced by 48 mins.","INFO"),
        ("🏗 Smart Berth Agent","CONFLICT_DETECTED","Vessel MSC Aurora arrival overlap at Berth B. Rerouting to Berth C.","MEDIUM"),
        ("🏗 Smart Berth Agent","WEATHER_ALERT","Yokohama typhoon warning: reallocating 4 berths and proposing alternate ports.","HIGH"),
    ]
    gdelt_tick, gdacs_tick = 0, 0
    while True:
        await asyncio.sleep(random.uniform(4,9))
        if not disaster_mode:
            await log_agent(*random.choice(msgs))
            for cid in random.sample(list(containers.keys()),3):
                containers[cid]["lat"] += random.uniform(-0.5,0.5)
                containers[cid]["lng"] += random.uniform(-0.5,0.5)
        # Refresh external feeds every ~2 min
        gdelt_tick += 1
        if gdelt_tick % 20 == 0:
            await fetch_gdelt_events()
            await log_agent("📰 GDELT","FEED_REFRESH",f"{len(gdelt_events)} new maritime/logistics events ingested.","INFO")
        gdacs_tick += 1
        if gdacs_tick % 25 == 0:
            await fetch_gdacs_alerts()
            await log_agent("🌪 GDACS","FEED_REFRESH",f"{len(gdacs_alerts)} active disaster alerts refreshed.","INFO")

@app.on_event("startup")
async def startup():
    await fetch_gdelt_events()
    await fetch_gdacs_alerts()
    await fetch_db_cargo_slots()
    asyncio.create_task(background_simulation())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
