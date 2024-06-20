export const userColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "user",
    headerName: "User",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.image} alt="avatar" />
          {params.row.username}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 230,
  },

  {
    field: "address",
    headerName: "Address",
    width: 100,
  },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
];



export const pagosColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "user",
    headerName: "User",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.image} alt="avatar" />
          {params.row.username}
        </div>
      );
    },
  },
  {
    field: 1,
    headerName: "Nombre del Pagador",
    width: 230,
  },
  {
    field: 2,
    headerName: "Correo Electrónico del Pagador",
    width: 230,
  },
  {
    field: 3,
    headerName: "Monto",
    width: 100,
  },
  {
    field: 4,
    headerName: "Método de Pago",
    width: 160,
  },
  {
    field: 5,
    headerName: "Fecha de Pago",
    width: 160,
  },
  {
    field: 6,
    headerName: "ID de Transacción",
    width: 160,
  },
];