"""
Yatriva — Phase 4.1 Full-Site Grounded RAG Knowledge Pipeline
In-Memory Qdrant Vector Retrieval, Complete Content Corpus & Auto-Reindexing Engine
"""

import math
import re
import time
from datetime import datetime
from typing import List, Dict, Any, Optional
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

# Initialize in-memory Qdrant vector database client
qdrant_client = QdrantClient(":memory:")
COLLECTION_NAME = "yatriva_knowledge"
VECTOR_SIZE = 128

LAST_REINDEX_TIME: float = time.time()


STOP_WORDS = {
    "the", "is", "in", "of", "and", "a", "to", "for", "with", "on", "at", "by",
    "this", "that", "an", "it", "as", "are", "was", "be", "or", "from", "what",
    "where", "how", "when", "why", "who", "which", "there", "their", "can", "tell", "me"
}


def _tokenize(text: str) -> List[str]:
    """Tokenize and normalize text into words, omitting common stop words."""
    words = re.findall(r"\w+", text.lower())
    return [w for w in words if w not in STOP_WORDS and len(w) > 2]


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


# ─── COMPLETE SITE CORPUS (Part 1 Expansion) ──────────────────────────────────
# Structured chunks with full source traceability (page, section, is_practical_safety)

FULL_SITE_CHUNKS: List[Dict[str, Any]] = [
    # ── 1. Snan Dates & Flag Hoisting ─────────────────────────────────────────
    {
        "id": "snan-schedule-2027",
        "title": "Amrit Snan & Shahi Snan Schedule 2027",
        "category": "snan_dates",
        "is_practical_safety": True,
        "page": "/en",
        "section": "Key Amrit Snan Dates",
        "keywords": [
            "snan", "date", "shahi", "amrit", "schedule", "dhwajarohan", "flag", "timings",
            "स्नान", "तारीख", "शाही", "अमृत", "तिथी", "वेळापत्रक"
        ],
        "content": (
            "1st Shahi / Amrit Snan: 2 August 2027 (Monday, Somvati Amavasya — Nashik Ramkund & Trimbakeshwar Kushavarta).\n"
            "2nd Shahi / Amrit Snan: 31 August 2027 (Tuesday, Shravan Amavasya / Pithori Amavasya — Nashik & Trimbakeshwar).\n"
            "3rd Shahi / Amrit Snan: 11-12 September 2027 (Bhadrapada Shukla Ekadashi — Sep 11 at Nashik Ramkund, Sep 12 at Trimbakeshwar Kushavarta for Shaiva Sadhus).\n"
            "Dhwajarohan (Flag Hoisting): 31 October 2026 (Official commencement).\n"
            "Kumbh Mela Duration: 31 October 2026 to 24 July 2028."
        ),
    },

    # ── 2. Ghats & Sacred Water Bodies ─────────────────────────────────────────
    {
        "id": "ghat-ramkund",
        "title": "Ramkund Sacred Ghat (Godavari, Nashik)",
        "category": "ghat",
        "is_practical_safety": True,
        "page": "/en/places/ramkund",
        "section": "Overview & Facilities",
        "keywords": [
            "ramkund", "ghat", "godavari", "ram", "asthi", "bathing", "changing room",
            "रामकुंड", "घाट", "गोदावरी", "अस्थी", "पिंडदान", "स्नान"
        ],
        "content": (
            "Ramkund Ghat on the Godavari river in Nashik is the most sacred bathing ghat. Lord Rama bathed here and "
            "performed Asthi-Visarjan for King Dasharatha. Primary Shaiva and Vaishnava Amrit Snan site in Nashik city. "
            "Facilities include free women's changing cubicles, safety railings, non-slip rubber mats, life buoys, "
            "and 24x7 medical & police assistance posts."
        ),
    },
    {
        "id": "ghat-kushavarta",
        "title": "Kushavarta Kund & Ghat (Trimbakeshwar)",
        "category": "ghat",
        "is_practical_safety": True,
        "page": "/en/places/kushavarta",
        "section": "Sacred Kund & Bathing",
        "keywords": [
            "kushavarta", "trimbak", "kund", "gautama", "shaiva", "bathing",
            "कुशावर्त", "त्र्यंबकेश्वर", "कुंड", "गौतम"
        ],
        "content": (
            "Kushavarta Kund at Trimbakeshwar is the revered origin pool of the holy river Godavari, 28 km from Nashik. "
            "Sage Gautama held the river here with Darbha (Kusha) grass. It is the primary Shahi Snan site for Shaiva Akharas. "
            "Equipped with perimeter iron chains, depth markers, life guards, and dedicated ingress/egress steps."
        ),
    },
    {
        "id": "ghat-ahilyaghat",
        "title": "Ahilyabai Holkar Heritage Ghat",
        "category": "ghat",
        "is_practical_safety": True,
        "page": "/en/places/ahilyaghat",
        "section": "Heritage & Bathing",
        "keywords": ["ahilya", "holkar", "heritage", "ghat", "godavari", "अहिल्याबाई", "घाट"],
        "content": (
            "Ahilyabai Holkar Ghat features stone masonry steps built by Maharani Ahilyabai in the 18th century. "
            "Serves as an overflow bathing ghat adjacent to Ramkund to disperse heavy crowds on peak Snan days."
        ),
    },

    # ── 3. Sacred Temples ──────────────────────────────────────────────────────
    {
        "id": "temple-trimbakeshwar",
        "title": "Shree Trimbakeshwar Shiva Jyotirlinga Temple",
        "category": "temple",
        "is_practical_safety": True,
        "page": "/en/places/trimbakeshwar",
        "section": "Temple Darshan & Timings",
        "keywords": [
            "trimbakeshwar", "jyotirlinga", "shiva", "temple", "brahmagiri", "darshan",
            "त्र्यंबकेश्वर", "ज्योतिर्लिंग", "शिव", "मंदिर", "दर्शन"
        ],
        "content": (
            "One of the 12 sacred Jyotirlinga shrines of Lord Shiva, located 28 km southwest of Nashik city at the foot of Mt. Brahmagiri. "
            "Features a unique three-faced lingam embodying Brahma, Vishnu, and Mahesh. Built in solid black basalt stone by Peshwa Balaji Baji Rao. "
            "Darshan timings: 5:30 AM to 9:00 PM. Special queue corridors are active during Kumbh Mela."
        ),
    },
    {
        "id": "temple-kalaram",
        "title": "Shree Kalaram Mandir (Panchavati)",
        "category": "temple",
        "is_practical_safety": True,
        "page": "/en/places/kalaram",
        "section": "Mandir Architecture & Worship",
        "keywords": ["kalaram", "rama", "mandir", "panchavati", "काळाराम", "राम", "मंदिर", "पंचवटी"],
        "content": (
            "Historic 18th-century temple dedicated to Lord Rama, Goddess Sita, and Lakshmana, carved completely from black basalt stone. "
            "Constructed by Sardar Rangrao Odhekar in 1782. Features 70-foot high gold-plated copper kalasha and 84 pillars. Located in Panchavati."
        ),
    },
    {
        "id": "temple-sita-gufa",
        "title": "Sita Gufa & Tapovan Penance Grove",
        "category": "temple",
        "is_practical_safety": True,
        "page": "/en/places/sita-gufa",
        "section": "Cave Shrine & Exile Site",
        "keywords": ["sita gufa", "cave", "panchavati", "exile", "सीता गुफा", "गुहा", "तपोवन"],
        "content": (
            "Sita Gufa is an underground cave sanctum in Panchavati where Goddess Sita worshipped Lord Shiva during the 14-year exile. "
            "Narrow ancient tunnel leads to Shiva Lingam and Ram-Sita-Lakshman idols. Nearby Tapovan is where Lakshmana severed Surpanakha's nose."
        ),
    },
    {
        "id": "temple-kapaleshwar",
        "title": "Kapaleshwar Mahadev Temple",
        "category": "temple",
        "is_practical_safety": True,
        "page": "/en/places/kapaleshwar",
        "section": "Temple Details",
        "keywords": ["kapaleshwar", "nandi", "shiva", "कपालेश्वर", "नंदी"],
        "content": (
            "One of the rarest Shiva temples in the world without a Nandi statue in front. According to legend, Lord Shiva accepted Nandi "
            "as his Guru here to atone for Brahma-hatya, hence Nandi was given an elevated guru seat rather than sitting in front as a vahana."
        ),
    },
    {
        "id": "temple-muktidham",
        "title": "Muktidham Temple (Nashik Road)",
        "category": "temple",
        "is_practical_safety": True,
        "page": "/en/places/muktidham",
        "section": "Marble Temple & Replicas",
        "keywords": ["muktidham", "nashik road", "marble", "geeta", "मुक्तिधाम"],
        "content": (
            "Constructed from pure white Makrana marble, housing life-size replicas of all 12 Jyotirlinga shrines and the 18 chapters of "
            "the Bhagavad Gita inscribed on its walls. Located 2 km from Nashik Road Railway Station."
        ),
    },

    # ── 4. Culture & Heritage Articles (cultureData.ts) ────────────────────────
    {
        "id": "culture-godavari-origin",
        "title": "Culture & Heritage: The Sacred Godavari — Dakshin Ganga",
        "category": "culture",
        "is_practical_safety": False,
        "page": "/en/culture/godavari",
        "section": "Brahmagiri Origin & Celestial Merit",
        "keywords": ["godavari", "dakshin ganga", "brahmagiri", "gautama", "simha rashi", "jupiter", "गोदावरी", "दक्षिण गंगा", "ब्रह्मगिरी"],
        "content": (
            "The Godavari, revered as 'Dakshin Ganga' (Ganga of the South), is India's second longest river. Sage Gautama performed "
            "severe penance on Brahmagiri hill in Trimbakeshwar to bring Goddess Ganga down to purify the land. "
            "When Jupiter (Guru) enters the astrological sign of Leo (Simha Rashi) every 12 years, celestial nectar (Amrit) sanctifies the river, "
            "making Kumbh Snan at Ramkund or Kushavarta a supreme path to karmic purification."
        ),
    },
    {
        "id": "culture-panchavati-ramayana",
        "title": "Culture & Heritage: Panchavati — Land of Ramayana Exile",
        "category": "culture",
        "is_practical_safety": False,
        "page": "/en/culture/panchavati",
        "section": "Five Banyan Trees & Aranya Kanda",
        "keywords": ["panchavati", "banyan", "aranya kanda", "surpanakha", "ravana", "exile", "पंचवटी", "रामायण", "वनवास"],
        "content": (
            "Panchavati is named after five sacred Banyan (Vata) trees on the northern bank of Godavari in Nashik. "
            "During exile, Lord Rama built a hermitage here with Sita and Lakshmana upon Sage Agastya's advice. "
            "Pivotal events of the Aranya Kanda unfolded here, including Lakshmana disfiguring Surpanakha and Ravana's golden deer deceit."
        ),
    },
    {
        "id": "culture-ramkund-asthi",
        "title": "Culture & Heritage: Ramkund — Asthi Visarjan & Ancestral Rites",
        "category": "culture",
        "is_practical_safety": False,
        "page": "/en/culture/ramkund",
        "section": "Pind Daan & Historical Reconstruction",
        "keywords": ["ramkund", "asthi visarjan", "pind daan", "shahu maharaj", "chintamanrao raste", "रामकुंड", "अस्थी विसर्जन", "श्राद्ध"],
        "content": (
            "Ramkund marks the spot where Lord Rama took daily baths and conducted final ancestral rites (Pind Daan) for his father Dasharatha. "
            "Rebuilt in 1696 by Chhatrapati Shahu Maharaj's commander Chintamanrao Raste. Bone ashes immersed here dissolve swiftly due to natural "
            "mineral currents. During Kumbh, millions converge for sacred Amrit dips alongside adjoining Laxmankund and Sita Kund."
        ),
    },
    {
        "id": "culture-trimbakeshwar-jyotirlinga",
        "title": "Culture & Heritage: Trimbakeshwar — The Three-Faced Jyotirlinga",
        "category": "culture",
        "is_practical_safety": False,
        "page": "/en/culture/trimbakeshwar",
        "section": "Holy Trinity & Peshwa Architecture",
        "keywords": ["trimbakeshwar", "three faced", "trinity", "brahma vishnu mahesh", "peshwa balaji baji rao", "त्र्यंबकेश्वर", "त्रिमुख"],
        "content": (
            "Trimbakeshwar is distinctive among all 12 Jyotirlingas because its lingam has three faces representing the Hindu Trinity: "
            "Lord Brahma the creator, Lord Vishnu the preserver, and Lord Mahesh (Shiva) the transformer. Constructed from black basalt "
            "by Peshwa Balaji Baji Rao in the 18th century, it stands beside Kushavarta Kund where Sage Gautama gathered Ganga."
        ),
    },
    {
        "id": "culture-akharas-peshwai",
        "title": "Culture & Heritage: The Akharas & Shahi Snan Tradition",
        "category": "culture",
        "is_practical_safety": False,
        "page": "/en/culture/akharas",
        "section": "Monastic Orders & Peshwai Processions",
        "keywords": ["akhara", "peshwai", "shahi snan", "naga sadhu", "adi shankaracharya", "shaiva", "vaishnava ani", "udasin", "अखाडा", "पेशवाई"],
        "content": (
            "Founded by Adi Shankaracharya in the 8th century to safeguard Sanatana Dharma, the 13 Akharas comprise three sects: "
            "Shaiva Akharas (Juna, Niranjani, Mahanirvani), Vaishnava Ani Akharas (Nirmohi, Nirvani, Digambar), and Udasin Akharas. "
            "They march in grand Peshwai processions with caparisoned elephants, horses, and brass bands, and hold exclusive first bathing "
            "privilege during early morning Shahi Snan hours."
        ),
    },

    # ── 5. Crowd Safety Guide (crowdSafety) ────────────────────────────────────
    {
        "id": "safety-crowd-water-edge",
        "title": "Crowd Safety: Never Sit or Sleep at the Water's Edge",
        "category": "crowd_safety",
        "is_practical_safety": True,
        "page": "/en/crowd-safety",
        "section": "Surge Danger Zone (Rule 01)",
        "keywords": ["crowd", "water edge", "sleep", "trampling", "surge", "steps", "गर्दी", "घाट", "धोका"],
        "content": (
            "Rule: Avoid resting, sitting, or sleeping along the immediate riverbank steps during peak Amrit Snan days.\n"
            "Reason: Sudden dawn or night crowds rushing toward holy waters can cause fatal trampling before resting pilgrims on the ground can stand up. "
            "Always sleep only in designated holding grounds or Sadhugram shelters."
        ),
    },
    {
        "id": "safety-crowd-diagonal-surge",
        "title": "Crowd Safety: Move Diagonally with Crowd Surges",
        "category": "crowd_safety",
        "is_practical_safety": True,
        "page": "/en/crowd-safety",
        "section": "Flow Dynamics (Rule 02)",
        "keywords": ["crowd surge", "diagonal", "crush", "breathing space", "boxer stance", "गर्दीची लाट", "चेंगराचेंगरी"],
        "content": (
            "Rule: If caught in a sudden crowd wave or surge, keep your feet moving and drift diagonally toward the sides/edges.\n"
            "Reason: Never push straight back against the surge. Keep your arms bent across your chest like a boxer to preserve ribcage breathing space "
            "against lateral compression."
        ),
    },
    {
        "id": "safety-crowd-children-hands-free",
        "title": "Crowd Safety: Keep Hands Free & Protect Children",
        "category": "crowd_safety",
        "is_practical_safety": True,
        "page": "/en/crowd-safety",
        "section": "Family Safety (Rule 03)",
        "keywords": ["children", "kids", "hands free", "lost child", "family", "खांद्यावर", "मुलं", "लहान मुले"],
        "content": (
            "Rule: Do not carry loose luggage or hold children by the hand alone in thick crowds.\n"
            "Reason: Carry children high and securely on shoulders, or position them sandwiched between two adults. Keep backpacks on your back "
            "so both hands remain free to maintain balance."
        ),
    },
    {
        "id": "safety-crowd-fall-action",
        "title": "Crowd Safety: If You Fall, Rise or Move to Fixed Structures",
        "category": "crowd_safety",
        "is_practical_safety": True,
        "page": "/en/crowd-safety",
        "section": "Immediate Fall Action (Rule 04)",
        "keywords": ["fall", "stampede", "crawl", "pillar", "railing", "खाली पडल्यास", "पडणे"],
        "content": (
            "Rule: If you fall, get back onto your feet immediately. If unable to stand, curl into a ball covering your head and crawl toward a solid pillar or railing.\n"
            "Reason: Lying flat makes you invisible to the crowd flow. Fixed stone pillars and sturdy railings break the crowd wave and provide structural protection."
        ),
    },
    {
        "id": "safety-crowd-exit-routes",
        "title": "Crowd Safety: Spot Nearest Exits Before Entering Ghats",
        "category": "crowd_safety",
        "is_practical_safety": True,
        "page": "/en/crowd-safety",
        "section": "Spatial Awareness & Exits (Rule 05)",
        "keywords": ["exit", "evacuation", "gates", "bottleneck", "बाहेर पडण्याचा मार्ग", "मार्ग"],
        "content": (
            "Rule: Always identify at least two alternate side evacuation paths and emergency exits before entering dense ghat corridors.\n"
            "Reason: Primary entry gates often bottleneck. Knowing secondary exit routes allows rapid, orderly egress if crowd density surges."
        ),
    },

    # ── 6. Water Safety Guide (waterSafety) ────────────────────────────────────
    {
        "id": "safety-water-dam-depth",
        "title": "Water Safety: Dam Release & River Depth Advisory",
        "category": "water_safety",
        "is_practical_safety": True,
        "page": "/en/water-safety",
        "section": "Dam Release & Safe Zones",
        "keywords": ["dam", "discharge", "gangapur", "darna", "current", "depth", "drowning", "पाणी", "धरण", "प्रवाह"],
        "content": (
            "Dam Advisory: Gangapur and Darna dams regulate Godavari water levels. Sirens sound 30 minutes prior to discharge increases.\n"
            "Safe Bathing Rules: Bathe only within barricaded iron chain zones with depth under 4 feet. Do not venture past the yellow buoy line. "
            "Non-slip mats are installed on wet steps."
        ),
    },
    {
        "id": "safety-water-ndrf-facilities",
        "title": "Water Safety: NDRF Lifeguards, Changing Rooms & Footwear",
        "category": "water_safety",
        "is_practical_safety": True,
        "page": "/en/water-safety",
        "section": "Lifeguard Patrol & Amenities",
        "keywords": ["ndrf", "sdrf", "lifeguard", "boats", "changing room", "footwear", "वस्त्र बदल", "पादत्राणे"],
        "content": (
            "NDRF & SDRF: Motorized rescue speedboats and deep-water divers patrol Ramkund and Kushavarta 24x7.\n"
            "Amenities: Free women's changing cubicles (वस्त्र बदल कक्ष) are situated within 50m of every ghat. "
            "Free footwear safe keeps (चरण पादुका स्टैंड) operate at all entry gates to prevent stampedes over lost sandals."
        ),
    },

    # ── 7. Weather, Heat & Health (weatherHealth) ──────────────────────────────
    {
        "id": "safety-weather-hydration",
        "title": "Pilgrim Health: Hydration, Water Kiosks & ORS",
        "category": "weather_health",
        "is_practical_safety": True,
        "page": "/en/weather-health",
        "section": "Hydration Points & Heat Advisory",
        "keywords": ["weather", "heat", "sunstroke", "ors", "water kiosk", "drinking water", "उष्माघात", "पिण्याचे पाणी"],
        "content": (
            "Hydration: Over 250 free RO drinking water stations (जल सेवा) and ORS electrolyte distribution kiosks operate across Mela routes.\n"
            "Heatstroke Signs: Dizziness, rapid pulse, heavy sweating, muscle cramps, and extreme thirst.\n"
            "Immediate Action: Move to shade immediately, loosen tight clothing, sip cool ORS water, and report to the nearest Red Cross / Mela Medical Post."
        ),
    },
    {
        "id": "safety-health-packing-checklist",
        "title": "Pilgrim Packing Checklist & Safety Pass",
        "category": "weather_health",
        "is_practical_safety": True,
        "page": "/en/weather-health",
        "section": "Essential Checklist",
        "keywords": ["packing", "checklist", "safety pass", "medicine", "id card", "umbrella", "साहित्य", "औषधे"],
        "content": (
            "Top 5 Pilgrim Essentials:\n"
            "1. Reusable water bottle or hydration pouch.\n"
            "2. Compact umbrella or light raincoat (monsoon season in August/September).\n"
            "3. Laminated Pilgrim Safety Card with emergency contact numbers.\n"
            "4. 5-day supply of personal prescription medications.\n"
            "5. Modest emergency cash reserve (mobile UPI networks may experience congestive latency in mega-crowds)."
        ),
    },

    # ── 8. Accessibility & Senior Citizens (accessibility) ─────────────────────
    {
        "id": "safety-accessibility-facilities",
        "title": "Accessibility Guide: Senior Citizens & Divyangjan",
        "category": "accessibility",
        "is_practical_safety": True,
        "page": "/en/accessibility",
        "section": "Step-Free Corridors & Golf Carts",
        "keywords": ["wheelchair", "senior", "divyang", "elderly", "e-rickshaw", "golf cart", "ramp", "ज्येष्ठ नागरिक", "दिव्यांग", "व्हीलचेअर"],
        "content": (
            "Step-Free Corridors: Dedicated ramp routes bypass steep riverfront stairs at Ramkund (Section 3) and Kushavarta.\n"
            "Free Electric Mobility: Complimentary battery golf carts and E-rickshaws transfer seniors (60+) and persons with disabilities "
            "between Outer Ring cordons and inner sanctums.\n"
            "Rest Lounges (विश्राम कक्ष): Air-cooled resting shelters with drinking water and basic geriatric triage."
        ),
    },
    {
        "id": "safety-accessibility-medical-insulin",
        "title": "Accessibility: Insulin Cold Storage & Elderly Medical Points",
        "category": "accessibility",
        "is_practical_safety": True,
        "page": "/en/accessibility",
        "section": "Insulin Storage & Senior Helplines",
        "keywords": ["insulin", "cold storage", "blood pressure", "glucose", "medical kiosk", "इन्सुलिन", "मधुमेह"],
        "content": (
            "Insulin Storage: Refrigerated cold-chain storage lockers for insulin pens and temperature-sensitive medications are available "
            "at Ramkund Medical Post, District Civil Hospital, and Trimbakeshwar Sub-District Hospital.\n"
            "Free vitals monitoring (Blood Pressure & Blood Sugar) kiosks operate at all senior citizen rest centers."
        ),
    },

    # ── 9. Transport Logistics & Outer Parking (trafficAdvisory / transport) ───
    {
        "id": "transport-parking-zones",
        "title": "Outer Ring Parking Hubs & Vehicle Restrictions",
        "category": "parking",
        "is_practical_safety": True,
        "page": "/en/transport",
        "section": "Highway Parking Hubs",
        "keywords": [
            "parking", "car", "vehicle", "vilholi", "adgaon", "nilgiri", "dugaon", "mumbai", "pune", "agra",
            "पार्किंग", "गाडी", "वाहन", "विल्होळी", "आडगाव"
        ],
        "content": (
            "Vehicle Restrictions: On Snan days, private vehicles are restricted within 10-15 km of the core ghats.\n"
            "Designated Satellite Parking Hubs:\n"
            "• Mumbai/Pune Highway (NH3): Vilholi Outer Parking (15,000 car capacity) ➔ Feeder Shuttle to CBS.\n"
            "• Agra Highway (NH3): Adgaon Truck Terminus (12,000 car capacity) ➔ Feeder Shuttle to Tapovan.\n"
            "• Aurangabad Highway: Nilgiri Baug / Tapovan (8,000 car capacity) ➔ Feeder Shuttle to Panchavati.\n"
            "• Trimbak Road (NH848): Dugaon Phata (10,000 car capacity) ➔ Feeder Shuttle to Trimbakeshwar."
        ),
    },
    {
        "id": "transport-shuttle-corridors",
        "title": "MSRTC Feeder Shuttles & 28km Transit Corridor",
        "category": "transport",
        "is_practical_safety": True,
        "page": "/en/transport",
        "section": "Bus Frequency & Fares",
        "keywords": ["bus", "shuttle", "msrtc", "transit", "cbs", "nashik road", "28km", "बस", "वाहतूक", "शटल"],
        "content": (
            "MSRTC Pilgrim Shuttles: 2,000+ dedicated shuttle buses operate 24x7 on Snan dates.\n"
            "Frequency: Every 5–10 minutes from Outer Parking Hubs and Nashik Road Railway Station.\n"
            "Fare: Free pilgrim feeder service sponsored by the Kumbh Mela Administration.\n"
            "Nashik-Trimbakeshwar Link: Direct express highway shuttles run non-stop between CBS/Tapovan and Trimbak Bus Station (28 km, ~45 mins)."
        ),
    },

    # ── 10. Lodging & Dining Listings (lodgingDining.ts — Phase 7) ─────────────
    {
        "id": "lodging-panchavati-yatri-niwas",
        "title": "Lodging: Hotel Panchavati Yatri Niwas (Nashik)",
        "category": "lodging",
        "is_practical_safety": True,
        "page": "/en/stay-and-eat",
        "section": "Budget Hotel Listing",
        "keywords": ["hotel", "stay", "room", "panchavati", "yatri niwas", "budget", "हॉटेल", "मुक्काम", "खोली"],
        "content": (
            "Hotel Panchavati Yatri Niwas is located in Panchavati, Nashik (0.8 km from Ramkund Ghat).\n"
            "Type: Hotel (Budget). Rating: 4.2/5 (184 reviews). Check-in: 12:00 PM, Check-out: 11:00 AM.\n"
            "Pricing: Approx ₹1,800/night. Features: 24h hot water, elevator, safe drinking water, CCTV security."
        ),
    },
    {
        "id": "lodging-ganga-kinara-resort",
        "title": "Lodging: Ganga Kinara Heritage Tent Resort (Tapovan)",
        "category": "lodging",
        "is_practical_safety": True,
        "page": "/en/stay-and-eat",
        "section": "Tent Resort Listing",
        "keywords": ["tent", "resort", "tapovan", "luxury", "ganga kinara", "तंबू", "रिसॉर्ट"],
        "content": (
            "Ganga Kinara Heritage Tent Resort is in Tapovan, Nashik (1.8 km from Ramkund Ghat).\n"
            "Type: Tent Resort (Mid-tier). Rating: 4.5/5 (210 reviews). Check-in: 1:00 PM, Check-out: 10:00 AM.\n"
            "Pricing: Approx ₹3,800/night. Features: Luxury Swiss tents, attached bathrooms, organic dining hall, shuttle to ghats."
        ),
    },
    {
        "id": "lodging-trimbak-bhakt-niwas",
        "title": "Lodging: Trimbak Bhakt Niwas Guesthouse",
        "category": "lodging",
        "is_practical_safety": True,
        "page": "/en/stay-and-eat",
        "section": "Guesthouse Listing",
        "keywords": ["trimbak", "bhakt niwas", "guesthouse", "kushavarta", "भक्त निवास", "धर्मशाळा"],
        "content": (
            "Trimbak Bhakt Niwas Guesthouse is situated near Kushavarta Kund, Trimbakeshwar (0.4 km from temple).\n"
            "Type: Guesthouse (Budget). Rating: 4.0/5 (95 reviews). Check-in: 11:00 AM, Check-out: 10:00 AM.\n"
            "Pricing: Approx ₹950/night. Features: Clean rooms, hot water morning supply, luggage storage."
        ),
    },
    {
        "id": "dining-sadhana-chulivarchi-misal",
        "title": "Dining: Sadhana Chulivarchi Misal (Pure Veg)",
        "category": "dining",
        "is_practical_safety": True,
        "page": "/en/stay-and-eat",
        "section": "Restaurant Listing",
        "keywords": ["misal", "sadhana", "chulivarchi", "restaurant", "food", "pure veg", "जेवण", "मिसळ"],
        "content": (
            "Sadhana Chulivarchi Misal is near Someshwar Temple, Gangapur Road, Nashik.\n"
            "Cuisine: Traditional Maharashtrian Misal Pav (Pure Veg). Hours: 8:00 AM – 3:30 PM.\n"
            "Pricing: ₹120 per thali. Famous for smokey earthen clay stove preparation, jaggery jalebi, and fresh buttermilk."
        ),
    },
    {
        "id": "dining-panchavati-gaurav-thali",
        "title": "Dining: Panchavati Gaurav Thali (Pure Veg)",
        "category": "dining",
        "is_practical_safety": True,
        "page": "/en/stay-and-eat",
        "section": "Restaurant Listing",
        "keywords": ["thali", "panchavati gaurav", "cbs", "unlimited", "pure veg", "थाळी", "अमर्यादित"],
        "content": (
            "Panchavati Gaurav Thali is located at CBS Circle, Nashik (1.5 km from Ramkund).\n"
            "Cuisine: Gujarati & Rajasthani Pure Veg Thali. Hours: 11:30 AM – 3:30 PM & 7:00 PM – 10:30 PM.\n"
            "Pricing: ₹320 unlimited thali. Features: Pure ghee sweets, dal baati churma, dhokla, air-conditioned family seating."
        ),
    },
    {
        "id": "dining-kalyan-bhavan-dining",
        "title": "Dining: Shree Kalyan Bhavan Satvik Bhojanalaya (Trimbakeshwar)",
        "category": "dining",
        "is_practical_safety": True,
        "page": "/en/stay-and-eat",
        "section": "Restaurant Listing",
        "keywords": ["satvik", "kalyan bhavan", "trimbakeshwar", "bhojanalaya", "pure veg", "सात्विक", "भोजनालय"],
        "content": (
            "Shree Kalyan Bhavan Satvik Bhojanalaya is near Trimbakeshwar Temple Main Gate (0.2 km).\n"
            "Cuisine: Satvik North & South Indian Vegetarian (No Onion, No Garlic options available). Hours: 7:00 AM – 10:00 PM.\n"
            "Pricing: ₹140 per meal. Hygienic pilgrim dining hall with mineral water."
        ),
    },

    # ── 11. Emergency & Lost & Found (seed.ts & emergency) ────────────────────
    {
        "id": "emergency-numbers-official",
        "title": "Official Verified Emergency Helplines & Control Rooms",
        "category": "emergency",
        "is_practical_safety": True,
        "page": "/en/emergency",
        "section": "24x7 Helplines",
        "keywords": [
            "emergency", "police", "ambulance", "hospital", "helpline", "112", "108", "1077", "139", "1363",
            "आपत्कालीन", "पोलीस", "रुग्णवाहिका", "मदत केंद्र"
        ],
        "content": (
            "Verified Emergency Helplines for Kumbh Mela 2027:\n"
            "• Police & Fire Emergency: 112\n"
            "• Medical Emergency & Ambulance: 108\n"
            "• District Disaster Management Control Room: 1077 (or 0253-2317151)\n"
            "• Nashik City Police Control Room: 0253-2305233\n"
            "• Nashik Municipal Corporation Kumbh Helpline: 1800-233-0244 / 1916\n"
            "• National 24x7 Tourist Helpline: 1363\n"
            "• Indian Railways Helpline: 139\n"
            "• Women Helpline: 1090"
        ),
    },
    {
        "id": "emergency-medical-posts-locations",
        "title": "Hospital Locations & 24x7 Medical Aid Booths",
        "category": "emergency",
        "is_practical_safety": True,
        "page": "/en/emergency",
        "section": "Hospitals & Aid Posts",
        "keywords": ["hospital", "doctor", "civil hospital", "medical aid post", "दवाखाना", "रुग्णालय"],
        "content": (
            "24x7 Medical Aid Posts are stationed at:\n"
            "1. Ramkund Ghat Main Pavilion (Nashik)\n"
            "2. District Civil Hospital (Trimbak Naka, Nashik)\n"
            "3. Tapovan Sadhugram Medical Camp (Panchavati)\n"
            "4. Trimbakeshwar Sub-District Hospital (Trimbak)\n"
            "5. Central Bus Stand (CBS) Triage Point"
        ),
    },
    {
        "id": "emergency-lost-and-found-booths",
        "title": "Lost & Found / Missing Persons Centers (खोया-पाया केंद्र)",
        "category": "emergency",
        "is_practical_safety": True,
        "page": "/en/lost-and-found",
        "section": "Police Missing Person Network",
        "keywords": ["lost", "missing", "separated", "khoya paya", "child", "हरवला", "गुमशुदा", "खोया पाया"],
        "content": (
            "Official 24x7 Police Khoya-Paya Booths equipped with public address loudspeakers and digital photo bulletin systems are located at:\n"
            "• Ramkund Police Station Booth\n"
            "• Panchavati Kalaram Gate\n"
            "• Trimbakeshwar Temple Entrance\n"
            "• Tapovan Sadhugram Central Tower\n"
            "• Nashik Road Railway Station Concourse"
        ),
    },

    # ── 12. About Yatriva & Technical Mission (about) ──────────────────────────
    {
        "id": "about-yatriva-civic-tech",
        "title": "About Yatriva Platform & Mission",
        "category": "about",
        "is_practical_safety": False,
        "page": "/en/about",
        "section": "Team & Open-Source Mission",
        "keywords": ["about", "yatriva", "creator", "atharva suryawanshi", "civic tech", "pwa", "offline", "माहिती", "यात्रिवा"],
        "content": (
            "Yatriva is a next-generation civic-tech platform designed for the Nashik-Trimbakeshwar Simhastha Kumbh Mela 2027. "
            "Created by full-stack developer Atharva Ravindra Suryawanshi. "
            "Engineered with offline-first Progressive Web App (PWA) architecture, multilingual localization (English, Hindi, Marathi), "
            "and grounded retrieval to safeguard pilgrims against crowds, water hazards, and navigation confusion."
        ),
    },
]


