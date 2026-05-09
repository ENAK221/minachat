import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      alert("Connexion réussie !");

      // 🔥 Sauvegarde token + user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 🔥 Mise à jour du contexte
      setUser(res.data.user);

      // 🔥 Redirection vers le chat
      navigate("/chat");

    } catch (err) {
      if (err.response) {
        alert(err.response.data.error || err.response.data.message);
      } else {
        alert("Erreur réseau");
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A]">

      {/* Halo lumineux */}
      <div className="absolute w-[600px] h-[600px] bg-blue-500/20 blur-[180px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[600px] h-[600px] bg-purple-500/20 blur-[180px] rounded-full bottom-[-100px] right-[-100px]" />

      {/* Particules */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-pulse"
            style={{
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Carte login */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-10 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
      >
        <h1 className="text-4xl font-bold text-center text-white mb-8 tracking-tight">
          Connexion
        </h1>

        <form className="flex flex-col gap-6" onSubmit={handleLogin}>
          <div className="flex flex-col gap-2">
            <label className="text-white/80 text-sm">Email</label>
            <input
              type="email"
              placeholder="exemple@gmail.com"
              className="p-3 rounded-xl bg-white/10 text-white placeholder-white/40 outline-none border border-white/20 focus:border-white/40 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white/80 text-sm">Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              className="p-3 rounded-xl bg-white/10 text-white placeholder-white/40 outline-none border border-white/20 focus:border-white/40 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-white text-purple-700 font-bold py-3 rounded-xl hover:bg-purple-100 transition shadow-lg"
          >
            Se connecter
          </button>
        </form>

        <p className="text-center mt-4 text-white">
          Pas encore de compte ?{" "}
          <a href="/register" className="font-bold underline">
            S'inscrire
          </a>
        </p>
      </motion.div>
    </div>
  );
}
