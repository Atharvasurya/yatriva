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
        "title": "Amrit Snan & Shahi Snan Dates 2027",
        "keywords": ["snan", "date", "shahi", "amrit", "schedule", "dhwajarohan", "flag", "स्नान", "तारीख", "शाही", "अमृत", "तिथी"],
        "content": (
            "1st Shahi / Amrit Snan: 2 August 2027 (Monday, Somvati Amavasya — Nashik Ramkund & Trimbakeshwar Kushavarta).\n"
            "2nd Shahi / Amrit Snan: 31 August 2027 (Tuesday, Shravan Amavasya / Pithori Amavasya — Nashik & Trimbakeshwar).\n"
            "3rd Shahi / Amrit Snan: 11-12 September 2027 (Bhadrapada Shukla Ekadashi — Sep 11 at Nashik Ramkund, Sep 12 at Trimbakeshwar Kushavarta for Shaiva Sadhus).\n"
            "Dhwajarohan (Flag Hoisting): 31 October 2026 (Official commencement).\n"
            "Kumbh Mela Duration: 31 October 2026 to 24 July 2028."
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
            "performed Asthi-Visarjan for King Dasharatha. Primary Shaiva and Vaishnava Amrit Snan site in Nashik city. "
            "Facilities include changing cubicles, safety railings, life buoys, and 24x7 medical & police posts."
        ),
        "category": "ghat",
    },
    # Kushavarta Ghat
    {
        "id": 3,
        "title": "Kushavarta Ghat & Kund (Trimbakeshwar)",
        "keywords": ["kushavarta", "trimbak", "kund", "gautama", "कुशावर्त", "त्र्यंबकेश्वर", "कुंड"],
        "content": (
            "Kushavarta Kund at Trimbakeshwar is the revered origin pool of river Godavari. "
            "Sage Gautama held the river here with Darbha grass. Primary Shahi Snan site for Shaiva Akharas."
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
            "Includes Sita Gufa underground cave and Kalaram Temple, an 18th-century black stone Rama shrine built in 1782 AD."
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
            "horses, and brass bands. They take royal precedence in bathing during Shahi Snan hours."
        ),
        "category": "akharas",
    },
    # Transport 28km Split
    {
        "id": 7,
        "title": "Nashik-Trimbakeshwar 28km Logistics & Buses",
        "keywords": ["bus", "transport", "shuttle", "28km", "cbs", "msrtc", "nashik road", "नाशिक", "बस", "वाहतूक", "गाडी"],
        "content": (
            "Kumbh Mela operates twin hubs 28 km apart along NH848: Nashik City (Godavari Ramkund) and Trimbakeshwar. "
            "MSRTC operates direct Mela Shuttles every 5-10 minutes between Nashik Road Station, CBS, Tapovan, and Trimbakeshwar."
        ),
        "category": "transport",
    },
    # Parking & Outer Ring Zones
    {
        "id": 8,
        "title": "Parking Zones & Outer Ring Movement",
        "keywords": ["parking", "car", "vehicle", "zone", "ring road", "vilholi", "adgaon", "nilgiri", "पार्किंग", "गाडी", "वाहन"],
        "content": (
            "Private vehicles are restricted from entering the inner city on Snan days. "
            "Designated outer parking hubs include Vilholi (Mumbai Highway, 15,000 capacity), Adgaon (Agra Highway, 12,000 capacity), "
            "Nilgiri Baug / Tapovan (Aurangabad Rd, 8,000 capacity), and Dugaon Phata (Trimbak Rd, 10,000 capacity) with high-frequency feeder shuttles."
        ),
        "category": "parking",
    },
    # Emergency & Helplines
    {
        "id": 9,
        "title": "Verified Emergency Helplines, Police & Medical Posts",
        "keywords": ["emergency", "police", "doctor", "ambulance", "lost", "helpline", "112", "108", "101", "1363", "आपत्कालीन", "पोलीस", "रुग्णवाहिका"],
        "content": (
            "National Emergency: 112. Medical Emergency & Ambulance: 108. Police Control Room: 112 / 0253-2305233. Fire: 101.\n"
            "Nashik Kumbh Mela Helpline: 1800-233-0244 / 1916. National 24x7 Tourist Helpline: 1363. Disaster Management: 1077 / 0253-2317151. Railway Helpline: 139.\n"
            "24x7 Medical Aid Posts are located at Ramkund Ghat, District Civil Hospital, Tapovan Sadhugram, and Trimbakeshwar Sub-District Hospital."
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


VERIFIED_IMAGES = [
    {
        "id": "ramkund",
        "title": "Ramkund Sacred Ghat (Godavari)",
        "url": "/images/ghats/ramkund.jpg",
        "category": "ghat",
        "keywords": ["ramkund", "ram kund", "godavari", "bathing", "amrit snan", "shahi snan", "रामकुंड", "गोदावरी", "स्नान", "घाट"],
    },
    {
        "id": "kushavarta",
        "title": "Kushavarta Kund (Trimbakeshwar)",
        "url": "/images/ghats/kushavarta.jpg",
        "category": "ghat",
        "keywords": ["kushavarta", "kushawarta", "trimbak", "kund", "gautama", "कुशावर्त", "त्र्यंबकेश्वर", "कुंड"],
    },
    {
        "id": "trimbakeshwar",
        "title": "Trimbakeshwar Shiva Jyotirlinga Temple",
        "url": "/images/temples/trimbakeshwar.jpg",
        "category": "temple",
        "keywords": ["trimbakeshwar", "jyotirlinga", "shiva", "mahadev", "brahmagiri", "त्र्यंबकेश्वर", "ज्योतिर्लिंग", "शिव", "महादेव"],
    },
    {
        "id": "kalaram",
        "title": "Historic Shree Kalaram Mandir (Panchavati)",
        "url": "/images/temples/kalaram.jpg",
        "category": "temple",
        "keywords": ["kalaram", "panchavati", "ram mandir", "lord rama", "sita", "lakshman", "काळाराम", "पंचवटी", "राम मंदिर"],
    },
    {
        "id": "sita_gufa",
        "title": "Sita Gufa & Panchavati Tapovan",
        "url": "/images/temples/sita_gufa.jpg",
        "category": "temple",
        "keywords": ["sita gufa", "cave", "panchavati", "exile", "tapovan", "सीता गुफा", "गुहा"],
    },
    {
        "id": "saptashringi",
        "title": "Shree Saptashringi Nivasini Devi (Vani Shakti Peetha)",
        "url": "/images/temples/saptashringi.jpg",
        "category": "temple",
        "keywords": ["saptashringi", "devi", "vani", "shakti peeth", "सप्तशृंगी", "देवी"],
    },
    {
        "id": "kapaleshwar",
        "title": "Kapaleshwar Mahadev Temple",
        "url": "/images/temples/kapaleshwar.jpg",
        "category": "temple",
        "keywords": ["kapaleshwar", "nandi", "shiva", "कपालेश्वर"],
    },
    {
        "id": "muktidham",
        "title": "Muktidham Temple (Nashik Road)",
        "url": "/images/temples/muktidham.jpg",
        "category": "temple",
        "keywords": ["muktidham", "nashik road", "marble", "मुक्तिधाम"],
    },
    {
        "id": "navshya_ganpati",
        "title": "Navshya Ganpati Temple (Anandvalli)",
        "url": "/images/temples/navshya_ganpati.jpg",
        "category": "temple",
        "keywords": ["navshya ganpati", "ganesh", "ganpati", "नवश्या गणपती"],
    },
    {
        "id": "someshwar",
        "title": "Someshwar Shiva Temple & Waterfall",
        "url": "/images/temples/someshwar.jpg",
        "category": "temple",
        "keywords": ["someshwar", "waterfall", "सोमेश्वर"],
    },
    {
        "id": "godaghat_hero",
        "title": "Nashik Simhastha Kumbh Mela & Godavari Aarti",
        "url": "/images/godaghat_hero.jpg",
        "category": "kumbh",
        "keywords": ["kumbh", "kumbh mela", "simhastha", "aarti", "crowd", "कुंभ", "सिंहस्थ", "आरती"],
    },
]


def find_relevant_images(query: str, reply: str) -> List[Dict[str, str]]:
    combined = f"{query} {reply}".lower()
    matched = []
    seen = set()

    for img in VERIFIED_IMAGES:
        for kw in img["keywords"]:
            if kw in combined:
                if img["id"] not in seen:
                    seen.add(img["id"])
                    matched.append({
                        "id": img["id"],
                        "title": img["title"],
                        "url": img["url"],
                        "category": img["category"],
                    })
                break

    return matched[:2]

