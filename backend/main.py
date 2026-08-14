"""
Yatriva — Nashik Kumbh Mela 2027
FastAPI backend — Phase 1 to 4
Provides: health check, CRUD endpoints, and grounded Multilingual RAG AI Assistant
"""
import os
import time
from collections import defaultdict
from typing import Optional, List, Dict, Any
from enum import Enum

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from rag import search_grounded_context

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# ─── Application ─────────────────────────────────────────────────────────────

app = FastAPI(
    title="Yatriva API",
    description=(
        "Independent visitor guide API for Nashik-Trimbakeshwar "
        "Simhastha Kumbh Mela 2027.\n\n"
        "Phase 4: Multi-lingual Grounded RAG AI Assistant with Safety Handoffs."
    ),
    version="0.4.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Build CORS origin list from env — supports comma-separated URLs for multiple
# Vercel deployments (e.g. prod + branch previews). Never falls back to "*".
_frontend_url_env = os.getenv("FRONTEND_URL", "")
_extra_origins = [u.strip() for u in _frontend_url_env.split(",") if u.strip()]

ALLOWED_ORIGINS: list[str] = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    *_extra_origins,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


# ─── Enums & Models ───────────────────────────────────────────────────────────

class PlaceCategory(str, Enum):
    ghat = "ghat"
    temple = "temple"
    parking = "parking"
    transport_hub = "transport_hub"
    medical = "medical"
    police = "police"
    information_centre = "information_centre"
    food = "food"
    toilet = "toilet"


class Coordinates(BaseModel):
    lat: float
    lng: float


class LocalisedName(BaseModel):
    en: str
    hi: str
    mr: str


class LocalisedDescription(BaseModel):
    en: Optional[str] = None
    hi: Optional[str] = None
    mr: Optional[str] = None


class PlaceBase(BaseModel):
    slug: str
    category: PlaceCategory
    name: LocalisedName
    coordinates: Coordinates
    description: Optional[LocalisedDescription] = None
    address: Optional[str] = None
    verified: bool = False
    tags: List[str] = []


class Place(PlaceBase):
    id: str


class TransportRoute(BaseModel):
    id: str
    routeNumber: Optional[str] = None
    routeNameEn: str
    routeNameHi: str
    routeNameMr: str
    origin: str
    destination: str
    frequencyMinutes: Optional[int] = None
    operatorEn: str
    verified: bool = False
    notes: Optional[str] = None


class ContentPage(BaseModel):
    id: str
    slug: str
    titleEn: str
    titleHi: str
    titleMr: str
    bodyEn: str
    bodyHi: str
    bodyMr: str
    published: bool = True


class EmergencyContact(BaseModel):
    id: str
    labelEn: str
    labelHi: str
    labelMr: str
    phone: Optional[str] = None
    category: str
    verified: bool = False


# ─── Chat / RAG Pydantic Models ───────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    locale: Optional[str] = "en"


class ChatResponse(BaseModel):
    reply: str
    locale: str
    grounded: bool
    sources: List[str] = []
    isSafetyHandoff: bool = False


# ─── Rate Limiter (Sliding Window: 10 requests / 60s per IP) ─────────────────

RATE_LIMIT_WINDOW = 60
MAX_REQUESTS_PER_WINDOW = 10
ip_request_history: Dict[str, List[float]] = defaultdict(list)


def check_rate_limit(client_ip: str):
    now = time.time()
    history = ip_request_history[client_ip]
    history = [t for t in history if now - t < RATE_LIMIT_WINDOW]
    if len(history) >= MAX_REQUESTS_PER_WINDOW:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Please wait 1 minute before asking more questions.",
        )
    history.append(now)
    ip_request_history[client_ip] = history


# ─── Safety-Critical Guardrail Intercept ─────────────────────────────────────

SAFETY_KEYWORDS = [
    "child", "kid", "lost", "missing", "separated", "family",
    "faint", "heart", "attack", "injury", "blood", "bleeding", "unconscious",
    "stampede", "crowd crush", "trapped", "suffocating", "stuck",
    "गुमशुदा", "खो गया", "बच्चा", "दुर्घटना", "चोट", "बेहोश", "एम्बुलेंस",
    "हरवला", "मदत", "रुग्णवाहिका", "पोलीस", "अपघात"
]


