import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

function Login() {
  const [data, setData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/auth/login",
        data
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/playlist");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>

      <input
        placeholder="Usuario"
        onChange={e =>
          setData({ ...data, username: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Contraseña"
        onChange={e =>
          setData({ ...data, password: e.target.value })
        }
      />

      <button onClick={login}>Entrar</button>

      {error && <p style={{ color: "#ff0000" }}>{error}</p>}

      
      <p>
        ¿No tienes cuenta?{" "}
        <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
}

export default Login;
