import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { UserContext } from "../context/UserContext";
import { API_URL } from "../config";

export default function Profile() {
  const { user, setUser } = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ avatar_url: "", bio: "", username: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${API_URL}/users/me`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setForm({ avatar_url: data.avatar_url || "", bio: data.bio || "", username: data.username });
      })
      .catch(console.error);
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/users/${profile.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setProfile(data);
      setUser((u) => ({ ...u, ...data }));
      setEditing(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="relative min-h-[80vh] overflow-hidden">

      {/* Bannière animée */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 animate-[gradient_8s_ease_infinite]"></div>

      <div className="relative z-10 flex flex-col items-center pt-20 text-white">
        
        {/* Avatar flottant */}
        {profile.avatar_url ? (
          <motion.img
            src={profile.avatar_url}
            alt="avatar"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-32 h-32 rounded-full bg-white/30 backdrop-blur-xl border border-white/40 shadow-xl object-cover"
          />
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-32 h-32 rounded-full bg-white/30 backdrop-blur-xl border border-white/40 shadow-xl flex items-center justify-center text-2xl font-bold text-sky-300"
          >
            {profile.username.charAt(0).toUpperCase()}
          </motion.div>
        )}

        <h1 className="mt-6 text-3xl font-bold drop-shadow-lg">
          {profile.username}
        </h1>

        <p className="opacity-90 mt-2">Membre depuis {new Date(profile.created_at).getFullYear()}</p>

        {editing ? (
          <motion.form
            onSubmit={saveProfile}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mt-10 bg-white/20 backdrop-blur-xl p-6 rounded-xl border border-white/30 shadow-xl w-11/12 max-w-xl flex flex-col gap-4"
          >
            <div>
              <label className="block text-left font-medium">Avatar URL</label>
              <input
                type="text"
                value={form.avatar_url}
                onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                className="w-full p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-left font-medium">Nom</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-left font-medium">À propos</label>
              <textarea
                rows={4}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full p-2 rounded"
              />
            </div>
            <button className="self-end bg-sky-300 text-white px-4 py-2 rounded-lg hover:bg-sky-200 transition">
              Enregistrer
            </button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mt-10 bg-white/20 backdrop-blur-xl p-6 rounded-xl border border-white/30 shadow-xl w-11/12 max-w-xl"
          >
            <h2 className="text-xl font-bold mb-3">À propos</h2>
            <p className="opacity-90">{profile.bio || "Aucune description."}</p>
            <button
              onClick={() => setEditing(true)}
              className="mt-4 bg-sky-300 text-white px-4 py-2 rounded-lg hover:bg-sky-200 transition"
            >Modifier</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}