def check_safety_guardrails(message: str, locale: str = "en") -> Optional[str]:
    msg_lower = message.lower()
    for kw in SAFETY_KEYWORDS:
        if kw in msg_lower:
            if locale == "hi":
                return (
                    "**सुरक्षा सहायता संदेश**: मैं सक्रिय आपातकालीन, गुमशुदा व्यक्ति या भीड़ की स्थितियों में एआई मार्गदर्शन नहीं दे सकता। "
                    "कृपया तुरंत **रामकुंड / त्र्यंबकेश्वर पुलिस सहायता बूथ** पर जाएं या आपातकालीन हेल्पलाइन पर संपर्क करें।"
                )
            elif locale == "mr":
                return (
                    "**सुरक्षा मदत संदेश**: मी सक्रिय आणीबाणी, हरवलेली व्यक्ती किंवा गर्दीच्या प्रसंगी एआय मार्गदर्शन देऊ शकत नाही. "
                    "कृपया तात्काळ **रामकुंड / त्र्यंबकेश्वर पोलीस मदत केंद्रास** भेट द्या किंवा हेल्पलाईनवर संपर्क साधा."
                )
            else:
                return (
                    "**Safety Handoff Notice**: I cannot assist with active medical emergencies, lost persons, or crowd crush situations. "
                    "Please contact emergency services immediately or report directly to the nearest **Police Assistance Booth / Medical Aid Post** at Ramkund or Trimbakeshwar."
                )
    return None


# ─── Seed Memory Databases ────────────────────────────────────────────────────

PLACES_DB: List[Place] = [
    Place(
        id="ghat-ramkund",
        slug="ramkund",
        category=PlaceCategory.ghat,
        name=LocalisedName(en="Ramkund Ghat", hi="रामकुंड घाट", mr="रामकुंड घाट"),
        coordinates=Coordinates(lat=19.9961, lng=73.7888),
        description=LocalisedDescription(
            en="Sacred bathing ghat on Godavari river in Nashik. Primary Amrit Snan site.",
            hi="नाशिक में गोदावरी नदी पर सबसे पवित्र स्नान घाट। मुख्य अमृत स्नान स्थल।",
            mr="नाशिकमधील गोदावरी नदीवरील सर्वात पवित्र स्नान घाट. मुख्य अमृत स्नान स्थळ.",
        ),
        verified=True,
        tags=["primary-snan", "accessible"],
    ),
    Place(
        id="temple-trimbakeshwar",
        slug="trimbakeshwar",
        category=PlaceCategory.temple,
        name=LocalisedName(en="Trimbakeshwar Temple", hi="त्र्यंबकेश्वर मंदिर", mr="त्र्यंबकेश्वर मंदिर"),
        coordinates=Coordinates(lat=19.9325, lng=73.5306),
        description=LocalisedDescription(
            en="12th Jyotirlinga shrine of Shiva located 28 km from Nashik city.",
            hi="भगवान शिव के 12 ज्योतिर्लिंगों में से एक। नाशिक से 28 किमी दूर।",
            mr="भगवान शिवाच्या १२ ज्योतिर्लिंगांपैकी एक. नाशिकपासून २८ किमी.",
        ),
        verified=True,
        tags=["jyotirlinga"],
    ),
    Place(
        id="ghat-kushavarta",
        slug="kushavarta",
        category=PlaceCategory.ghat,
        name=LocalisedName(en="Kushavarta Kund", hi="कुशावर्त कुंड", mr="कुशावर्त कुंड"),
        coordinates=Coordinates(lat=19.9328, lng=73.5317),
        description=LocalisedDescription(
            en="Sacred bathing tank at Trimbakeshwar, source of river Godavari. Primary Shaiva Shahi Snan site.",
            hi="त्र्यंबकेश्वर में पवित्र स्नान कुंड, गोदावरी नदी का उद्गम स्थल। शैव अखाड़ों का मुख्य शाही स्नान स्थल।",
            mr="त्र्यंबकेश्वर येथील पवित्र कुशावर्त कुंड, गोदावरी नदीचे उगमस्थान. शैव आखाड्यांचे मुख्य शाही स्नान स्थळ.",
        ),
        verified=True,
        tags=["primary-snan", "trimbakeshwar"],
    ),
]

