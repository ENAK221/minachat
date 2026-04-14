import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative min-h-[80vh] overflow-hidden">

      {/* Background animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 animate-[gradient_8s_ease_infinite]"></div>

      {/* particules flottantes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`particle w-3 h-3 bg-white opacity-50 rounded-full`}
            style={{
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s",
            }}
          />
        ))}
      </div>

      {/* vague SVG bas */}
      <svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#ffffff"
          d="M0,256L48,234.7C96,213,192,171,288,144C384,117,480,107,576,101.3C672,96,768,96,864,117.3C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>

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

      {/* fin hero, section fonctionnalités */}
      <div className="relative z-10 bg-white py-16 px-6">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Pourquoi choisir Minachat ?
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "💬",
              title: "Chat rapide",
              desc: "Discutez instantanément avec vos amis.",
            },
            {
              icon: "🔒",
              title: "Sécurité",
              desc: "Vos données sont protégées et chiffrées.",
            },
            {
              icon: "⚙️",
              title: "Personnalisable",
              desc: "Thèmes et paramètres selon vos goûts.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 * i, duration: 0.6 }}
              className="bg-blue-50 p-6 rounded-xl text-center shadow-md hover:shadow-xl transition"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}


