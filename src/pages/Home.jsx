import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative min-h-[80vh] overflow-hidden">

      {/* Background animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 animate-[gradient_8s_ease_infinite]"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 text-center text-white pt-20 px-6"
      >
        <h1 className="text-5xl font-extrabold drop-shadow-lg">
          Bienvenue sur Minachat
        </h1>

        <p className="mt-4 text-xl opacity-90">
          Le réseau social moderne, rapide et stylé.
        </p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          className="mt-8 bg-white text-blue-700 font-bold px-6 py-3 rounded-xl shadow-lg"
        >
          Explorer
        </motion.button>
      </motion.div>
    </div>
  );
}


