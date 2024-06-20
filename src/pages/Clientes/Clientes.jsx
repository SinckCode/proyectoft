import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Clientes from "../../components/TablaClientes/Clientes";
import "./Clientes.scss";

const List = () => {
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  useEffect(() => {
    const sidebar = document.querySelector(".sidebar");
    const observer = new MutationObserver(() => {
      setIsSidebarActive(sidebar.classList.contains("active"));
    });
    observer.observe(sidebar, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`list ${isSidebarActive ? "sidebar-active" : ""}`}>
      <Sidebar />
      <div className="listContainer">
        <Clientes />
      </div>
    </div>
  );
};

export default List;
