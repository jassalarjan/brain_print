# **Personal Context Engine 2.0 — Cognitive Intelligence Platform**

*A full-stack cognitive analytics system that maps how people think, tracks cognitive evolution, and powers team performance intelligence.*

---

## 🌐 **Overview**

**Personal Context Engine (PCE)** is a Node.js + React platform that creates a user's **"thinking fingerprint"** based on scenario-driven cognitive modeling.
It visualizes cognitive patterns, generates insights, tracks evolution over time, and supports team-level intelligence for SaaS use cases.

The system measures **10 cognitive traits**, produces an **interactive React Flow graph**, and stores profiles for future comparison, benchmarking, and team synchronization.

PCE is designed as a foundation for:

* Cognitive benchmarking
* Longitudinal evolution tracking
* Team cognitive mapping
* Organizational intelligence
* Research-backed insights
* SaaS product expansion

---

## 🧠 **Core Features (MVP)**

### **1. Scenario-Based Cognitive Assessment**

* 12 research-inspired scenario questions
* Each mapped to weighted cognitive traits
* Clean React interface with Zustand state management

### **2. Cognitive Trait Scoring Engine**

* 10 measurable traits
* Score normalization (0–100)
* Correlation matrix generation
* Rule-based, deterministic scoring (no AI needed)

### **3. Interactive Context Graph**

* Built with **React Flow**
* Node size + color reflect trait dominance
* Animated edges represent correlations
* Zoom, pan, minimap, and hover tooltips

### **4. Personalized Insight Generation**

* 6 contextual insight categories
* Synthesized from trait clusters and score patterns
* Behavior-focused, not personality-based

### **5. Profile Saving & Sharing**

* Short profile IDs generated via nanoid
* Stored in MongoDB
* Public profile viewer (`/profile/:id`)
* JSON export option

---

## 🚀 **Advanced Features (2.0)**

*Science + Business Intelligence Layer*

### 🔬 **Cognitive Benchmarking Engine**

* Trait percentiles vs global dataset
* Role-based benchmarking
* Thinking-style archetype clustering
* Divergence score computation
* Trait skew + cognitive signature metrics

### 📈 **Cognitive Evolution Tracker**

* Multi-session storage
* Time-series visualization for trait progression
* Cognitive drift & stability analysis
* Change velocity calculation

### 🧩 **Team Cognitive Mapping (SaaS Core)**

* Aggregate multiple profiles into a single team map
* Team diversity heatmaps
* Collaboration synergy matrix
* Conflict prediction models
* Strength distribution analysis
* Leadership compatibility reporting

### 🧬 **Cognitive Pairing Index**

* Compatibility score between two profiles
* Communication alignment analysis
* Decision-style complementarity
* Potential friction zones
* Interaction model summary

---

## 🏗️ **System Architecture**

### 🔹 **Backend: Node.js + Express + TypeScript**

* RESTful API layer
* Modular controllers and services
* MongoDB + Mongoose models
* Dedicated scoring service
* Profile storage service
* CORS-enabled for frontend communication

```
/server
  /src
    /routes
    /controllers
    /services
    /db
    /types
  server.ts
```

### 🔹 **Frontend: React + TypeScript + Vite**

* Responsive Tailwind UI
* shadcn/ui components
* Zustand for global state
* React Router for navigation
* React Flow for graph visualization
* Framer Motion for transitions
* Recharts for data visualization

```
/client
  /src
    /components
      /ui
      /core
    /pages
    /store
    /utils
    main.tsx
```

---

## 📡 **API Endpoints**

### Core Endpoints

* **GET** `/api/health` - Health check
* **GET** `/api/questions` - Retrieve question set
* **POST** `/api/session/score` - Calculate trait scores & correlations
* **POST** `/api/profile/save` - Persist profile to DB
* **GET** `/api/profile/:id` - Retrieve saved profile

### Benchmarking Endpoints

* **GET** `/api/benchmark/profile/:profileId` - Get benchmark analysis
* **POST** `/api/benchmark/update` - Update global benchmarks
* **GET** `/api/benchmark` - Get all benchmark data
* **GET** `/api/benchmark/archetypes` - Get cognitive archetypes

