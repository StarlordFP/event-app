import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages (create these as you go)
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EventListPage from './pages/EventListPage';
import EventDetailPage from './pages/EventDetailPage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/events" element={<EventListPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />

          {/* Protected */}
          <Route
            path="/events/new"
            element={
              <ProtectedRoute>
                <CreateEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:id/edit"
            element={
              <ProtectedRoute>
                <EditEventPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect root */}
          <Route path="/" element={<Navigate to="/events" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;