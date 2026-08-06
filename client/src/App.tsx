import { Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Questionnaire } from './pages/Questionnaire';
import { Processing } from './pages/Processing';
import { GraphView } from './pages/GraphView';
import { Insights } from './pages/Insights';
import { Export } from './pages/Export';
import { ViewProfile } from './pages/ViewProfile';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Chat } from './pages/Chat';
import { Memories } from './pages/Memories';
import { Triggers } from './pages/Triggers';
import { api } from './utils/api';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = api.getAuthToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes - Dashboard & AI Features */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/memories" element={<ProtectedRoute><Memories /></ProtectedRoute>} />
        <Route path="/triggers" element={<ProtectedRoute><Triggers /></ProtectedRoute>} />
        
        {/* Original Questionnaire Routes */}
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/processing" element={<Processing />} />
        <Route path="/graph" element={<GraphView />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/export" element={<Export />} />
        <Route path="/profile/:id" element={<ViewProfile />} />
      </Routes>
    </div>
  );
}

export default App;