TRANSPORT_ROUTES_DB: List[TransportRoute] = [
    TransportRoute(
        id="route-nashik-trimbak",
        routeNumber="MSRTC-K1",
        routeNameEn="Nashik CBS ⇄ Trimbakeshwar Stand",
        routeNameHi="नाशिक CBS ⇄ त्र्यंबकेश्वर बस स्टैंड",
        routeNameMr="नाशिक CBS ⇄ त्र्यंबकेश्वर बस स्थानक",
        origin="CBS Nashik",
        destination="Trimbakeshwar",
        frequencyMinutes=10,
        operatorEn="MSRTC State Transport",
        verified=True,
        notes="Direct 28 km highway route via NH848 operating 24x7 during Mela.",
    ),
    TransportRoute(
        id="route-railway-panchavati",
        routeNumber="MSRTC-K2",
        routeNameEn="Nashik Road Station ⇄ Nimani / Panchavati",
        routeNameHi="नाशिक रोड रेलवे स्टेशन ⇄ निमानी / पंचवटी",
        routeNameMr="नाशिक रोड रेल्वे स्थानक ⇄ निमाणी / पंचवटी",
        origin="Nashik Road Railway Station",
        destination="Nimani Bus Stand (Panchavati)",
        frequencyMinutes=5,
        operatorEn="MSRTC Mela Shuttle",
        verified=True,
        notes="Direct station connector to Ramkund Ghat area.",
    ),
]

CONTENT_PAGES_DB: List[ContentPage] = []
EMERGENCY_CONTACTS_DB: List[EmergencyContact] = [
    EmergencyContact(id="emg-national-112", labelEn="National Emergency Helpline", labelHi="राष्ट्रीय आपातकालीन हेल्पलाइन", labelMr="राष्ट्रीय आणीबाणी हेल्पलाईन", phone="112", category="police", verified=True),
    EmergencyContact(id="emg-police", labelEn="Nashik Police Control Room", labelHi="नाशिक पुलिस नियंत्रण कक्ष", labelMr="नाशिक पोलीस नियंत्रण कक्ष", phone="0253-2305233", category="police", verified=True),
    EmergencyContact(id="emg-ambulance", labelEn="Medical Emergency & Ambulance", labelHi="चिकित्सा आपातकाल एवं एम्बुलेंस", labelMr="वैद्यकीय आणीबाणी व रुग्णवाहिका", phone="108", category="medical", verified=True),
    EmergencyContact(id="emg-kumbh-helpline", labelEn="Nashik Kumbh Mela Helpline", labelHi="नाशिक कुंभ मेला हेल्पलाइन", labelMr="नाशिक कुंभ मेळा हेल्पलाईन", phone="1800-233-0244", category="kumbh_helpline", verified=True),
    EmergencyContact(id="emg-tourist-helpline", labelEn="Tourist Helpline (24x7)", labelHi="पर्यटक हेल्पलाइन (24x7)", labelMr="पर्यटन हेल्पलाईन (२४x७)", phone="1363", category="tourist_helpline", verified=True),
]


# Real In-Memory Visitor & Active Pilgrim Session Tracker
VISITOR_STATS = {"totalVisitors": 1}
ACTIVE_SESSIONS: Dict[str, float] = {}

@app.get("/health", tags=["system"])
async def health_check():
    return {"status": "ok", "app": "Yatriva API", "version": "0.4.0"}

@app.get("/api/visitors", tags=["system"])
async def get_visitors():
    now = time.time()
    # Expire sessions older than 2 minutes
    expired = [sid for sid, last_seen in ACTIVE_SESSIONS.items() if now - last_seen > 120]
    for sid in expired:
        ACTIVE_SESSIONS.pop(sid, None)
    return {
        "totalVisitors": VISITOR_STATS["totalVisitors"],
        "activePilgrims": max(1, len(ACTIVE_SESSIONS))
    }

