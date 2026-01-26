import { Link } from "react-router-dom";
import { FaHome, FaUser, FaSignInAlt } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center animate-fade-in">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Minachat
      </Link>

      <div className="flex gap-6 text-lg">
        <Link to="/" className="flex items-center gap-2 hover:text-blue-600 transition">
          <FaHome /> Accueil
        </Link>

        <Link to="/profile/1" className="flex items-center gap-2 hover:text-blue-600 transition">
          <FaUser /> Profil
        </Link>

        <Link to="/login" className="flex items-center gap-2 hover:text-blue-600 transition">
          <FaSignInAlt /> Connexion
        </Link>
      </div>
    </nav>
  );
}
