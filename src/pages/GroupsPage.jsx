import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { API_URL } from "../config";

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_URL}/groups`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setGroups(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-blue-900 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.45),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.3),_transparent_30%),linear-gradient(180deg,_#1e3a8a_0%,_#1e40af_100%)]" />

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-10">

        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.35)] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">MinaChat</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">Mes groupes</h1>
              <p className="mt-1 text-slate-400">{groups.length} groupe{groups.length > 1 ? "s" : ""}</p>
            </div>
            <Link
              to="/groups/new"
              className="rounded-3xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              + Nouveau
            </Link>
          </div>
        </motion.div>

        {/* Chargement */}
        {loading && (
          <div className="flex justify-center mt-20">
            <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Aucun groupe */}
        {!loading && groups.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-dashed border-white/15 bg-blue-900/70 p-12 text-center text-slate-400"
          >
            <p className="text-lg font-semibold text-white">Aucun groupe pour l'instant</p>
            <p className="mt-2 text-sm">Crée ton premier groupe et invite des membres</p>
            <Link
              to="/groups/new"
              className="inline-block mt-6 rounded-3xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Créer un groupe
            </Link>
          </motion.div>
        )}

        {/* Liste des groupes */}
        <div className="space-y-3">
          {groups.map((group, i) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/groups/${group.id}`}
                className="flex items-center gap-4 rounded-3xl border border-white/10 bg-blue-800/80 px-5 py-4 shadow-xl backdrop-blur-xl transition hover:border-cyan-400/40 hover:bg-cyan-400/10"
              >
                {/* Avatar */}
                <div className="h-12 w-12 rounded-2xl bg-slate-800/90 ring-1 ring-white/10 flex items-center justify-center text-xl font-bold text-cyan-300">
                  {group.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-white">{group.name}</p>
                  <p className="text-sm text-slate-400">
                    Créé le {new Date(group.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </p>
                </div>

                <span className="text-slate-500 text-xl">›</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
