"""
Yatriva — Phase 4 Grounded RAG Knowledge Pipeline
In-Memory Qdrant Vector Retrieval & Multilingual Grounded AI Engine
"""

import math
import re
from typing import List, Dict, Any
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

# Initialize in-memory Qdrant vector database client
qdrant_client = QdrantClient(":memory:")
COLLECTION_NAME = "yatriva_knowledge"
VECTOR_SIZE = 128


def _tokenize(text: str) -> List[str]:
    """Tokenize and normalize text into words."""
    return re.findall(r"\w+", text.lower())


def text_to_vector(text: str, dim: int = VECTOR_SIZE) -> List[float]:
    """
    Generates a deterministic normalized dense vector representation
    for a text string using term hashing and character n-grams.
    """
    vec = [0.0] * dim
    tokens = _tokenize(text)
    if not tokens:
        return vec

    for token in tokens:
        idx = hash(token) % dim
        vec[idx] += 1.0
        for i in range(len(token) - 1):
            sub_idx = hash(token[i : i + 2]) % dim
            vec[sub_idx] += 0.5

    # Normalize vector to unit length
    magnitude = math.sqrt(sum(v * v for v in vec))
    if magnitude > 0:
        vec = [v / magnitude for v in vec]

    return vec


KNOWLEDGE_CHUNKS: List[Dict[str, Any]] = [
    # Amrit Snan Dates
    {
        "id": 1,
        "title": "Amrit Snan Dates 2027",
        "keywords": ["snan", "date", "shahi", "amrit", "schedule", "स्नान", "तारीख", "शाही", "अमृत"],
        "content": (
            "1st Amrit Snan: 2 August 2027 (Flag Hoisting / Dhwajarohan).\n"
            "2nd Amrit Snan: 31 August 2027 (Bhadrapada Amavasya).\n"
            "3rd Amrit Snan: 11-12 September 2027 (Rishi Panchami / Vaman Jayanti).\n"
            "Note: Dates are based on traditional lunar almanac; confirm with official admin schedule closer to event."
        ),
        "category": "snan_dates",
    },
    # Ramkund Ghat
    {
        "id": 2,
        "title": "Ramkund Ghat",
        "keywords": ["ramkund", "ghat", "godavari", "ram", "asthi", "रामकुंड", "घाट", "गोदावरी"],
        "content": (
            "Ramkund Ghat on Godavari river in Nashik is the most sacred bathing ghat. Lord Rama bathed here and "
            "performed Pind Daan for King Dasharatha. Primary Shaiva and Vaishnava Amrit Snan site. "
            "Facilities include changing rooms, safety nets, life buoys, and 24x7 medical posts."
        ),
        "category": "ghat",
    },
    # Kushavarta Ghat
    {
        "id": 3,
        "title": "Kushavarta Ghat & Kund (Trimbakeshwar)",
        "keywords": ["kushavarta", "trimbak", "kund", "gautama", "कुशावर्त", "त्र्यंबकेश्वर", "कुंड"],
        "content": (
            "Kushavarta Kund at Trimbakeshwar is considered the official origin point of river Godavari. "
            "Sage Gautama held the river here with Darbha grass. Primary Snan site for Shaiva Akharas."
        ),
        "category": "ghat",
    },
    # Trimbakeshwar Temple
    {
        "id": 4,
        "title": "Trimbakeshwar Shiva Temple",
        "keywords": ["trimbakeshwar", "jyotirlinga", "shiva", "temple", "त्र्यंबकेश्वर", "ज्योतिर्लिंग", "शिव"],
        "content": (
            "One of the 12 sacred Jyotirlinga shrines of Lord Shiva, located 28 km southwest of Nashik city. "
            "Features a unique three-faced lingam embodying Brahma, Vishnu, and Mahesh (Shiva). Built in black basalt stone."
        ),
        "category": "temple",
    },
    # Kalaram Temple & Panchavati
    {
        "id": 5,
        "title": "Panchavati and Kalaram Temple",
        "keywords": ["panchavati", "kalaram", "sita gufa", "rama", "पंचवटी", "काळाराम", "सीता गुफा"],
        "content": (
            "Panchavati is the sacred grove of five Banyan trees where Lord Rama, Sita, and Lakshmana lived during exile. "
            "Includes Sita Gufa cave and Kalaram Temple, an 18th-century black stone Rama shrine."
        ),
        "category": "ramayana",
    },
    # The Akharas
    {
        "id": 6,
        "title": "The Akharas and Shahi Snan Procession",
        "keywords": ["akhara", "peshwai", "shahi", "naga", "sadhu", "अखाडा", "पेशवाई", "नागा", "साधू"],
        "content": (
            "13 ancient monastic orders (Shaiva, Vaishnava Ani, Udasin) march in grand Peshwai processions with elephants, "
            "horses, and brass bands. They take precedence in bathing during Royal Shahi Snan hours."
        ),
        "category": "akharas",
    },
    # Transport 28km Split
    {
        "id": 7,
        "title": "Nashik-Trimbakeshwar 28km Logistics & Buses",
        "keywords": ["bus", "transport", "shuttle", "28km", "cbs", "नाशिक", "बस", "वाहतूक", "गाडी"],
        "content": (
            "Kumbh Mela operates twin hubs 28 km apart along NH848: Nashik City (Godavari Ramkund) and Trimbakeshwar. "
            "MSRTC operates 2,000+ shuttle buses between outer ring parking lots and inner drop-off points."
        ),
        "category": "transport",
    },
    # Parking & Outer Ring Zones
    {
        "id": 8,
        "title": "Parking Zones & Vehicle Movement",
        "keywords": ["parking", "car", "vehicle", "zone", "ring road", "पार्किंग", "गाडी", "वाहन"],
        "content": (
            "Private vehicles are restricted inside central Mela zones on Snan days. "
            "Park at Ring Parking Zone A (Nashik Road), Zone B (Panchavati / Tapovan), or Zone C (Trimbak Road) "
            "and board free electric shuttle buses."
        ),
        "category": "parking",
    },
    # Emergency & Lost Child Recovery
    {
        "id": 9,
        "title": "Emergency Helplines, Police & Medical Posts",
        "keywords": ["emergency", "police", "doctor", "ambulance", "lost", "helpline", "आपत्कालीन", "पोलीस", "रुग्णवाहिका"],
        "content": (
            "For medical emergency dial 108. For police dial 112.\n"
            "24x7 Medical Aid Posts are located at Ramkund, Tapovan, CBS, and Trimbakeshwar Kushavarta.\n"
            "Lost & Found Registration booths with digital wristband tracking operate at all major transit hubs."
        ),
        "category": "emergency",
    },
    # Senior Citizens & Divyangjan (Accessibility)
    {
        "id": 10,
        "title": "Accessibility Facilities for Senior Citizens & Divyangjan",
        "keywords": ["wheelchair", "senior", "divyang", "handicapped", "elderly", "ज्येष्ठ नागरिक", "दिव्यांग"],
        "content": (
            "Battery-operated golf carts operate along designated corridors (Ramkund to Tapovan). "
            "Ramps and wheelchair-accessible bathing enclosures are available at Ramkund Ghat Section 3."
        ),
        "category": "accessibility",
    },
]


