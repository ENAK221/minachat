import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";

// Pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import ChatPage from "./pages/ChatPage.jsx";

// Contexte + protections
import { UserProvider } from "./context/UserContext.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Layout>
          <Routes>

            {/* Pages publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Page profil protégée */}
            <Route
              path="/profile/:id"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            {/* Page chat protégée */}
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <ChatPage />
                </PrivateRoute>
              }
            />

            {/* Exemple futur : admin */}
            {/*
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            */}

          </Routes>
        </Layout>
      </BrowserRouter>
    </UserProvider>
  );
}
