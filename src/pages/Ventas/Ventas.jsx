import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Datatable from "../../components/datablePagos/DatablePagos"
import "./Ventas.scss";
import Ventas from "../../components/TablaVentas/Ventas";

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
      <Sidebar/>
      <div className="listContainer">

        <Ventas/>
      </div>
    </div>
  );
};

export default List;
