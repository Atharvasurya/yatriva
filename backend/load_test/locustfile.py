"""
Yatriva FastAPI Load Testing Script — Locust
Simulates peak pilgrim traffic bursts during Nashik Simhastha Kumbh Mela 2027.

Usage:
  1. Install Locust: pip install locust
  2. Run Locust: locust -f load_test/locustfile.py --host=http://localhost:8000
  3. Headless spike test: locust -f load_test/locustfile.py --host=http://localhost:8000 --headless -u 100 -r 10 --run-time 1m
"""

import random
from locust import HttpUser, task, between, tag

# Typical pilgrim queries across supported languages
PILGRIM_QUERIES = [
    {"message": "When are the Amrit Snan dates 2027?", "locale": "en"},
    {"message": "Where is Ramkund Ghat located?", "locale": "en"},
    {"message": "Where should I park my car on Snan days?", "locale": "en"},
    {"message": "अमृत स्नान की मुख्य तिथियां क्या हैं?", "locale": "hi"},
    {"message": "रामकुंड घाट कहां स्थित है?", "locale": "hi"},
    {"message": "स्नान के दिन गाड़ी कहां पार्क करें?", "locale": "hi"},
    {"message": "अमृत स्नान तिथी कधी आहेत?", "locale": "mr"},
    {"message": "रामकुंड घाट कुठे आहे?", "locale": "mr"},
    {"message": "पार्किंग सुविधा कोठे उपलब्ध आहे?", "locale": "mr"},
    # Emergency safety query triggers safety handoff
    {"message": "Lost child near Ramkund ghat help emergency", "locale": "en"},
]

CATEGORY_TYPES = ["ghat", "temple", "parking", "transport_hub", "medical", "police"]

class PilgrimUser(HttpUser):
    """
    Simulates a standard pilgrim navigating the Yatriva application.
    Wait time: between 1 and 3 seconds between actions.
    """
    wait_time = between(1, 3)

    @task(5)
    @tag("health")
    def check_health(self):
        """High-frequency health check ping."""
        self.client.get("/health", name="/health")

    @task(10)
    @tag("chat")
    def ask_ai_assistant(self):
        """Simulate RAG AI Assistant chat query."""
        payload = random.choice(PILGRIM_QUERIES)
        headers = {"Content-Type": "application/json"}
        self.client.post("/api/chat", json=payload, headers=headers, name="/api/chat")

    @task(8)
    @tag("places")
    def fetch_places(self):
        """Simulate fetching places with category filtering."""
        category = random.choice(CATEGORY_TYPES)
        self.client.get(f"/api/places?category={category}", name="/api/places?category=[cat]")

    @task(3)
    @tag("snan")
    def fetch_snan_dates(self):
        """Simulate checking Amrit Snan dates."""
        self.client.get("/api/snan-dates", name="/api/snan-dates")

    @task(4)
    @tag("emergency")
    def fetch_emergency_contacts(self):
        """Simulate checking emergency helplines."""
        self.client.get("/api/emergency", name="/api/emergency")


class HighLoadSpikeUser(HttpUser):
    """
    Simulates peak Amrit Snan day traffic surge (rapid queries).
    Wait time: 0.2 to 0.8 seconds.
    """
    wait_time = between(0.2, 0.8)

    @task(1)
    def rapid_chat_burst(self):
        payload = random.choice(PILGRIM_QUERIES)
        self.client.post("/api/chat", json=payload, name="/api/chat (spike)")
