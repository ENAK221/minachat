import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../context/UserContext";
import { API_URL } from "../config";

export default function GroupChat() {
  const { id } = useParams();
  const { user } = useUser();
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}/groups`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const group = data.find((g) => g.id === parseInt(id));
        if (group) setGroupName(group.name);
      });
  }, [id, token]);

  useEffect(() => {
    fetch(`${API_URL}/groups/${id}/members`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMembers(data));
  }, [id, token]);

  useEffect(() => {
    const load = () => {
      fetch(`${API_URL}/groups/${id}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => { if (Array.isArray(data)) setMessages(data); });
    };
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, [id, token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    await fetch(`${API_URL}/groups/${id}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: text }),
    });
    setText("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-blue-900 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.45),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.3),_transparent_30%),linear-gradient(180deg,_#1e3a8a_0%,_#1e40af_100%)]" />

      <div className="relative z-10 mx-auto flex h-screen max-w-[1400px] flex-col px-4 py-8">

        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-[0_30px_80px_rgba(15,23,42,0.35)]"
        >
          <div className="flex items-center gap-4">
            <Link to="/groups" className="text-slate-400 hover:text-cyan-300 transition text-sm">
              ← Groupes
            </Link>
            <div className="h-10 w-10 rounded-2xl bg-slate-800/90 ring-1 ring-white/10 flex items-center justify-center font-bold text-cyan-300">
              {groupName ? groupName.charAt(0).toUpperCase() : "G"}
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Groupe</p>
              <h2 className="text-2xl font-semibold text-white">{groupName || "..."}</h2>
            </div>
            <div className="ml-auto rounded-3xl bg-blue-800/80 px-4 py-2 text-sm text-slate-400">
              {members.length} membre{members.length > 1 ? "s" : ""}
            </div>
          </div>
        </motion.div>

        <div className="flex flex-1 gap-6 overflow-hidden">

          {/* Zone messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-blue-900/80 backdrop-blur-xl shadow-xl"
          >
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {messages.length === 0 && (
                <div className="flex h-full items-center justify-center">
                  <div className="rounded-3xl border border-dashed border-white/15 bg-blue-900/70 p-10 text-center text-slate-400">
                    <p className="text-lg font-semibold text-white">Aucun message pour l'instant</p>
                    <p className="mt-2 text-sm">Soyez le premier à écrire !</p>
                  </div>
                </div>
              )}

              {messages.map((msg, i) => {
                const isMe = msg.sender_id === user.id;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className={`flex items-end gap-3 ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    {!isMe && (
                      <img
                        src={msg.sender_avatar || `https://ui-avatars.com/api/?name=${msg.sender_name}&background=1e293b&color=67e8f9`}
                        alt={msg.sender_name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
                      />
                    )}

                    <div className={`flex flex-col max-w-[65%] ${isMe ? "items-end" : "items-start"}`}>
                      {!isMe && (
                        <span className="text-xs text-cyan-300/80 mb-1 ml-1">{msg.sender_name}</span>
                      )}
                      <div className={`rounded-[28px] px-5 py-3 text-base leading-7 shadow-[0_20px_40px_rgba(15,23,42,0.25)] ${
                        isMe
                          ? "bg-cyan-500/90 text-slate-950 rounded-br-none"
                          : "bg-slate-800/90 text-slate-100 rounded-bl-none"
                      }`}>
                        {msg.content}
                      </div>
                      <span className="text-xs text-slate-500 mt-1 mx-1">
                        {new Date(msg.created_at).toLocaleTimeString("fr-FR", {
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Zone de saisie */}
            <div className="border-t border-white/10 bg-blue-800/80 px-6 py-5">
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Tape ton message..."
                  className="flex-1 rounded-3xl border border-white/20 bg-slate-600/60 px-5 py-4 text-white outline-none placeholder:text-slate-300 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
                />
                <button
                  onClick={sendMessage}
                  disabled={!text.trim()}
                  className="rounded-3xl bg-cyan-400 px-6 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-40"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </motion.div>

          {/* Sidebar membres */}
          <motion.aside
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="w-56 hidden md:flex flex-col rounded-3xl border border-white/10 bg-blue-800/80 backdrop-blur-xl shadow-xl overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-white/10">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Membres</p>
              <h3 className="mt-1 text-lg font-bold text-white">{members.length} connecté{members.length > 1 ? "s" : ""}</h3>
            </div>
            <ul className="p-4 space-y-3 overflow-y-auto">
              {members.map((m) => (
                <li key={m.id} className="flex items-center gap-3">
                  <img
                    src={m.avatar_url || `https://ui-avatars.com/api/?name=${m.username}&background=1e293b&color=67e8f9`}
                    alt={m.username}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-200">{m.username}</p>
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400 mt-0.5" />
                  </div>
                </li>
              ))}
            </ul>
          </motion.aside>

        </div>
      </div>
    </div>
  );
}
