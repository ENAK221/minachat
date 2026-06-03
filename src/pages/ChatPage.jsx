import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";

export default function ChatPage() {
  const { user } = useUser();
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
        else console.error("Réponse inattendue :", data);
      })
      .catch((err) => console.error("Erreur users :", err));
  }, [token]);

  useEffect(() => {
    if (!selectedUser || !token) return;

    fetch(
      `http://localhost:5000/messages/conversation/${user.id}/${selectedUser.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Erreur messages :", err));
  }, [selectedUser, user.id, token]);

  const sendMessage = async () => {
    if (!text.trim() || !selectedUser) return;

    const response = await fetch("http://localhost:5000/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        receiver_id: selectedUser.id,
        content: text,
      }),
    });

    if (!response.ok) {
      console.error("Erreur envoi message :", response.statusText);
      return;
    }

    setText("");

    fetch(
      `http://localhost:5000/messages/conversation/${user.id}/${selectedUser.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Erreur recharge messages :", err));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-blue-900 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.45),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.3),_transparent_30%),linear-gradient(180deg,_#1e3a8a_0%,_#1e40af_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.35)] backdrop-blur-xl"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">MinaChat</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Messagerie instantanée
              </h1>
            </div>
            <div className="rounded-3xl bg-blue-800/80 px-5 py-4 shadow-xl shadow-cyan-500/10">
              <p className="text-sm text-slate-400">Connecté en tant que</p>
              <p className="mt-1 font-semibold text-white">{user?.username || "Utilisateur"}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid flex-1 gap-6 lg:grid-cols-[320px_1fr]">
          <motion.aside
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-blue-800/80 p-5 shadow-xl shadow-slate-950/40 backdrop-blur-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">
                  Contacts
                </p>
                <h2 className="mt-3 text-2xl font-bold text-white">Choisis un destinataire</h2>
              </div>
            </div>

            <div className="space-y-3">
              {users.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/15 bg-blue-900/70 p-6 text-slate-400">
                  Aucun utilisateur n'a encore été chargé.
                </div>
              ) : (
                users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`w-full rounded-3xl border px-4 py-4 text-left transition-all duration-200 ${
                      selectedUser?.id === u.id
                        ? "border-cyan-400/40 bg-cyan-400/10 shadow-glow"
                        : "border-white/10 bg-blue-900/70 hover:border-white/20 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-slate-800/90 ring-1 ring-white/10" />
                      <div>
                        <p className="text-lg font-semibold text-white">{u.username}</p>
                        <p className="text-sm text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.aside>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex min-h-[calc(100vh-192px)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-blue-900/80 shadow-xl shadow-slate-950/40 backdrop-blur-xl"
          >
            <div className="border-b border-white/10 px-6 py-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">
                    Conversation
                  </p>
                  <h2 className="text-3xl font-semibold text-white">
                    {selectedUser ? selectedUser.username : "Sélectionne un contact"}
                  </h2>
                </div>
                {selectedUser && (
                  <div className="rounded-3xl bg-blue-800/80 px-4 py-3 text-sm text-slate-300">
                    En discussion avec {selectedUser.username}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {selectedUser ? (
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-white/15 bg-blue-900/70 p-8 text-center text-slate-400">
                      Aucune conversation pour le moment. Envoie le premier message !
                    </div>
                  ) : (
                    messages.map((msg, index) => {
                      const isMine = msg.sender_id === user.id;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.03 }}
                          className={`max-w-[75%] ${
                            isMine ? "ml-auto rounded-[32px] bg-cyan-500/90 text-slate-950" : "rounded-[32px] bg-slate-800/90 text-slate-100"
                          } p-5 shadow-[0_20px_40px_rgba(15,23,42,0.25)]`}
                        >
                          <p className="whitespace-pre-line text-base leading-7">{msg.content}</p>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-white/10 bg-blue-900/70 p-10 text-center text-slate-400">
                  <div>
                    <p className="text-lg font-semibold text-white">Choisis un utilisateur pour discuter</p>
                    <p className="mt-3 text-sm text-slate-400">Ta conversation apparaîtra ici avec un style moderne.</p>
                  </div>
                </div>
              )}
            </div>

            {selectedUser && (
              <div className="border-t border-white/10 bg-blue-800/80 px-6 py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    type="text"
                    placeholder="Tape ton message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 rounded-3xl border border-white/20 bg-slate-600/60 px-5 py-4 text-white outline-none placeholder:text-slate-300 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
                  />
                  <button
                    onClick={sendMessage}
                    className="inline-flex items-center justify-center rounded-3xl bg-cyan-400 px-6 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300"
                  >
                    Envoyer
                  </button>
                </div>
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
}
