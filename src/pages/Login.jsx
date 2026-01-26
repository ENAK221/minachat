import { FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Login() {
  return (
    <div className="relative flex justify-center items-center min-h-[80vh] overflow-hidden">

      {/* Background animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-500 to-cyan-400 animate-[gradient_8s_ease_infinite]"></div>

      {/* Particules lumineuses */}
      <div className="absolute w-72 h-72 bg-white/20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-blue-300/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

      {/* Formulaire */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 backdrop-blur-xl bg-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/30"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-lg">
          Connexion
        </h1>

        <form className="flex flex-col gap-5">
          <div className="flex items-center bg-white/20 border border-white/40 p-3 rounded-xl text-white">
            <FaEnvelope className="text-white/80 mr-3 text-xl" />
            <input
              type="email"
              placeholder="Email"
              className="bg-transparent w-full outline-none placeholder-white/70"
            />
          </div>

          <div className="flex items-center bg-white/20 border border-white/40 p-3 rounded-xl text-white">
            <FaLock className="text-white/80 mr-3 text-xl" />
            <input
              type="password"
              placeholder="Mot de passe"
              className="bg-transparent w-full outline-none placeholder-white/70"
            />
          </div>

          <button
            type="submit"
            className="bg-white text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-100 transition shadow-lg"
          >
            Se connecter
          </button>
        </form>

        <p className="text-center mt-4 text-white">
          Pas de compte ?{" "}
          <a href="/register" className="font-bold underline">
            Inscription
          </a>
        </p>
      </motion.div>
    </div>
  );
}
