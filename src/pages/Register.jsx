import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { API_URL } from "../config";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
      });

      alert("Inscription réussie !");
    } catch (err) {
      if (err.response) {
        alert(err.response.data.error || err.response.data.message);
      } else {
        alert("Erreur réseau");
      }
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-[80vh] overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-pink-500 to-red-400 animate-[gradient_8s_ease_infinite]"></div>

      <div className="absolute w-72 h-72 bg-white/20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-pink-300/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 backdrop-blur-xl bg-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/30"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-lg">
          Inscription
        </h1>

        <form className="flex flex-col gap-5" onSubmit={handleRegister}>
          <div className="flex items-center bg-white/20 border border-white/40 p-3 rounded-xl text-white">
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              className="bg-transparent w-full outline-none placeholder-white/70"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex items-center bg-white/20 border border-white/40 p-3 rounded-xl text-white">
            <input
              type="email"
              placeholder="Email"
              className="bg-transparent w-full outline-none placeholder-white/70"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex items-center bg-white/20 border border-white/40 p-3 rounded-xl text-white">
            <input
              type="password"
              placeholder="Mot de passe"
              className="bg-transparent w-full outline-none placeholder-white/70"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-white text-pink-700 font-bold py-3 rounded-xl hover:bg-pink-100 transition shadow-lg"
          >
            S'inscrire
          </button>
        </form>

        <p className="text-center mt-4 text-white">
          Déjà un compte ?{" "}
          <a href="/login" className="font-bold underline">
            Connexion
          </a>
        </p>
      </motion.div>
    </div>
  );
}
