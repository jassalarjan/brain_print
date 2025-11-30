import { Routes, Route } from 'react-router-dom';
import { Header } from './components/core/Header';
import { Footer } from './components/core/Footer';
import { Landing } from './pages/Landing';
import { Questionnaire } from './pages/Questionnaire';
import { Processing } from './pages/Processing';
import { GraphView } from './pages/GraphView';
import { Insights } from './pages/Insights';
import { Export } from './pages/Export';
import { ViewProfile } from './pages/ViewProfile';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/processing" element={<Processing />} />
          <Route path="/graph" element={<GraphView />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/export" element={<Export />} />
          <Route path="/profile/:id" element={<ViewProfile />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
