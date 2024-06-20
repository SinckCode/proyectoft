import "./DatatablePagos.scss";
import { DataGrid } from "@mui/x-data-grid";
import { pagosColumns, userColumns, userRows } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../firebase"; // Importa auth de firebase/auth
import { getAuth, deleteUser } from "firebase/auth";

const DatatablePagos = () => {
  const [data, setData] = useState([]);

  useEffect(() => { 
    const unsub = onSnapshot(collection(db, "pagos"), (snapShot) => {
      let list = [];
      snapShot.docs.forEach((doc) => {
        list.push({id: doc.id, ...doc.data()});
      });
      setData(list);
    }, (error) => {
      console.log(error);
    });

    return () => unsub();
  }, []); 

  console.log(data);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "pagos", id));
      setData(data.filter((item) => item.id !== id));

    } catch (error) {
      console.log(error);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Agregar un Nuevo Cobro
        <Link to="/pagos/new2" className="link">
          Agregar Nuevo
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={pagosColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default DatatablePagos;
