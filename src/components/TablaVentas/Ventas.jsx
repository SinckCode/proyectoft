import React, { useState, useEffect } from 'react';
import './Ventas.css';

const Ventas = () => {
    const [ventas, setVentas] = useState([]);
    const [form, setForm] = useState({
        categoria: '',
        idConsola: '',
        idJuego: '',
        idPeriferico: '',
        cantidad: '',
        precioTotal: '',
        fechaVenta: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    let intervalId;

    useEffect(() => {
        intervalId = setInterval(checkConnection, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const pushToStack = (request) => {
        let stack = JSON.parse(localStorage.getItem('offlineRequests')) || [];
        stack.push(request);
        localStorage.setItem('offlineRequests', JSON.stringify(stack));
    };

    const processStack = async () => {
        let stack = JSON.parse(localStorage.getItem('offlineRequests')) || [];
        let updatedStack = [];
    
        while (stack.length > 0) {
            let request = stack.pop();
            try {
                const response = await fetch(request.url, {
                    method: request.method,
                    headers: request.headers,
                    body: JSON.stringify(request.body),
                });
    
                if (response.ok) {
                    console.log('Solicitud procesada:', request);
                } else {
                    throw new Error('Error en la solicitud');
                }
            } catch (error) {
                console.error('Error al procesar la solicitud:', error);
                updatedStack.push(request);
            }
        }
    
        localStorage.setItem('offlineRequests', JSON.stringify(updatedStack));
    };

    const checkConnection = async () => {
        try {
            const response = await fetch('http://localhost:3000/ventas');
            if (response.ok) {
                console.log("Estás en línea.");
                if (!isProcessing) {
                    setIsProcessing(true);
                    await processStack();
                    setIsProcessing(false);
                }
            } else {
                console.log("No estás en línea.");
            }
        } catch (error) {
            console.error("Error al verificar la conexión:", error);
            console.log("No estás en línea.");
        }
    };

    const getVentas = async () => {
        try {
            const response = await fetch('http://localhost:3000/ventas');
            const data = await response.json();
            setVentas(data);
        } catch (error) {
            console.error(error);
            setVentas([]);
        }
    };

    const postVenta = async () => {
        const { categoria, idConsola, idJuego, idPeriferico, cantidad, precioTotal, fechaVenta } = form;

        // Validación del formulario aquí

        const data = {
            Categoria: categoria,
            IdConsola: idConsola,
            IdJuego: idJuego,
            IdPeriferico: idPeriferico,
            Cantidad: cantidad,
            PrecioTotal: precioTotal,
            FechaVenta: fechaVenta
        };

        const request = {
            url: "http://localhost:3000/VentasInsert",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: data
        };

        try {
            const response = await fetch(request.url, {
                method: request.method,
                headers: request.headers,
                body: JSON.stringify(request.body),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            alert("Success:", result);
        } catch (error) {
            console.error("Error:", error);
            pushToStack(request);
            alert("Sin conexión. La solicitud se guardó y se enviará cuando haya conexión.");
        }
    };

    const updateVenta = async (id, newData) => {
        const { categoria, idConsola, idJuego, idPeriferico, cantidad, precioTotal, fechaVenta } = newData;
    
        // Validación del formulario aquí
        if (!validateVentaForm(categoria, idConsola, idJuego, idPeriferico, cantidad, precioTotal, fechaVenta)) {
            return;
        }
    
        const data = {
            Categoria: categoria,
            IdConsola: idConsola,
            IdJuego: idJuego,
            IdPeriferico: idPeriferico,
            Cantidad: cantidad,
            PrecioTotal: precioTotal,
            FechaVenta: fechaVenta
        };
    
        const request = {
            url: `http://localhost:3000/ventas/${id}`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: data
        };
    
        try {
            const response = await fetch(request.url, {
                method: request.method,
                headers: request.headers,
                body: JSON.stringify(request.body),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const result = await response.json();
            alert("Venta actualizada:", result);
    
            // Actualizar la lista de ventas después de la actualización
            getVentas();
        } catch (error) {
            console.error("Error:", error);
    
            // Si hay un error, guardar la solicitud en el almacenamiento local.
            pushToStack(request);
            alert("Sin conexión. La solicitud se guardó y se enviará cuando haya conexión.");
        }
    };
    
    const deleteVenta = async (id) => {
        if (!confirm("¿Estás seguro de que quieres eliminar esta venta?")) {
            return;
        }
    
        const request = {
            url: `http://localhost:3000/ventas/${id}`,
            method: "DELETE",
        };
    
        try {
            const response = await fetch(request.url, {
                method: request.method,
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const result = await response.json();
            alert("Venta eliminada:", result);
    
            // Actualizar la lista de ventas después de la eliminación
            getVentas();
        } catch (error) {
            console.error("Error:", error);
    
            // Si hay un error, guardar la solicitud en el almacenamiento local.
            pushToStack(request);
            alert("Error al eliminar venta. La solicitud se guardó y se enviará cuando haya conexión.");
        }
    };
    
    const validateVentaForm = (categoria, idConsola, idJuego, idPeriferico, cantidad, precioTotal, fechaVenta) => {
        // Validación de campos obligatorios
        if (categoria === '' || idConsola === '' || idJuego === '' || idPeriferico === '' || cantidad === '' || precioTotal === '' || fechaVenta === '') {
            alert('Todos los campos son obligatorios para ventas.');
            return false;
        }
    
        // Validación de tipos de datos y formatos específicos
        if (!Number.isInteger(parseInt(idConsola))) {
            alert('El ID de la consola debe ser un número entero.');
            return false;
        }
    
        if (!Number.isInteger(parseInt(idJuego))) {
            alert('El ID del juego debe ser un número entero.');
            return false;
        }
    
        if (!Number.isInteger(parseInt(idPeriferico))) {
            alert('El ID del periférico debe ser un número entero.');
            return false;
        }
    
        if (!Number.isInteger(parseInt(cantidad)) || parseInt(cantidad) <= 0) {
            alert('La cantidad debe ser un número entero positivo.');
            return false;
        }
    
        if (isNaN(parseFloat(precioTotal)) || parseFloat(precioTotal) <= 0) {
            alert('El precio total debe ser un número positivo.');
            return false;
        }
    
        // Validación de formato de fecha (formato YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(fechaVenta)) {
            alert('El formato de la fecha debe ser YYYY-MM-DD.');
            return false;
        }
    
        // Validación adicional según tus requerimientos específicos
    
        return true;
    };
    
    

    return (
        <div className="container">
            <div className="card">
                <h1>Ventas</h1>

                <form id="ventaForm">
                    <input type="text" id="categoriaVenta" placeholder="Categoría" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} />
                    <input type="number" id="idConsolaVenta" placeholder="ID Consola" value={form.idConsola} onChange={(e) => setForm({ ...form, idConsola: e.target.value })} />
                    <input type="number" id="idJuegoVenta" placeholder="ID Juego" value={form.idJuego} onChange={(e) => setForm({ ...form, idJuego: e.target.value })} />
                    <input type="number" id="idPerifericoVenta" placeholder="ID Periférico" value={form.idPeriferico} onChange={(e) => setForm({ ...form, idPeriferico: e.target.value })} />
                    <input type="number" id="cantidadVenta" placeholder="Cantidad" value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: e.target.value })} />
                    <input type="number" id="precioTotalVenta" placeholder="Precio Total" value={form.precioTotal} onChange={(e) => setForm({ ...form, precioTotal: e.target.value })} />
                    <input type="date" id="fechaVenta" placeholder="Fecha Venta" value={form.fechaVenta} onChange={(e) => setForm({ ...form, fechaVenta: e.target.value })} />
                    <button type="button" onClick={postVenta}>Registro de ventas</button>
                </form>

                <button type="button" onClick={getVentas}>Click to GET</button>
                <table id="tableVentas">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Categoría</th>
                            <th>ID Consola</th>
                            <th>ID Juego</th>
                            <th>ID Periférico</th>
                            <th>Cantidad</th>
                            <th>Precio Total</th>
                            <th>Fecha Venta</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tbodyVentas">
                        {ventas.length > 0 ? (
                            ventas.map((venta) => (
                                <tr key={venta.IdVentas}>
                                    <td>{venta.IdVentas}</td>
                                    <td>{venta.Categoria}</td>
                                    <td>{venta.IdConsola}</td>
                                    <td>{venta.IdJuego}</td>
                                    <td>{venta.IdPeriferico}</td>
                                    <td>{venta.Cantidad}</td>
                                    <td>{venta.PrecioTotal}</td>
                                    <td>{venta.FechaVenta}</td>
                                    <td>
                                        <button onClick={() => updateVenta(venta.IdVentas)}>Actualizar</button>
                                        <button onClick={() => deleteVenta(venta.IdVentas)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">Sin conexión. No se pueden mostrar las ventas en este momento.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
            </div>
        </div>
    );
};

export default Ventas;
