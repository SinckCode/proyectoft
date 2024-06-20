import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DarkModeContext } from "./context/darkModeContext";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import List2 from "./pages/List2/List2";
import Proveedores from "./pages/Proveedores/Proveedores";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { productInputs, userInputs, pagosInputs, proveedorInputs } from "./formSource";
import "./style/dark.scss";
import { AuthContext } from "./context/AuthContext";
import Clientes from "./pages/Clientes/Clientes";
import Perifericos from "./pages/Perifericos/Perifericos";
import Consolas from "./pages/Consola/Consola";
import Juegos from "./pages/Juegos/Juego";
import Ventas from "./pages/Ventas/Ventas";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  const {currentUser} = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="login" element={<Login />} />
            <Route
              index
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route path="users">
              <Route
                index
                element={
                  <RequireAuth>
                    <List />
                  </RequireAuth>
                }
              />
              <Route
                path=":userId"
                element={
                  <RequireAuth>
                    <Single />
                  </RequireAuth>
                }
              />
              <Route
                path="new"
                element={
                  <RequireAuth>
                    <New inputs={userInputs} title="Add New User" />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="pagos">
              <Route
                index
                element={
                  <RequireAuth>
                    <List2 />
                  </RequireAuth>
                }
              />
              <Route
                path=":productId"
                element={
                  <RequireAuth>
                    <Single />
                  </RequireAuth>
                }
              />
              
            </Route>
            <Route path="proveedores">
              <Route
                index
                element={
                  <RequireAuth>
                    <Proveedores />
                  </RequireAuth>
                }
              />
              
              
            </Route>

            <Route path="clientes">
              <Route
                index
                element={
                  <RequireAuth>
                    <Clientes />
                  </RequireAuth>
                }
              />
              
              
            </Route>

            <Route path="perifericos">
              <Route
                index
                element={
                  <RequireAuth>
                    <Perifericos />
                  </RequireAuth>
                }
              />
              
              
            </Route>

            <Route path="consolas">
              <Route
                index
                element={
                  <RequireAuth>
                    <Consolas />
                  </RequireAuth>
                }
              />
              
              
            </Route>

            <Route path="juegos">
              <Route
                index
                element={
                  <RequireAuth>
                    <Juegos />
                  </RequireAuth>
                }
              />
              
              
            </Route>

            <Route path="ventas">
              <Route
                index
                element={
                  <RequireAuth>
                    <Ventas />
                  </RequireAuth>
                }
              />
              
              
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
