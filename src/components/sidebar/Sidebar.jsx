// Sidebar.jsx
import "./sidebar.css";
import { Link, useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { auth } from "../../firebase"; // Import auth from firebase
import { AiOutlineMenu } from "react-icons/ai";
import { MdDashboard } from "react-icons/md";
import { GrAd } from "react-icons/gr";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { FaParachuteBox } from "react-icons/fa6";
import { FaProductHunt } from "react-icons/fa";
import { GiConsoleController } from "react-icons/gi";
import { GiGameConsole } from "react-icons/gi";
import { FaMoneyBillTransfer } from "react-icons/fa6";





const Sidebar = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(DarkModeContext);
  const { dispatch: authDispatch } = useContext(AuthContext);

  const handleLogout = (e) => {
    e.preventDefault();

    signOut(auth).then(() => {
      // Signed out
      authDispatch({ type: "LOGOUT" });
      localStorage.removeItem("user"); // Remove user from local storage
      navigate("/login");
    }).catch((error) => {
      console.error(error);
      // Handle errors
    });
  };

  useEffect(() => {
    const btn = document.querySelector("#btn");
    const sidebar = document.querySelector(".sidebar");

    btn.onclick = () => {
      sidebar.classList.toggle("active");
    };
  }, []);

  return (
    <div className="sidebar">
      <div className="top">
        <div className="logo">
          <GrAd />
          <span>Taller Programa</span>
          
        </div>
        <span id='btn'><AiOutlineMenu /></span>
      </div>

      <hr />
      <div className="center">
        <ul>
          <Link to="/" style={{ textDecoration: "none" }}>
            <li>
              <a>
                <i><MdDashboard className="icon" /></i>
                
                
                <span className="nav-item">Inicio</span>
              </a>
              <span className="tooltip">Inicio</span>
            </li>
          </Link>
          
          <Link to="/users" style={{ textDecoration: "none" }}>
            <li>
              <a>
              <i><PersonOutlineIcon className="icon" /> </i>
                
                <span className="nav-item">Usuarios</span>
              </a>
              <span className="tooltip">Usuarios</span>
            </li>
          </Link>
          
          <Link to="/pagos" style={{ textDecoration: "none" }}>
            <li>
              <a>
              <i> <CreditCardIcon className="icon" /></i>
                
                <span className="nav-item">Pagos</span>
              </a>
              <span className="tooltip">Pagos</span>
            </li>
          </Link>

          <Link to="/proveedores" style={{ textDecoration: "none" }}>
            <li>
              <a>
              <i> <FaParachuteBox className="icon" /></i>
                
                <span className="nav-item">Proveedores</span>
              </a>
              <span className="tooltip">Proveedores</span>
            </li>
          </Link>

          <Link to="/clientes" style={{ textDecoration: "none" }}>
            <li>
              <a>
              <i> <MdOutlinePeopleAlt className="icon" /></i>
                
                <span className="nav-item">Clientes</span>
              </a>
              <span className="tooltip">Clientes</span>
            </li>
          </Link>

          <Link to="/perifericos" style={{ textDecoration: "none" }}>
            <li>
              <a>
              <i> <FaProductHunt className="icon" /></i>
                
                <span className="nav-item">Perifericos</span>
              </a>
              <span className="tooltip">Perifericos</span>
            </li>
          </Link>

          <Link to="/consolas" style={{ textDecoration: "none" }}>
            <li>
              <a>
              <i> <GiGameConsole className="icon" /></i>
                
                <span className="nav-item">Consolas</span>
              </a>
              <span className="tooltip">Consolas</span>
            </li>
          </Link>

          <Link to="/juegos" style={{ textDecoration: "none" }}>
            <li>
              <a>
              <i> <GiConsoleController className="icon" /></i>
                
                <span className="nav-item">Juegos</span>
              </a>
              <span className="tooltip">Juegos</span>
            </li>
          </Link>

          <Link to="/ventas" style={{ textDecoration: "none" }}>
            <li>
              <a>
              <i> <FaMoneyBillTransfer className="icon" /></i>
                
                <span className="nav-item">Ventas</span>
              </a>
              <span className="tooltip">Ventas</span>
            </li>
          </Link>
          
          <li onClick={handleLogout}>
            <a>
            <i> <ExitToAppIcon className="icon" /></i>
              
              <span className="nav-item">Cerrar Sesión</span>
            </a>
            <span className="tooltip">Cerrar Sesión</span>
          </li>
        </ul>
      </div>
      
      
    </div>
  );
};

export default Sidebar;
