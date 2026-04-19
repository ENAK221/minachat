import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0A] flex flex-col">

      {/* Halo lumineux */}
      <div className="absolute w-[600px] h-[600px] bg-blue-500/20 blur-[180px] rounded-full top-[-150px] left-[-150px]" />
      <div className="absolute w-[600px] h-[600px] bg-purple-500/20 blur-[180px] rounded-full bottom-[-150px] right-[-150px]" />

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

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 text-center text-white pt-32 px-6"
      >
        <h1 className="text-6xl font-extrabold drop-shadow-xl tracking-tight">
          Bienvenue sur Minachat
        </h1>

        <p className="mt-6 text-2xl opacity-90 max-w-2xl mx-auto">
          Le réseau social nouvelle génération. Rapide, sécurisé, élégant.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="mt-10 bg-white text-black font-semibold px-8 py-4 rounded-xl shadow-xl hover:bg-gray-100 transition"
        >
          Explorer
        </motion.button>
      </motion.div>

      {/* SECTION FONCTIONNALITÉS */}
      <div className="relative z-10 mt-32 bg-white/10 backdrop-blur-xl border-t border-white/10 py-20 px-6">
        <h2 className="text-4xl font-bold text-center text-white mb-12">
          Pourquoi choisir Minachat ?
        </h2>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: "💬",
              title: "Chat instantané",
              desc: "Discutez en temps réel avec une fluidité parfaite.",
            },
            {
              icon: "🔒",
              title: "Sécurité avancée",
              desc: "Vos données sont protégées avec un chiffrement moderne.",
            },
            {
              icon: "⚙️",
              title: "Ultra personnalisable",
              desc: "Thèmes, préférences, interface : tout est modulable.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl text-center shadow-xl hover:shadow-2xl transition"
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-2xl font-semibold text-white mb-3">{f.title}</h3>
              <p className="text-white/70">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
