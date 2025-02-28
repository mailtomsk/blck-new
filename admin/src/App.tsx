import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import { useAuthStore } from './store/authStore';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuthStore();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <div className="min-h-screen bg-black">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
