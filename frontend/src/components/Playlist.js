import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Playlist() {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [form, setForm] = useState({ title: "", artist: "" });
  const [editingId, setEditingId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const loadProfile = useCallback(async () => {
    const res = await axios.get("http://localhost:3000/users/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setProfile(res.data);
  }, [token]);

  const loadSongs = useCallback(async () => {
    const res = await axios.get("http://localhost:3000/songs", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setSongs(res.data);
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const bootstrap = async () => {
      try {
        await loadProfile();
        await loadSongs();
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      }
    };

    bootstrap();
  }, [token, navigate, loadProfile, loadSongs]);

  const saveSong = async () => {
    if (!form.title || !form.artist) return;
    setError("");

    if (editingId) {
      await axios.put(
        `http://localhost:3000/songs/${editingId}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setEditingId(null);
    } else {
      try {
        await axios.post("http://localhost:3000/songs", form, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (err) {
        setError(err.response?.data?.message || "No se pudo guardar la canción");
        return;
      }
    }

    setForm({ title: "", artist: "" });
    loadSongs();
  };

  const editSong = song => {
    setForm({ title: song.title, artist: song.artist });
    setEditingId(song._id);
  };

  const deleteSong = async id => {
    await axios.delete(`http://localhost:3000/songs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    loadSongs();
  };

  const upgradeToPremium = async () => {
    const confirmed = window.confirm("¿Estás seguro de pagar para hacerte premium?");
    if (!confirmed) return;

    await axios.post("http://localhost:3000/users/upgrade", {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    await loadProfile();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="container">
      <h2>Playlist</h2>
      {profile && <p>Usuario: {profile.username} | Plan: {profile.role}</p>}

      {profile?.role === "free" && (
        <button onClick={upgradeToPremium}>Pagar</button>
      )}

      <button onClick={logout}>Cerrar sesión</button>

      <input
        placeholder="Canción"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
      />

      <input
        placeholder="Artista"
        value={form.artist}
        onChange={e => setForm({ ...form, artist: e.target.value })}
      />

      <button onClick={saveSong}>
        {editingId ? "Actualizar" : "Agregar"}
      </button>

      {error && <p style={{ color: "#ff0000" }}>{error}</p>}

      <ul>
        {songs.map(song => (
          <li key={song._id}>
            <span>{song.title} - {song.artist}</span>
            <div>
              <button onClick={() => editSong(song)}>Editar</button>
              <button onClick={() => deleteSong(song._id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Playlist;
