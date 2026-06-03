import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";

// Pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import CreateGroup from "./pages/CreateGroup.jsx";
import GroupChat from "./pages/GroupChat.jsx";
import GroupsPage from "./pages/GroupsPage.jsx";

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

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />

            {/* Liste des groupes */}
            <Route
              path="/groups"
              element={
                <PrivateRoute>
                  <GroupsPage />
                </PrivateRoute>
              }
            />

            {/* Créer un groupe */}
            <Route
              path="/groups/new"
              element={
                <PrivateRoute>
                  <CreateGroup />
                </PrivateRoute>
              }
            />

            {/* Chat de groupe */}
            <Route
              path="/groups/:id"
              element={
                <PrivateRoute>
                  <GroupChat />
                </PrivateRoute>
              }
            />

          </Routes>
        </Layout>
      </BrowserRouter>
    </UserProvider>
  );
}
