import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    <div className="max-w-lg mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes groupes</h1>
        <Link
          to="/groups/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          + Nouveau groupe
        </Link>
      </div>

      {loading && (
        <p className="text-center text-gray-400">Chargement...</p>
      )}

      {!loading && groups.length === 0 && (
        <div className="text-center mt-16 text-gray-400">
          <p className="text-lg">Aucun groupe pour l'instant</p>
          <Link
            to="/groups/new"
            className="inline-block mt-4 text-blue-600 hover:underline"
          >
            Créer mon premier groupe
          </Link>
        </div>
      )}

      <ul className="space-y-3">
        {groups.map((group) => (
          <li key={group.id}>
            <Link
              to={`/groups/${group.id}`}
              className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition"
            >
              {/* Icône du groupe */}
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                {group.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="font-semibold">{group.name}</p>
                <p className="text-sm text-gray-400">
                  Créé le{" "}
                  {new Date(group.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
