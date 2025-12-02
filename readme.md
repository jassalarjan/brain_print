# Personal Context Engine 🧠

A full-stack web application that creates a "thinking fingerprint" by asking scenario-based questions and generating an animated cognitive-style Context Graph.

## 🎯 Overview

The Personal Context Engine helps users understand their unique cognitive patterns through:
- **12 Scenario-Based Questions**: Covering work, learning, decision-making, and team dynamics
- **10 Cognitive Traits**: Analytical, Intuition-driven, Sequential, Improviser, and more
- **Interactive Graph Visualization**: Animated React Flow graph showing trait relationships
- **Personalized Insights**: 6 detailed insights about thinking, decision-making, and team behavior
- **Profile Sharing**: Shareable links and JSON export

## 🏗️ Architecture

### Backend (Node.js + Express + TypeScript)
- **Port**: 5000
- **Database**: MongoDB
- **Structure**:
  ```
  /server
    /src
      /routes         # API endpoints
      /controllers    # Request handlers
      /services       # Business logic (scoring, questions, storage)
      /db            # MongoDB setup and models
      /types         # TypeScript interfaces
      server.ts      # Express app entry point
  ```

### Frontend (React + TypeScript + Vite)
- **Port**: 5173
- **State Management**: Zustand
- **Styling**: Tailwind CSS + shadcn/ui
- **Graph Library**: React Flow
- **Animations**: Framer Motion
- **Structure**:
  ```
  /client
    /src
      /components
        /ui          # shadcn components (Button, Card, Progress)
        /core        # Custom components (Header, Footer, QuestionCard)
      /pages         # 7 main pages
      /store         # Zustand state management
      /utils         # API calls, insights generation, utilities
  ```

## 📊 API Endpoints

### GET `/api/health`
Health check endpoint
- **Response**: `{ status: 'ok', timestamp: '...' }`

### GET `/api/questions`
Get all scenario questions
- **Response**: `{ success: true, data: Question[] }`

### POST `/api/session/score`
Calculate cognitive scores from answers
- **Request**: `{ answers: [{ questionId, choiceId }] }`
- **Response**: `{ success: true, data: { scores, correlations } }`

### POST `/api/profile/save`
Save profile and get shareable ID
- **Request**: `{ scores, answers }`
- **Response**: `{ success: true, data: { profileId, shareUrl } }`

### GET `/api/profile/:id`
Retrieve saved profile
- **Response**: `{ success: true, data: Profile }`

## 🎨 User Journey

1. **Landing Page** (`/`)
   - Hero section with value proposition
   - Feature cards
   - "Start Context Session" CTA

2. **Questionnaire** (`/questionnaire`)
   - 12 scenario-based questions
   - Progress bar
   - Previous/Next navigation
   - Answer selection with visual feedback

3. **Processing** (`/processing`)
   - Animated loading screen
   - Status updates (analyzing, calculating, generating)
   - Automatic navigation to graph

4. **Graph View** (`/graph`)
   - Interactive React Flow visualization
   - Nodes sized/colored by trait scores
   - Edges showing trait correlations
   - Zoom, pan, minimap controls

5. **Insights** (`/insights`)
   - Top 5 dominant traits summary
   - 6 detailed insight cards covering:
     - How You Think
     - Decision Style
     - Learning Style
     - Team Behavior
     - Risk Approach
     - Communication Style

6. **Export** (`/export`)
   - Shareable profile link (auto-generated)
   - JSON download
   - "Start Over" option

7. **View Profile** (`/profile/:id`)
   - Public view of saved profiles
   - All traits and insights visible
   - Encourages visitors to create their own

## 🧠 Cognitive Traits

The app measures 10 cognitive traits:

1. **Analytical** - Data-driven, logical thinking
2. **Intuition-Driven** - Gut-based decision making
3. **Sequential** - Step-by-step, structured approach
4. **Improviser** - Adaptive, flexible thinking
5. **Risk-Neutral** - Comfortable with uncertainty
6. **Comfort-Seeker** - Preference for proven methods
7. **Clarity-First** - Values precision and understanding
8. **Fast-Decider** - Quick decision making
9. **Overthinker** - Thorough deliberation
10. **Pattern-Seeker** - Sees connections and models

## 🚀 Running the Application

### Prerequisites
- Node.js 18+ installed
- MongoDB running on `localhost:27017`
- npm (Node.js package manager)

### Backend Setup
```bash
cd /app/server
npm install
npm run dev
# Server runs on http://localhost:5000
```

### Frontend Setup
```bash
cd /app/client
npm install
npm run dev
# App runs on http://localhost:5173
```

### Environment Variables

**Backend** (`/app/server/.env`):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/context-engine
NODE_ENV=development
```

**Frontend** (`/app/client/.env`):
```
VITE_API_URL=http://localhost:5000
```

## 🧪 Testing

### Backend API Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Get questions
curl http://localhost:5000/api/questions

# Calculate scores
curl -X POST http://localhost:5000/api/session/score \
  -H "Content-Type: application/json" \
  -d '{"answers": [{"questionId": "q1", "choiceId": "q1c1"}]}'
```

### Frontend Testing
- Navigate to `http://localhost:5173`
- Complete the questionnaire
- Verify graph renders correctly
- Test profile sharing and export

## 📦 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **ID Generation**: nanoid

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (custom implementation)
- **State Management**: Zustand
- **Routing**: React Router v6
- **Graph Visualization**: React Flow
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🎯 Key Features

### Scoring Engine
- Weighted scoring system
- Each answer contributes trait scores (0-15 points)
- Normalized to 0-100 scale
- Correlation calculation between traits

### Insights Generation
- Rule-based system
- Contextual analysis of score combinations
- 6 insight categories
- Non-generic, personalized descriptions

### Graph Visualization
- Circular node layout
- Node size represents trait strength
- Node color based on score (purple > blue > cyan > gray)
- Animated edges for strong correlations
- Interactive controls (zoom, pan, minimap)

### Data Persistence
- MongoDB for profile storage
- Short profile IDs (10 characters)
- Shareable URLs
- JSON export capability

## 🏆 Production Quality Features

✅ **Modular Architecture**: Clear separation of concerns
✅ **TypeScript**: Full type safety across frontend and backend
✅ **Error Handling**: Comprehensive error states and user feedback
✅ **Responsive Design**: Works on mobile, tablet, and desktop
✅ **Animations**: Smooth Framer Motion transitions
✅ **Accessibility**: Semantic HTML and ARIA labels
✅ **Performance**: Optimized bundle with Vite
✅ **Scalable**: Clean code structure for future enhancements

## 📝 Future Enhancements

- User authentication
- Historical profile comparison
- Team/organization profiles
- Advanced analytics dashboard
- Export to PDF
- Social media sharing cards
- Multi-language support
- Additional question sets

## 🤝 Contributing

This is an MVP application. To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ using Node.js, Express, React, TypeScript, and MongoDB**