### Evolution Tracking Endpoints

* **POST** `/api/evolution` - Create new session
* **GET** `/api/evolution/user/:userId` - Get all user sessions
* **GET** `/api/evolution/user/:userId/data` - Get evolution data with analysis
* **GET** `/api/evolution/user/:userId/summary` - Get evolution summary
* **GET** `/api/evolution/:sessionId` - Get specific session
* **GET** `/api/evolution/compare` - Compare two sessions

### Team Mapping Endpoints

* **POST** `/api/team` - Create new team
* **GET** `/api/team` - Get all teams
* **GET** `/api/team/:teamId` - Get specific team
* **PATCH** `/api/team/:teamId/members` - Update team members
* **GET** `/api/team/:teamId/analysis` - Get team analysis

### Pairing Endpoints

* **POST** `/api/pairing` - Analyze cognitive pairing
* **GET** `/api/pairing/:pairingId` - Get pairing analysis
* **GET** `/api/pairing/profile/:profileId` - Get all pairings for profile

---

## 🧠 **Cognitive Traits Measured**

1. **Analytical** - Data-driven decision making
2. **Intuition-Driven** - Gut feeling and instinct
3. **Sequential** - Step-by-step planning
4. **Improviser** - Adaptive and flexible thinking
5. **Risk-Neutral** - Comfortable with uncertainty
6. **Comfort-Seeker** - Prefers stability and safety
7. **Clarity-First** - Values clear information
8. **Fast-Decider** - Quick decision making
9. **Overthinker** - Deep analysis and deliberation
10. **Pattern-Seeker** - Sees connections and models

---

## 🚀 **Running the Application**

### Prerequisites
- Node.js 18+ installed
- MongoDB running on `localhost:27017`
- npm (Node.js package manager)

### Backend Setup
```bash
cd server
npm install
npm run dev
# Server runs on http://localhost:5000
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
# App runs on http://localhost:5173
```

### Environment Variables

**Backend** (`server/.env`):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/context-engine
```

---

## 🖥️ **User Journey**

1. **Landing Page** → Value prop + CTA
2. **Questionnaire** → 12 cognitive scenarios
3. **Processing Screen** → Animated analysis
4. **Graph View** → Cognitive trait network
5. **Insights Page** → 6 detailed sections
6. **Export Page** → JSON + shareable link
7. **Profile Viewer** → View someone else's graph & insights
8. **Benchmark View** → Compare against global data
9. **Evolution Tracker** → See cognitive changes over time
10. **Team Dashboard** → Analyze team cognitive dynamics
11. **Pairing Analysis** → Evaluate collaboration compatibility

---

## ⚙️ **Tech Stack**

### **Backend**

* Node.js
* Express
* TypeScript
* MongoDB (Mongoose)
* nanoid

### **Frontend**

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* Zustand
* React Router
* React Flow
* Framer Motion
* Recharts

---

## 🧪 **Testing the API**

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Get Questions
```bash
curl http://localhost:5000/api/questions
```

### Calculate Scores
```bash
curl -X POST http://localhost:5000/api/session/score \
  -H "Content-Type: application/json" \
  -d '{"answers": [{"questionId":"q1","choiceId":"q1c1"}]}'
```

### Get Benchmark
```bash
curl http://localhost:5000/api/benchmark/profile/ABC12345
```

### Create Team
```bash
curl -X POST http://localhost:5000/api/team \
  -H "Content-Type: application/json" \
  -d '{"name":"Dev Team","memberProfiles":["ABC123","DEF456"]}'
```

---

## 🧭 **Future Enhancements**

### 🔬 Scientific

* Cognitive archetype clustering refinement
* Research datasets integration
* Weighted scoring calibration
* Statistical trait models
* Predictive analytics

### 🚀 Business

* Advanced team dashboards
* Role-fit recommendation engine
* Organizational insights
* Admin panel + multi-user orgs
* Subscription billing integration
* API rate limiting and authentication

---

## 📄 **License**

MIT — free for personal and commercial use.

---

## ❤️ **Credits**

Built to explore cognitive modeling, behavioral insights, and team intelligence using modern full-stack engineering.
