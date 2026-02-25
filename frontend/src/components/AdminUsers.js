import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/users/admin/list", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUsers(res.data);
      } catch (err) {
        setError("No tienes permisos de administrador");
      }
    };

    fetchUsers();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="container">
      <h2>Panel de administración</h2>
      <button onClick={logout}>Cerrar sesión</button>

      {error && <p style={{ color: "#ff0000" }}>{error}</p>}

      <ul>
        {users.map(user => (
          <li key={user._id}>
            <span>{user.username} - {user.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminUsers;