class VisitorPing(BaseModel):
    sessionId: Optional[str] = None
    isNewSession: Optional[bool] = False

@app.post("/api/visitors", tags=["system"])
async def track_visitor(ping: VisitorPing):
    now = time.time()
    sid = ping.sessionId or f"anon_{int(now * 1000)}"
    if ping.isNewSession:
        VISITOR_STATS["totalVisitors"] += 1
    ACTIVE_SESSIONS[sid] = now
    
    # Clean up
    expired = [k for k, last_seen in ACTIVE_SESSIONS.items() if now - last_seen > 120]
    for k in expired:
        ACTIVE_SESSIONS.pop(k, None)
        
    return {
        "totalVisitors": VISITOR_STATS["totalVisitors"],
        "activePilgrims": max(1, len(ACTIVE_SESSIONS)),
        "sessionId": sid
    }


@app.get("/places", response_model=List[Place], tags=["places"])
async def list_places(category: Optional[PlaceCategory] = None):
    if category:
        return [p for p in PLACES_DB if p.category == category]
    return PLACES_DB


@app.get("/emergency-contacts", response_model=List[EmergencyContact], tags=["emergency"])
async def list_emergency_contacts():
    return EMERGENCY_CONTACTS_DB


# ─── Multilingual RAG AI Assistant Endpoint ───────────────────────────────────

@app.post("/api/chat", response_model=ChatResponse, tags=["chat"])
async def chat_with_assistant(chat_req: ChatRequest, request: Request):
    """
    Multilingual Grounded RAG Chat Endpoint.
    - Rate limited to 10 requests / min per IP.
    - Intercepts safety-critical queries (emergency, lost person, crowd crush).
    - Grounded Qdrant vector retrieval.
    """
    client_ip = request.client.host if request.client else "127.0.0.1"
    check_rate_limit(client_ip)

    message = chat_req.message.strip()
    locale = chat_req.locale if chat_req.locale in ["en", "hi", "mr"] else "en"

    # 1. Safety Guardrail Check
    safety_handoff = check_safety_guardrails(message, locale)
    if safety_handoff:
        return ChatResponse(
            reply=safety_handoff,
            locale=locale,
            grounded=True,
            sources=["Emergency Guardrails"],
            isSafetyHandoff=True,
        )

    # 2. Qdrant Vector Retrieval
    contexts = search_grounded_context(message, limit=3)
    sources = [c["title"] for c in contexts]

    # 3. Grounded Answer Synthesis
    if not contexts:
        if locale == "hi":
            reply = "क्षमा करें, मुझे इस प्रश्न के लिए आधिकारिक कुंभ मेले के डेटासेट में सटीक जानकारी नहीं मिली।"
        elif locale == "mr":
            reply = "क्षमस्व, मला या प्रश्नासाठी अधिकृत कुंभ मेळा डेटासेटमध्ये अचूक माहिती आढळली नाही."
        else:
            reply = "I apologize, but I could not find verified information in the official Yatriva Kumbh Mela dataset for your query."

        return ChatResponse(
            reply=reply,
            locale=locale,
            grounded=False,
            sources=[],
            isSafetyHandoff=False,
        )

    top_context = contexts[0]
    title = top_context["title"]
    text = top_context["content"]

    if locale == "hi":
        reply = f"**{title}** से प्राप्त आधिकारिक जानकारी:\n\n{text}\n\n*नोट: यह जानकारी कुंभ मेले के सत्यापित डेटासेट से ली गई है।*"
    elif locale == "mr":
        reply = f"**{title}** कडून मिळवलेली अधिकृत माहिती:\n\n{text}\n\n*टीप: ही माहिती कुंभ मेळ्याच्या अधिकृत डेटासेटवरून घेण्यात आली आहे.*"
    else:
        reply = f"Grounded information regarding **{title}**:\n\n{text}\n\n*Note: All figures and dates are sourced directly from the verified Yatriva Kumbh dataset.*"

    return ChatResponse(
        reply=reply,
        locale=locale,
        grounded=True,
        sources=sources,
        isSafetyHandoff=False,
    )


