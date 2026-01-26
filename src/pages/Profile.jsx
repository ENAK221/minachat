import { motion } from "framer-motion";

export default function Profile() {
  return (
    <div className="relative min-h-[80vh] overflow-hidden">

      {/* Bannière animée */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 animate-[gradient_8s_ease_infinite]"></div>

      <div className="relative z-10 flex flex-col items-center pt-20 text-white">
        
        {/* Avatar flottant */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-32 h-32 rounded-full bg-white/30 backdrop-blur-xl border border-white/40 shadow-xl animate-pulse"
        ></motion.div>

        <h1 className="mt-6 text-3xl font-bold drop-shadow-lg">
          Nom d'utilisateur
        </h1>

        <p className="opacity-90 mt-2">Membre depuis 2024</p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mt-10 bg-white/20 backdrop-blur-xl p-6 rounded-xl border border-white/30 shadow-xl w-11/12 max-w-xl"
        >
          <h2 className="text-xl font-bold mb-3">À propos</h2>
          <p className="opacity-90">
            Ceci est une brève description du profil de l'utilisateur. Il peut inclure des informations telles que les intérêts, la localisation, et d'autres détails pertinents.
          </p>
        </motion.div>
      </div>
    </div>
  );
}


