import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { API_URL } from "../config";

export default function CreateGroup() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => setError("Impossible de charger les utilisateurs"));
  }, [token]);

  const toggleMember = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Donne un nom au groupe");
    if (selectedIds.length === 0) return setError("Sélectionne au moins un membre");

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, memberIds: selectedIds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      navigate(`/groups/${data.id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-blue-900 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.45),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.3),_transparent_30%),linear-gradient(180deg,_#1e3a8a_0%,_#1e40af_100%)]" />

      <div className="relative z-10 mx-auto max-w-md px-4 py-10">

        <Link to="/groups" className="inline-block mb-6 text-sm text-slate-400 hover:text-cyan-300 transition">
          ← Retour aux groupes
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.35)] backdrop-blur-xl"
        >
          <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">MinaChat</p>
          <h1 className="mt-2 text-3xl font-semibold text-white mb-1">Nouveau groupe</h1>
          <p className="text-slate-400 text-sm mb-7">Donne un nom et choisis les membres</p>

          {error && (
            <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Nom du groupe */}
            <div className="flex flex-col gap-2">
              <label className="text-white/80 text-sm">Nom du groupe</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex : Équipe projet, BTS SIO..."
                className="rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 outline-none focus:border-cyan-400/60 transition"
              />
            </div>

            {/* Membres */}
            <div className="flex flex-col gap-2">
              <label className="text-white/80 text-sm">
                Membres{" "}
                <span className="text-cyan-300">
                  ({selectedIds.length} sélectionné{selectedIds.length > 1 ? "s" : ""})
                </span>
              </label>

              <div className="rounded-2xl border border-white/10 divide-y divide-white/10 max-h-64 overflow-y-auto bg-white/10">
                {users.map((user) => {
                  const selected = selectedIds.includes(user.id);
                  return (
                    <label
                      key={user.id}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${
                        selected ? "bg-cyan-400/10" : "hover:bg-white/5"
                      }`}
                    >
                      <img
                        src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.username}&background=1e293b&color=67e8f9`}
                        alt={user.username}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10"
                      />
                      <span className={`flex-1 text-sm ${selected ? "text-cyan-300 font-medium" : "text-slate-300"}`}>
                        {user.username}
                      </span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                        selected ? "bg-cyan-400 border-cyan-400" : "border-slate-600"
                      }`}>
                        {selected && <span className="text-slate-950 text-xs font-bold">✓</span>}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-3xl bg-cyan-400 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
            >
              {loading ? "Création..." : "Créer le groupe"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