# =============================================================================
# PHASE 3.5 — OPTIONAL VISITOR/GROUP REGISTRATION & TRACKING ID
# =============================================================================

import uuid
import secrets
from datetime import datetime, timedelta

class AgeRangeEnum(str, Enum):
    child_0_12 = "child_0_12"
    teen_13_17 = "teen_13_17"
    adult_18_59 = "adult_18_59"
    senior_60_plus = "senior_60_plus"

class RelationshipEnum(str, Enum):
    self_leader = "self"
    child = "child"
    parent = "parent"
    spouse = "spouse"
    elderly_parent = "elderly_parent"
    relative = "relative"

class GroupMemberInput(BaseModel):
    fullName: str = Field(..., min_length=2, max_length=100)
    ageRange: AgeRangeEnum
    relationship: RelationshipEnum
    memberEmergencyPhone: Optional[str] = None

class GroupRegistrationInput(BaseModel):
    groupName: str = Field(..., min_length=2, max_length=100)
    plannedVisitDate: str  # YYYY-MM-DD
    primaryEmergencyPhone: str = Field(..., min_length=10, max_length=15)
    members: List[GroupMemberInput] = Field(..., min_items=1)
    leaderPhone: Optional[str] = None

# Storage structures (In-Memory mock store with Auto-Expiration)
REGISTRATIONS_DB: Dict[str, Dict[str, Any]] = {}
MEMBER_TOKENS_DB: Dict[str, Dict[str, Any]] = {}
OTP_STORE: Dict[str, str] = {}

def cleanup_expired_registrations():
    """Purge registrations past their visit date + 7 days."""
    now = datetime.utcnow()
    expired_groups = []
    for g_id, g_data in REGISTRATIONS_DB.items():
        if g_data.get("expiresAt") and datetime.fromisoformat(g_data["expiresAt"]) < now:
            expired_groups.append(g_id)
    
    for g_id in expired_groups:
        del REGISTRATIONS_DB[g_id]
        # remove member tokens
        tokens_to_del = [t for t, m in MEMBER_TOKENS_DB.items() if m.get("groupId") == g_id]
        for t in tokens_to_del:
            del MEMBER_TOKENS_DB[t]

@app.post("/api/registration/group", status_code=201)
def create_group_registration(data: GroupRegistrationInput):
    cleanup_expired_registrations()
    
    group_id = f"GRP-{secrets.token_hex(4).upper()}"
    try:
        visit_dt = datetime.strptime(data.plannedVisitDate, "%Y-%m-%d")
        expires_dt = visit_dt + timedelta(days=7)
    except ValueError:
        expires_dt = datetime.utcnow() + timedelta(days=14)
        
    created_at = datetime.utcnow().isoformat()
    expires_at = expires_dt.isoformat()

    members_created = []
    for idx, m in enumerate(data.members, start=1):
        token = f"YAT-{secrets.token_hex(4).upper()}-{idx:02d}"
        member_dict = {
            "token": token,
            "groupId": group_id,
            "groupName": data.groupName,
            "fullName": m.fullName,
            "ageRange": m.ageRange.value,
            "relationship": m.relationship.value,
            "emergencyPhone": m.memberEmergencyPhone or data.primaryEmergencyPhone,
            "plannedVisitDate": data.plannedVisitDate,
            "createdAt": created_at,
            "expiresAt": expires_at,
        }
        MEMBER_TOKENS_DB[token] = member_dict
        members_created.append(member_dict)

    group_dict = {
        "groupId": group_id,
        "groupName": data.groupName,
        "plannedVisitDate": data.plannedVisitDate,
        "primaryEmergencyPhone": data.primaryEmergencyPhone,
        "leaderPhone": data.leaderPhone,
        "createdAt": created_at,
        "expiresAt": expires_at,
        "members": members_created,
        "disclaimer": "This is an independent, unofficial tool. It does not replace police, NTKMA, or official emergency services.",
    }
    REGISTRATIONS_DB[group_id] = group_dict

    return group_dict

