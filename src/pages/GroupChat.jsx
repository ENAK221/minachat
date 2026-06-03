import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { API_URL } from "../config";

export default function GroupChat() {
  const { id } = useParams(); // id du groupe dans l'URL
  const { user } = useUser();
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  // Charger les infos du groupe (nom via la liste des groupes)
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

  // Charger les membres
  useEffect(() => {
    fetch(`${API_URL}/groups/${id}/members`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMembers(data));
  }, [id, token]);

  // Charger les messages (rafraîchissement toutes les 2 secondes)
  useEffect(() => {
    const load = () => {
      fetch(`${API_URL}/groups/${id}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setMessages(data);
        });
    };

    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, [id, token]);

  // Scroll automatique vers le dernier message
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
    <div className="flex h-screen">
      {/* Zone principale du chat */}
      <div className="flex flex-col flex-1">
        {/* En-tête */}
        <div className="bg-white border-b px-6 py-4 shadow-sm">
          <h2 className="text-xl font-bold">{groupName || "Groupe"}</h2>
          <p className="text-sm text-gray-500">{members.length} membres</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50">
          {messages.length === 0 && (
            <p className="text-center text-gray-400 mt-10">
              Aucun message pour l'instant
            </p>
          )}

          {messages.map((msg) => {
            const isMe = msg.sender_id === user.id;
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
              >
                {/* Avatar de l'expéditeur (si ce n'est pas moi) */}
                {!isMe && (
                  <img
                    src={msg.sender_avatar || "https://ui-avatars.com/api/?name=" + msg.sender_name}
                    alt={msg.sender_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}

                <div className={`max-w-xs ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                  {/* Nom de l'expéditeur (si ce n'est pas moi) */}
                  {!isMe && (
                    <span className="text-xs text-gray-500 mb-1 ml-1">
                      {msg.sender_name}
                    </span>
                  )}

                  {/* Bulle du message */}
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm ${
                      isMe
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white text-gray-800 shadow rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Heure */}
                  <span className="text-xs text-gray-400 mt-1 mx-1">
                    {new Date(msg.created_at).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Zone de saisie */}
        <div className="bg-white border-t px-4 py-3 flex gap-3 items-center">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Écrire un message..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 disabled:opacity-40 transition"
          >
            Envoyer
          </button>
        </div>
      </div>

      {/* Sidebar membres */}
      <div className="w-56 bg-white border-l p-4 hidden md:block">
        <h3 className="font-semibold text-sm text-gray-500 uppercase mb-3">
          Membres
        </h3>
        <ul className="space-y-3">
          {members.map((m) => (
            <li key={m.id} className="flex items-center gap-2">
              <img
                src={m.avatar_url || "https://ui-avatars.com/api/?name=" + m.username}
                alt={m.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm">{m.username}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