def init_vector_store():
    """Initializes Qdrant collection and indexes all Yatriva knowledge chunks."""
    global LAST_REINDEX_TIME

    if qdrant_client.collection_exists(COLLECTION_NAME):
        qdrant_client.delete_collection(COLLECTION_NAME)

    qdrant_client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE),
    )

    points = []
    for idx, item in enumerate(FULL_SITE_CHUNKS, start=1):
        text_payload = f"{item['title']} {' '.join(item['keywords'])} {item['content']}"
        vec = text_to_vector(text_payload)
        points.append(
            PointStruct(
                id=idx,
                vector=vec,
                payload={
                    "chunk_id": item["id"],
                    "title": item["title"],
                    "content": item["content"],
                    "category": item["category"],
                    "is_practical_safety": item["is_practical_safety"],
                    "page": item["page"],
                    "section": item["section"],
                    "keywords": item["keywords"],
                    "updated_at": datetime.utcnow().isoformat(),
                },
            )
        )

    qdrant_client.upsert(collection_name=COLLECTION_NAME, points=points)
    LAST_REINDEX_TIME = time.time()
    print(f"[RAG Engine] Successfully indexed {len(points)} chunks into Qdrant collection '{COLLECTION_NAME}'.")


try:
    init_vector_store()
except Exception as e:
    print(f"[RAG Engine] Vector store initialization note: {e}")