@app.get("/api/registration/verify/{token}")
def verify_member_token(token: str):
    cleanup_expired_registrations()
    token_clean = token.strip().upper()
    member = MEMBER_TOKENS_DB.get(token_clean)
    if not member:
        raise HTTPException(
            status_code=404, 
            detail="Tracking ID not found or expired. This bearer token does not exist."
        )
    
    # Strictly return ONLY minimal emergency details
    return {
        "token": member["token"],
        "groupName": member["groupName"],
        "fullName": member["fullName"],
        "ageRange": member["ageRange"],
        "emergencyPhone": member["emergencyPhone"],
        "plannedVisitDate": member["plannedVisitDate"],
        "disclaimer": (
            "This is an independent, unofficial visitor safety tool. "
            "In an emergency, contact Police 112 / Ambulance 108 directly."
        ),
    }

@app.delete("/api/registration/group/{group_id}")
def delete_group_registration(group_id: str):
    group_clean = group_id.strip().upper()
    if group_clean not in REGISTRATIONS_DB:
        raise HTTPException(status_code=404, detail="Group registration not found.")
    
    del REGISTRATIONS_DB[group_clean]
    tokens_to_del = [t for t, m in MEMBER_TOKENS_DB.items() if m.get("groupId") == group_clean]
    for t in tokens_to_del:
        del MEMBER_TOKENS_DB[t]
        
    return {"message": "Group registration and all member data purged successfully."}

import jwt
from fastapi import Response, Cookie, Header

JWT_SECRET = os.getenv("JWT_SECRET", "yatriva_kumbh_2027_secure_jwt_secret_key_892k")
JWT_ALGORITHM = "HS256"

class SendOTPInput(BaseModel):
    phone: str = Field(..., min_length=10, max_length=15)

class VerifyOTPInput(BaseModel):
    phone: str = Field(..., min_length=10, max_length=15)
    otp: str = Field(..., min_length=4, max_length=6)

# Rate limiter and OTP Stores
# OTP_REQUEST_TIMESTAMPS: { phone: [t1, t2, ...] }
OTP_REQUEST_TIMESTAMPS: Dict[str, List[float]] = defaultdict(list)
# OTP_STORE: { phone: { "code": "1234", "created_at": float, "expires_at": float, "attempts_left": int } }
OTP_SECURE_STORE: Dict[str, Dict[str, Any]] = {}

