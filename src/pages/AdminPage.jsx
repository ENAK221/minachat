import { useEffect, useState } from "react";
import { API_URL } from "../config";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    validated: true,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Impossible de charger les utilisateurs.");
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, body) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}${body.is_validated !== undefined ? "/validate" : body.warning !== undefined ? "/warn" : ""}`, {
        method: body.method || "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body.payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");
      setUsers((current) => current.map((user) => (user.id === id ? data : user)));
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleValidation = async (userId, nextState) => {
    await updateUser(userId, {
      method: "PATCH",
      payload: { is_validated: nextState },
    });
  };

  const warnUser = async (userId) => {
    await updateUser(userId, {
      method: "POST",
      payload: {},
      warning: true,
    });
  };

  const resetWarnings = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ warning_count: 0 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");
      setUsers((current) => current.map((user) => (user.id === userId ? data : user)));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;

    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");
      setUsers((current) => current.filter((user) => user.id !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  const createUser = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          role: form.role,
          validated: form.validated,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Impossible de créer l'utilisateur.");
      setUsers((current) => [data, ...current]);
      setForm({ username: "", email: "", password: "", role: "user", validated: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const pendingUsers = users.filter((user) => !user.is_validated);

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="overflow-hidden rounded-[36px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Espace administrateur</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Gestion des utilisateurs</h1>
              <p className="mt-2 max-w-2xl text-slate-300">Liste des comptes et actions rapides pour valider, avertir ou supprimer, avec un style cohérent à l'application.</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 px-5 py-4 text-lg font-semibold text-cyan-300 shadow-lg shadow-cyan-500/10">
              {users.length} utilisateur{users.length > 1 ? "s" : ""}
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-200 ring-1 ring-rose-500/20">
              {error}
            </div>
          )}

          <div className="mt-8 rounded-[30px] border border-cyan-500/10 bg-slate-950/90 p-6 shadow-lg shadow-cyan-500/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Inscriptions en attente</h2>
                <p className="mt-1 text-sm text-slate-400">Valide ou refuse les nouveaux utilisateurs avant qu’ils ne puissent accéder au chat.</p>
              </div>
              <span className="inline-flex rounded-full bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-200">
                {pendingUsers.length} en attente
              </span>
            </div>

            {pendingUsers.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-slate-400">
                Aucun utilisateur en attente.
              </div>
            ) : (
              <div className="mt-6 grid gap-4">
                {pendingUsers.map((user) => (
                  <div key={user.id} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4 shadow-inner shadow-slate-950/20">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Nouvelle inscription</p>
                        <p className="mt-2 text-lg font-semibold text-white">{user.username}</p>
                        <p className="text-sm text-slate-400">{user.email}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => toggleValidation(user.id, true)}
                          className="rounded-full border border-emerald-400 bg-emerald-400/15 px-4 py-2 text-sm font-semibold text-emerald-100 transition duration-200 hover:bg-emerald-400 hover:text-white"
                        >
                          Valider
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="rounded-full border border-rose-500 bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-100 transition duration-200 hover:bg-rose-500 hover:text-white"
                        >
                          Refuser
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950 shadow-inner shadow-slate-950/20">
            <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
              <thead className="bg-slate-900/95 text-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium uppercase tracking-[0.12em] text-slate-400">Utilisateur</th>
                  <th className="px-4 py-3 font-medium uppercase tracking-[0.12em] text-slate-400">Email</th>
                  <th className="px-4 py-3 font-medium uppercase tracking-[0.12em] text-slate-400">Role</th>
                  <th className="px-4 py-3 font-medium uppercase tracking-[0.12em] text-slate-400">Statut</th>
                  <th className="px-4 py-3 font-medium uppercase tracking-[0.12em] text-slate-400">Avertissements</th>
                  <th className="px-4 py-3 font-medium uppercase tracking-[0.12em] text-slate-400">Créé le</th>
                  <th className="px-4 py-3 font-medium uppercase tracking-[0.12em] text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950 text-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                      Chargement des utilisateurs...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-900/80">
                      <td className="px-4 py-4 font-medium text-white">{user.username}</td>
                      <td className="px-4 py-4 text-slate-300">{user.email}</td>
                      <td className="px-4 py-4 text-slate-300 capitalize">{user.role}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${user.is_validated ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                          {user.is_validated ? "Validé" : "Bloqué"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-300">{user.warning_count ?? 0}</td>
                      <td className="px-4 py-4 text-slate-400">{user.created_at ? new Date(user.created_at).toLocaleDateString("fr-FR") : "-"}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => toggleValidation(user.id, !user.is_validated)}
                          className={`min-w-[110px] rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] transition duration-200 ${user.is_validated ? "border-rose-500 bg-rose-500/15 text-rose-100 shadow-[0_0_20px_rgba(239,68,68,0.18)] hover:bg-rose-500 hover:text-white" : "border-emerald-500 bg-emerald-500/15 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.18)] hover:bg-emerald-500 hover:text-white"}`}
                        >
                          {user.is_validated ? "Bloquer" : "Débloquer"}
                        </button>
                        <button
                          onClick={() => warnUser(user.id)}
                          className="min-w-[110px] rounded-full border border-orange-400 bg-orange-400/15 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-orange-100 shadow-[0_0_20px_rgba(249,115,22,0.18)] transition duration-200 hover:bg-orange-400 hover:text-white"
                        >
                          Avertir
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="min-w-[110px] rounded-full border border-rose-500 bg-rose-500/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-rose-100 shadow-[0_0_20px_rgba(239,68,68,0.18)] transition duration-200 hover:bg-rose-500 hover:text-white"
                        >
                          Supprimer
                        </button>
                      </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-[34px] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">Créer un nouvel utilisateur</h2>
            <p className="mt-2 text-slate-400">Ajoute un compte utilisateur directement depuis le panneau admin.</p>
          </div>

          <form className="grid gap-4 md:grid-cols-2" onSubmit={createUser}>
            <label className="block">
              <span className="text-sm font-medium text-slate-200">Nom d’utilisateur</span>
              <input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-200">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-200">Mot de passe</span>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-200">Rôle</span>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              >
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </select>
            </label>

            <label className="flex items-center gap-3 rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-slate-200">
              <input
                type="checkbox"
                checked={form.validated}
                onChange={(e) => setForm({ ...form, validated: e.target.checked })}
                className="h-4 w-4 rounded border-slate-500 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-sm">Compte validé immédiatement</span>
            </label>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition duration-200 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Création..." : "Créer un utilisateur"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
