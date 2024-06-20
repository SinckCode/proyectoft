import { useContext, useState } from "react";
import { signInWithEmailAndPassword  } from "firebase/auth";
import { auth } from "../../firebase";
import "./login.scss"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import myIMG from "../../resourses/a.png";

const Login = () => {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const {dispatch} = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword (auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        dispatch({type: "LOGIN", payload: user});
        navigate("/");
        console.log(user);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
      });
  }
  
  return (
    <div className="login-page">
      <div id="login-form" className="login-form">
        <div className="input-field">
          <div className="losh1">
            <h1>Inicia Sesión</h1>
          </div>
          
          
          <input type="email" placeholder="Correo" onChange={e => setEmail(e.target.value) }  />
          <input type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} />
          <button type="submit" onClick={handleLogin} className="button">Inicia Sesión</button>
          
        </div>
        <span className="otro">¿No tienes cuenta?, <span className='regis' onClick={() => navigate('/Registrate')}>Registrate</span></span>
      </div>

      {error && <span className="error-message">Correo o Contraseña incorrectos</span>}
    </div>
  )
}

export default Login;