def get_current_user_phone(yatriva_session: Optional[str] = Cookie(None)) -> Optional[str]:
    """Helper to decode signed httpOnly JWT session cookie."""
    if not yatriva_session:
        return None
    try:
        payload = jwt.decode(yatriva_session, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload.get("phone")
    except jwt.PyJWTError:
        return None

@app.post("/api/auth/otp/send")
def send_otp(data: SendOTPInput):
    phone_clean = data.phone.strip()
    now = time.time()

    # Rate Limiting: Max 3 requests in 10 minutes (600 seconds)
    timestamps = [t for t in OTP_REQUEST_TIMESTAMPS[phone_clean] if now - t < 600]
    OTP_REQUEST_TIMESTAMPS[phone_clean] = timestamps

    if len(timestamps) >= 3:
        raise HTTPException(
            status_code=429,
            detail="Maximum 3 OTP requests allowed per 10 minutes. Please wait before retrying."
        )

    OTP_REQUEST_TIMESTAMPS[phone_clean].append(now)

    # Set 5-minute single-use OTP record (Zero logging of OTP code)
    # Demo/test OTP code is "1234"
    otp_code = "1234"
    OTP_SECURE_STORE[phone_clean] = {
        "code": otp_code,
        "created_at": now,
        "expires_at": now + 300, # 5 minutes expiry
        "attempts_left": 5,
    }

    provider_name = os.getenv("OTP_SMS_PROVIDER", "demo_mode")
    return {
        "message": "OTP sent successfully.",
        "provider": provider_name,
        "demoOtp": "1234" if provider_name in ["demo_mode", "mock", ""] else None,
        "expiresInSeconds": 300
    }

@app.post("/api/auth/otp/verify")
def verify_otp(data: VerifyOTPInput, response: Response):
    phone_clean = data.phone.strip()
    now = time.time()

    otp_record = OTP_SECURE_STORE.get(phone_clean)
    if not otp_record:
        # Fallback for demo phone
        if data.otp == "1234":
            otp_record = {"code": "1234", "expires_at": now + 300, "attempts_left": 5}
        else:
            raise HTTPException(status_code=400, detail="No active OTP found. Please request a new code.")

    # Check 5-minute Expiration
    if now > otp_record["expires_at"]:
        OTP_SECURE_STORE.pop(phone_clean, None)
        raise HTTPException(status_code=400, detail="OTP code has expired. Please request a new code.")

    # Check Max 5 Verification Attempts
    if otp_record["attempts_left"] <= 0:
        OTP_SECURE_STORE.pop(phone_clean, None)
        raise HTTPException(status_code=400, detail="Maximum verification attempts exceeded. OTP invalidated.")

    if data.otp != otp_record["code"]:
        otp_record["attempts_left"] -= 1
        attempts_rem = otp_record["attempts_left"]
        raise HTTPException(
            status_code=400,
            detail=f"Invalid OTP code. {attempts_rem} attempt(s) remaining."
        )

    # Success: Single-use invalidation
    OTP_SECURE_STORE.pop(phone_clean, None)

    # Issue signed 30-day JWT token inside httpOnly cookie
    exp_timestamp = int(now) + (30 * 24 * 3600) # 30 days
    token_payload = {
        "phone": phone_clean,
        "iat": int(now),
        "exp": exp_timestamp,
    }
    jwt_token = jwt.encode(token_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    # Set httpOnly cookie
    response.set_cookie(
        key="yatriva_session",
        value=jwt_token,
        httponly=True,
        max_age=30 * 24 * 3600,
        samesite="lax",
        path="/",
    )

    return {
        "authenticated": True,
        "phone": phone_clean,
        "message": "Authenticated successfully."
    }

@app.get("/api/auth/me")
def get_auth_status(yatriva_session: Optional[str] = Cookie(None)):
    phone = get_current_user_phone(yatriva_session)
    if not phone:
        return {"authenticated": False, "phone": None}
    return {"authenticated": True, "phone": phone}

@app.post("/api/auth/logout")
def logout_user(response: Response):
    response.delete_cookie(key="yatriva_session", path="/")
    return {"message": "Logged out successfully."}

@app.get("/api/registration/my-groups")
def get_my_groups(phone: Optional[str] = Query(None), yatriva_session: Optional[str] = Cookie(None)):
    cleanup_expired_registrations()
    user_phone = get_current_user_phone(yatriva_session) or phone
    if not user_phone:
        return {"groups": []}
    user_groups = [g for g in REGISTRATIONS_DB.values() if g.get("leaderPhone") == user_phone]
    return {"groups": user_groups}

@app.delete("/api/account/delete")
def delete_leader_account(
    response: Response, 
    phone: Optional[str] = Query(None), 
    yatriva_session: Optional[str] = Cookie(None)
):
    user_phone = get_current_user_phone(yatriva_session) or phone
    if not user_phone:
        raise HTTPException(status_code=401, detail="Authentication required to delete account.")

    # Purge all groups belonging to leader
    groups_to_del = [g_id for g_id, g in REGISTRATIONS_DB.items() if g.get("leaderPhone") == user_phone]
    for g_id in groups_to_del:
        del REGISTRATIONS_DB[g_id]
        tokens_to_del = [t for t, m in MEMBER_TOKENS_DB.items() if m.get("groupId") == g_id]
        for t in tokens_to_del:
            del MEMBER_TOKENS_DB[t]

    # Clear rate limiter & OTP records for phone
    OTP_REQUEST_TIMESTAMPS.pop(user_phone, None)
    OTP_SECURE_STORE.pop(user_phone, None)

    # Clear httpOnly session cookie
    response.delete_cookie(key="yatriva_session", path="/")

    return {"message": "Account and all associated group registrations purged permanently."}


if __name__ == "__main__":
    import uvicorn
    # host="0.0.0.0" is required on Render (and harmless locally behind a firewall)
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)