# ─── INCREMENTAL RE-EMBEDDING & RE-INDEXING (Part 3) ─────────────────────────

def upsert_chunk(chunk_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Incrementally updates or inserts a single chunk in the Qdrant vector store.
    Triggered when a content item (place, lodging, safety rule) is edited.
    """
    global LAST_REINDEX_TIME

    chunk_id = chunk_data.get("id") or str(len(FULL_SITE_CHUNKS) + 1)
    title = chunk_data.get("title", "")
    content = chunk_data.get("content", "")
    category = chunk_data.get("category", "general")
    is_practical_safety = chunk_data.get("is_practical_safety", True)
    page = chunk_data.get("page", "/en")
    section = chunk_data.get("section", "General")
    keywords = chunk_data.get("keywords", [])

    text_payload = f"{title} {' '.join(keywords)} {content}"
    vec = text_to_vector(text_payload)

    # Determine stable integer point id
    existing_idx = None
    for idx, c in enumerate(FULL_SITE_CHUNKS, start=1):
        if c["id"] == chunk_id:
            existing_idx = idx
            # Update in-memory list
            FULL_SITE_CHUNKS[idx - 1].update({
                "title": title,
                "content": content,
                "category": category,
                "is_practical_safety": is_practical_safety,
                "page": page,
                "section": section,
                "keywords": keywords,
            })
            break

    if existing_idx is None:
        FULL_SITE_CHUNKS.append({
            "id": chunk_id,
            "title": title,
            "content": content,
            "category": category,
            "is_practical_safety": is_practical_safety,
            "page": page,
            "section": section,
            "keywords": keywords,
        })
        existing_idx = len(FULL_SITE_CHUNKS)

    point = PointStruct(
        id=existing_idx,
        vector=vec,
        payload={
            "chunk_id": chunk_id,
            "title": title,
            "content": content,
            "category": category,
            "is_practical_safety": is_practical_safety,
            "page": page,
            "section": section,
            "keywords": keywords,
            "updated_at": datetime.utcnow().isoformat(),
        },
    )

    qdrant_client.upsert(collection_name=COLLECTION_NAME, points=[point])
    LAST_REINDEX_TIME = time.time()
    return {
        "status": "success",
        "chunk_id": chunk_id,
        "title": title,
        "point_id": existing_idx,
        "updated_at": datetime.utcnow().isoformat(),
    }


def reindex_all_corpus() -> Dict[str, Any]:
    """Triggers a full re-index of all knowledge chunks into Qdrant."""
    init_vector_store()
    return {
        "status": "success",
        "total_chunks": len(FULL_SITE_CHUNKS),
        "timestamp": datetime.utcnow().isoformat(),
    }


def get_rag_stats() -> Dict[str, Any]:
    """Returns runtime statistics about the RAG corpus."""
    categories = {}
    for c in FULL_SITE_CHUNKS:
        cat = c.get("category", "other")
        categories[cat] = categories.get(cat, 0) + 1

    return {
        "total_chunks": len(FULL_SITE_CHUNKS),
        "categories": categories,
        "last_reindex_timestamp": LAST_REINDEX_TIME,
        "collection_name": COLLECTION_NAME,
        "vector_size": VECTOR_SIZE,
    }


# ─── GROUNDING POLICY & RETRIEVAL (Part 2) ───────────────────────────────────

PRACTICAL_SAFETY_KEYWORDS = [
    # Parking & Transport
    "parking", "park", "car", "vehicle", "bus", "shuttle", "transit", "train", "station", "route",
    "cbs", "vilholi", "adgaon", "nilgiri", "dugaon", "पार्किंग", "गाडी", "वाहन", "बस", "वाहतूक",
    # Safety & Crowd
    "stampede", "crowd", "rush", "crush", "water edge", "fall", "crawl", "exit", "gates",
    "surge", "drowning", "dam", "release", "current", "depth", "ndrf", "sdrf", "lifeguard",
    "गर्दी", "धोका", "चेंगराचेंगरी", "पाणी", "प्रवाह", "धरण",
    # Medical & Health
    "medical", "doctor", "hospital", "ambulance", "first aid", "insulin", "blood pressure",
    "heat", "sunstroke", "ors", "water kiosk", "रुग्णवाहिका", "दवाखाना", "औषध", "उष्माघात",
    # Emergency & Police
    "emergency", "police", "helpline", "lost", "missing", "separated", "112", "108", "1077",
    "1363", "139", "पोलीस", "मदत", "हरवला", "गुम",
    # Lodging & Dining
    "hotel", "stay", "room", "tent", "guesthouse", "bhakt niwas", "food", "dining", "restaurant",
    "pure veg", "thali", "हॉटेल", "मुक्काम", "जेवण", "थाळी",
    # Accessibility
    "wheelchair", "senior", "elderly", "divyang", "ramp", "golf cart", "e-rickshaw",
    "ज्येष्ठ", "दिव्यांग", "व्हीलचेअर"
]


def is_practical_or_safety(query: str, top_context: Optional[Dict[str, Any]] = None) -> bool:
    """
    Determines if the query is practical or safety-related.
    Applies Part 2's strict Grounding Policy classification.
    """
    lower_q = query.lower()
    for kw in PRACTICAL_SAFETY_KEYWORDS:
        if kw in lower_q:
            return True

    if top_context and top_context.get("is_practical_safety"):
        return True

    return False


def search_grounded_context(query: str, limit: int = 4) -> List[Dict[str, Any]]:
    """
    Performs cosine similarity vector search in Qdrant with keyword fallback.
    Returns top grounded knowledge chunks with full source metadata.
    """
    query_vec = text_to_vector(query)
    contexts = []

    try:
        search_results = qdrant_client.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_vec,
            limit=limit,
        )

        query_tokens = set(_tokenize(query))
        for res in search_results:
            if res.payload and res.score > 0.22:
                chunk_kws = [k.lower() for k in res.payload.get("keywords", [])]
                content_lower = res.payload.get("content", "").lower()
                title_lower = res.payload.get("title", "").lower()
                has_overlap = any(kw in query.lower() for kw in chunk_kws) or any(
                    t in content_lower or t in title_lower for t in query_tokens
                )
                if has_overlap:
                    contexts.append({
                        "id": res.payload.get("chunk_id", ""),
                        "title": res.payload.get("title", ""),
                        "content": res.payload.get("content", ""),
                        "category": res.payload.get("category", ""),
                        "is_practical_safety": res.payload.get("is_practical_safety", False),
                        "page": res.payload.get("page", "/en"),
                        "section": res.payload.get("section", ""),
                        "score": res.score,
                    })
    except Exception:
        pass

    # Keyword matching fallback for domain-specific tokens
    if not contexts:
        tokens = set(_tokenize(query))
        matched = []
        for chunk in FULL_SITE_CHUNKS:
            score = 0.0
            for kw in chunk["keywords"]:
                if kw in query.lower():
                    score += 3.0
            for token in tokens:
                if token in chunk["content"].lower() or token in chunk["title"].lower():
                    score += 1.5

            if score >= 2.5:
                matched.append((score, chunk))

        matched.sort(key=lambda x: x[0], reverse=True)
        for score, chunk in matched[:limit]:
            contexts.append({
                "id": chunk["id"],
                "title": chunk["title"],
                "content": chunk["content"],
                "category": chunk["category"],
                "is_practical_safety": chunk["is_practical_safety"],
                "page": chunk["page"],
                "section": chunk["section"],
                "score": float(score),
            })

    return contexts


def generate_general_cultural_knowledge(query: str, locale: str = "en") -> str:
    """
    Synthesizes general cultural/historical background for queries not directly
    covered in the site corpus (e.g. Sanskrit etymology, ancient Puranic mythology).
    Adheres to Part 2: visibly marked and contextualized as general background.
    """
    if locale == "hi":
        return (
            "प्राचीन वैदिक व पौराणिक परंपरा के अनुसार, 'कुंभ' शब्द का अर्थ अमृत कलश (घड़ा) है। "
            "समुद्र मंथन के दौरान जब धन्वंतरि अमृत कुंभ लेकर प्रकट हुए, तब देवताओं और असुरों के बीच अमृत कलश को लेकर संघर्ष हुआ। "
            "मान्यता है कि इस दौरान अमृत की बूंदें पृथ्वी पर चार पवित्र तीर्थों पर गिरीं: नाशिक (गोदावरी), प्रयागराज (त्रिवेणी संगम), "
            "हरिद्वार (गंगा), और उज्जैन (शिप्रा)।\n\n"
            "खगोलीय दृष्टि से, जब गुरु (बृहस्पति) सिंह राशि में और सूर्य कर्क राशि में प्रवेश करते हैं, "
            "तब नाशिक-त्र्यंबकेश्वर में सिंहस्थ कुंभ मेले का महायोग बनता है।"
        )
    elif locale == "mr":
        return (
            "प्राचीन वैदिक व पौराणिक परंपरेनुसार 'कुंभ' या शब्दाचा अर्थ अमृताचा घडा (कलश) असा आहे. "
            "समुद्रमंथनाच्या वेळी भगवान धन्वंतरी अमृताचा कुंभ घेऊन प्रकट झाले, तेव्हा देव आणि दानवांमध्ये चढाओढ झाली. "
            "त्या वेळी अमृताचे थेंब पृथ्वीवरील चार तीर्थक्षेत्रांवर पडले: नाशिक (गोदावरी), प्रयागराज (त्रिवेणी संगम), "
            "हरिद्वार (गंगा), आणि उज्जैन (क्षिप्रा).\n\n"
            "खगोलशास्त्रानुसार जेव्हा गुरू ग्रह सिंह राशीत प्रवेश करतो, तेव्हा नाशिक-त्र्यंबकेश्वर येथे 'सिंहस्थ कुंभमेळा' भरतो."
        )
    else:
        return (
            "In ancient Vedic and Puranic traditions, the word 'Kumbh' signifies the sacred pitcher or celestial urn containing Amrit (immortality nectar). "
            "According to the legend of Samudra Manthan (the churning of the cosmic ocean), when Lord Dhanvantari emerged carrying the Kumbh of nectar, "
            "a struggle ensued between the Devas and Asuras. Drops of celestial nectar spilled onto four sacred earthly locations: "
            "Nashik (Godavari River), Prayagraj (Triveni Sangam), Haridwar (Ganga River), and Ujjain (Shipra River).\n\n"
            "Astrologically, the Simhastha Kumbh at Nashik-Trimbakeshwar occurs once every 12 years when Jupiter (Guru) transits into the zodiac sign of Leo (Simha Rashi)."
        )


def execute_grounding_policy(
    query: str,
    locale: str = "en",
    contexts: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    """
    Applies the full Phase 4.1 Grounding Policy:
    1. Practical / Safety: Answer ONLY from site chunks. If none retrieved, plain fallback to page / 112 / 108.
    2. Cultural: If site content matches, site content wins. If not, general knowledge visibly marked.
    """
    if contexts is None:
        contexts = search_grounded_context(query, limit=3)

    is_practical = is_practical_or_safety(query, contexts[0] if contexts else None)

    # ── CASE 1: Practical or Safety Question ──────────────────────────────────
    if is_practical:
        if not contexts:
            # STRICT POLICY: Never fill gaps with general knowledge for practical / safety queries!
            if locale == "hi":
                reply = (
                    "क्षमा करें, मुझे इस व्यावहारिक/सुरक्षा संबंधी प्रश्न के लिए आधिकारिक कुंभ मेले के डेटासेट में सत्यापित जानकारी नहीं मिली।\n\n"
                    "कृपया आधिकारिक जानकारी हेतु [आपातकालीन एवं सहायता पृष्ठ](/hi/emergency) या [परिवहन पृष्ठ](/hi/transport) देखें, "
                    "या 24x7 कुंभ हेल्पलाइन पर संपर्क करें:\n"
                    "• **राष्ट्रीय आपातकाल**: 112\n"
                    "• **चिकित्सा सहायता**: 108\n"
                    "• **कुंभ नियंत्रण कक्ष**: 1800-233-0244 / 1077"
                )
            elif locale == "mr":
                reply = (
                    "क्षमस्व, मला या व्यावहारिक/सुरक्षा प्रश्नासाठी अधिकृत कुंभ मेळा डेटासेटमध्ये अचूक माहिती आढळली नाही.\n\n"
                    "कृपया अधिकृत तपशीलांसाठी [आपत्कालीन व मदत केंद्र](/mr/emergency) किंवा [वाहतूक पृष्ठ](/mr/transport) तपासा, "
                    "किंवा २४x७ हेल्पलाईनवर संपर्क साधा:\n"
                    "• **पोलीस व आपत्कालीन**: 112\n"
                    "• **रुग्णवाहिका**: 108\n"
                    "• **कुंभ नियंत्रण कक्ष**: 1800-233-0244 / 1077"
                )
            else:
                reply = (
                    "I could not find verified official records in the Yatriva dataset for this practical/safety query.\n\n"
                    "Please consult our official [Emergency & Helplines Guide](/en/emergency) or [Transit & Parking Guide](/en/transport), "
                    "or reach out directly to the 24x7 Kumbh assistance services:\n"
                    "• **Police & Emergency**: 112\n"
                    "• **Medical & Ambulance**: 108\n"
                    "• **Kumbh Disaster Control**: 1077 / 1800-233-0244"
                )

            return {
                "reply": reply,
                "grounded": False,
                "isGeneralKnowledge": False,
                "sources": ["Yatriva Safety Policy Guardrail"],
                "sourceLinks": [
                    {"title": "Emergency Helplines", "url": f"/{locale}/emergency"},
                    {"title": "Transit & Parking", "url": f"/{locale}/transport"},
                ],
            }

        # Valid site chunk exists -> Answer grounded exclusively on site content
        top_context = contexts[0]
        title = top_context["title"]
        text = top_context["content"]
        page = top_context.get("page", f"/{locale}")
        section = top_context.get("section", "Verified Guide")

        sources = [f"{title} ({section})"]
        source_links = [{"title": f"{title} — {section}", "url": page}]

        if locale == "hi":
            reply = f"**{title}** से प्राप्त आधिकारिक जानकारी:\n\n{text}\n\n*स्रोत: यात्रिवा आधिकारिक कुंभ मेला मार्गदर्शिका ({section})*"
        elif locale == "mr":
            reply = f"**{title}** कडून मिळवलेली अधिकृत माहिती:\n\n{text}\n\n*स्रोत: यात्रिवा अधिकृत कुंभ मेळा माहिती पुस्तिका ({section})*"
        else:
            reply = f"Grounded information from **{title}**:\n\n{text}\n\n*Source: Yatriva Verified Dataset — [{section}]({page})*"

        return {
            "reply": reply,
            "grounded": True,
            "isGeneralKnowledge": False,
            "sources": sources,
            "sourceLinks": source_links,
        }

    # ── CASE 2: Cultural / Historical / Background Question ───────────────────
    # If verified site content exists, SITE CONTENT ALWAYS WINS!
    if contexts and contexts[0].get("score", 0) > 0.18:
        top_context = contexts[0]
        title = top_context["title"]
        text = top_context["content"]
        page = top_context.get("page", f"/{locale}")
        section = top_context.get("section", "Heritage Article")

        sources = [f"{title} ({section})"]
        source_links = [{"title": f"{title} — {section}", "url": page}]

        if locale == "hi":
            reply = f"**{title}**:\n\n{text}\n\n*स्रोत: यात्रिवा आधिकारिक संस्कृति एवं धरोहर संग्रह*"
        elif locale == "mr":
            reply = f"**{title}**:\n\n{text}\n\n*स्रोत: यात्रिवा अधिकृत संस्कृती व वारसा लेख*"
        else:
            reply = f"Verified heritage context regarding **{title}**:\n\n{text}\n\n*Source: Yatriva Verified Culture & Heritage Repository*"

        return {
            "reply": reply,
            "grounded": True,
            "isGeneralKnowledge": False,
            "sources": sources,
            "sourceLinks": source_links,
        }

    # No specific site content found -> Draw on General Knowledge (Visibly Marked!)
    gen_text = generate_general_cultural_knowledge(query, locale)

    if locale == "hi":
        reply = (
            "ℹ️ **[सामान्य ज्ञान / ऐतिहासिक पृष्ठभूमि]**\n\n"
            f"{gen_text}\n\n"
            "*(नोट: यह उत्तर सांस्कृतिक व ऐतिहासिक सामान्य ज्ञान पर आधारित है और इसे आधिकारिक साइट रिकॉर्ड के रूप में नहीं माना जाना चाहिए।)*"
        )
    elif locale == "mr":
        reply = (
            "ℹ️ **[सामान्य ज्ञान / ऐतिहासिक पार्श्वभूमी]**\n\n"
            f"{gen_text}\n\n"
            "*(टीप: हे उत्तर सांस्कृतिक व ऐतिहासिक सामान्य ज्ञानावर आधारित असून अधिकृत साइट रेकॉर्ड्स म्हणून मानले जाऊ नये.)*"
        )
    else:
        reply = (
            "ℹ️ **[General Knowledge / Cultural Background]**\n\n"
            f"{gen_text}\n\n"
            "*(Note: This information is provided as general historical/cultural context and is not part of the verified official site records.)*"
        )

    return {
        "reply": reply,
        "grounded": False,
        "isGeneralKnowledge": True,
        "sources": ["General Cultural Background"],
        "sourceLinks": [{"title": "Culture & Heritage", "url": f"/{locale}/culture"}],
    }


# ─── VERIFIED ATTACHED IMAGES ────────────────────────────────────────────────

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
