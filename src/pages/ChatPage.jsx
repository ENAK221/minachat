import { motion } from "framer-motion";

export default function ChatPage() {
  return (
    <div className="relative min-h-[80vh] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-fuchsia-500 to-cyan-500 opacity-80"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl w-full bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-10 shadow-2xl"
        >
          <h1 className="text-4xl font-bold mb-4">Bienvenue dans le chat</h1>
          <p className="text-lg opacity-90 mb-6">
            Cette page est prête pour le chat en temps réel. Connectez-vous pour commencer à discuter avec vos amis.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/15 p-5">
              <h2 className="text-xl font-semibold mb-2">Espace conversation</h2>
              <p className="text-sm opacity-80">
                Les messages seront affichés ici dès que la fonctionnalité sera activée.
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 p-5">
              <h2 className="text-xl font-semibold mb-2">Utilisateurs en ligne</h2>
              <p className="text-sm opacity-80">
                Retrouvez vos contacts et démarrez une conversation sécurisée.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
