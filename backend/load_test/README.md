# Yatriva Backend Load Testing Guide (Locust)

This folder contains the **Locust** load testing suite for the Yatriva FastAPI backend, designed to simulate realistic pilgrim user traffic spikes during the Nashik Simhastha Kumbh Mela 2027.

---

## Prerequisites

Install Locust in your Python environment:

```bash
pip install locust
```

---

## Running Load Tests

### 1. Interactive UI Mode
Start Locust and open the web dashboard:

```bash
cd backend
locust -f load_test/locustfile.py --host=http://localhost:8000
```

Open `http://localhost:8089` in your browser:
- **Number of users**: `100` to `5000`
- **Spawn rate**: `10` to `50` users/sec
- **Host**: `http://localhost:8000`

### 2. Headless Automated Benchmark (CLI)
Run a 1-minute automated stress test without UI:

```bash
locust -f load_test/locustfile.py --host=http://localhost:8000 --headless -u 200 -r 20 --run-time 1m
```

---

## Test Scenarios Covered

1. **`check_health`** (`/health`): Baseline server health check.
2. **`ask_ai_assistant`** (`/api/chat`): Multi-lingual RAG queries in English, Hindi, Marathi, and safety emergency keywords.
3. **`fetch_places`** (`/api/places`): Filtering places by category (ghat, temple, parking, transport, medical, police).
4. **`fetch_snan_dates`** (`/api/snan-dates`): Retrieval of verified Amrit Snan dates.
5. **`fetch_emergency_contacts`** (`/api/emergency`): Emergency helpline lookups.
6. **`HighLoadSpikeUser`**: Rapid burst user simulating peak crowd spikes at Ramkund on Amrit Snan mornings.
