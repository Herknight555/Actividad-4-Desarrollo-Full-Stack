import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

function Register() {
  const [data, setData] = useState({
    username: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    if (!data.username || !data.password) {
      setMessage("Completa todos los campos");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/auth/register",
        data
      );

      setMessage("Registro completado en plan free. Redirigiendo...");
      
      // Pausa breve para mostrar el mensaje antes de redirigir
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (err) {
      setMessage("Error al registrar usuario");
    }
  };

  return (
    <div className="container">
      <h2>Registro</h2>

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

      <button onClick={register}>Registrar</button>

      {message && <p>{message}</p>}

      <p>
        ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
      </p>
    </div>
  );
}

export default Register;
