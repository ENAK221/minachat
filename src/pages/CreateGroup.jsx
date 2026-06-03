import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function CreateGroup() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Charger la liste de tous les utilisateurs
  useEffect(() => {
    fetch(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => setError("Impossible de charger les utilisateurs"));
  }, [token]);

  // Cocher / décocher un membre
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

      // Rediriger vers le chat du groupe créé
      navigate(`/groups/${data.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Créer un groupe</h1>

      {error && (
        <p className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nom du groupe */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Nom du groupe
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Équipe projet..."
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Sélection des membres */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Membres ({selectedIds.length} sélectionné{selectedIds.length > 1 ? "s" : ""})
          </label>
          <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
            {users.map((user) => (
              <label
                key={user.id}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(user.id)}
                  onChange={() => toggleMember(user.id)}
                  className="accent-blue-500"
                />
                {user.avatar_url && (
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span>{user.username}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Créer le groupe
        </button>
      </form>
    </div>
  );
}