def init_vector_store():
    """Initializes Qdrant collection and indexes all Yatriva knowledge chunks."""
    if not qdrant_client.collection_exists(COLLECTION_NAME):
        qdrant_client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE),
        )

    points = []
    for item in KNOWLEDGE_CHUNKS:
        text_payload = f"{item['title']} {' '.join(item['keywords'])} {item['content']}"
        vec = text_to_vector(text_payload)
        points.append(
            PointStruct(
                id=item["id"],
                vector=vec,
                payload={
                    "title": item["title"],
                    "content": item["content"],
                    "category": item["category"],
                    "keywords": item["keywords"],
                },
            )
        )

    qdrant_client.upsert(collection_name=COLLECTION_NAME, points=points)


try:
    init_vector_store()
except Exception as e:
    print(f"Qdrant vector store initialization note: {e}")


def search_grounded_context(query: str, limit: int = 3) -> List[Dict[str, Any]]:
    """
    Performs cosine similarity vector search in Qdrant with keyword fallback.
    Returns top grounded knowledge chunks.
    """
    query_vec = text_to_vector(query)
    contexts = []

    try:
        search_results = qdrant_client.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_vec,
            limit=limit,
        )

        for res in search_results:
            if res.payload and res.score > 0.15:
                contexts.append({
                    "title": res.payload.get("title", ""),
                    "content": res.payload.get("content", ""),
                    "score": res.score,
                })
    except Exception:
        pass

    # Keyword matching fallback if vector search has low confidence or yields no result
    if not contexts:
        tokens = set(_tokenize(query))
        matched = []
        for chunk in KNOWLEDGE_CHUNKS:
            score = 0
            for kw in chunk["keywords"]:
                if kw in query.lower():
                    score += 2
            for token in tokens:
                if token in chunk["content"].lower():
                    score += 1

            if score > 0:
                matched.append((score, chunk))

        matched.sort(key=lambda x: x[0], reverse=True)
        for score, chunk in matched[:limit]:
            contexts.append({
                "title": chunk["title"],
                "content": chunk["content"],
                "score": float(score),
            })

    return contexts
