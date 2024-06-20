import React, { useState, useEffect } from 'react';
import './Perifericos.css';

const Perifericos = () => {
    const [perifericos, setPerifericos] = useState([]);
    const [form, setForm] = useState({
        nombre: '',
        fabricante: '',
        fechaSalida: '',
        precio: '',
        cantidad: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    let intervalId; // Variable para almacenar el ID del intervalo

    useEffect(() => {
        // Iniciar la verificación de conexión
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
                    // Eliminar la solicitud procesada de la pila
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
            const response = await fetch('http://localhost:3000/Perifericos');
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

    const getPerifericos = async () => {
        try {
            const response = await fetch('http://localhost:3000/Perifericos');
            const data = await response.json();
            setPerifericos(data);
        } catch (error) {
            console.error(error);
            setPerifericos([]);
        }
    };

    const postPerifericos = async () => {
        const { nombre, fabricante, fechaSalida, precio, cantidad } = form;

        if (!validatePerifericoForm(nombre, fabricante, fechaSalida, precio, cantidad)) {
            return;
        }

        const data = {
            Nombre: nombre,
            Fabricante: fabricante,
            FechaSalida: fechaSalida,
            Precio: parseFloat(precio), // Convertir a float si es necesario
            Cantidad: parseInt(cantidad) // Convertir a entero si es necesario
        };

        const request = {
            url: "http://localhost:3000/PerifericosInsert",
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
            alert("Éxito:", result);
        } catch (error) {
            console.error("Error:", error);
            pushToStack(request);
            alert("Sin conexión. La solicitud se guardó y se enviará cuando haya conexión.");
        }
    };

    const updatePeriferico = async (id) => {
        const { nombre, fabricante, fechaSalida, precio, cantidad } = form;

        if (!validatePerifericoForm(nombre, fabricante, fechaSalida, precio, cantidad)) {
            return;
        }

        const data = {
            Nombre: nombre,
            Fabricante: fabricante,
            FechaSalida: fechaSalida,
            Precio: parseFloat(precio), // Convertir a float si es necesario
            Cantidad: parseInt(cantidad) // Convertir a entero si es necesario
        };

        const request = {
            url: `http://localhost:3000/Perifericos/${id}`,
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
            alert("Periférico actualizado:", result);

            // Actualizar la lista de periféricos después de la actualización
            getPerifericos();
        } catch (error) {
            console.error("Error:", error);
            pushToStack(request);
            alert("Sin conexión. La solicitud se guardó y se enviará cuando haya conexión.");
        }
    };

    const deletePeriferico = async (id) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este periférico?")) {
            return;
        }

        const request = {
            url: `http://localhost:3000/Perifericos/${id}`,
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
            alert("Periférico eliminado:", result);

            // Actualizar la lista de periféricos después de la eliminación
            getPerifericos();
        } catch (error) {
            console.error("Error:", error);
            pushToStack(request);
            alert("Error al eliminar periférico. La solicitud se guardó y se enviará cuando haya conexión.");
        }
    };

    const validatePerifericoForm = (nombre, fabricante, fechaSalida, precio, cantidad) => {
        if (nombre === '' || fabricante === '' || fechaSalida === '' || precio === '' || cantidad === '') {
            alert('Todos los campos son obligatorios para periféricos.');
            return false;
        }

        return true;
    };


   

    return (
        <div className="container">
            <div className="card">
                <h1>Periféricos</h1>

                <form id="perifericoForm">
                    <input type="text" id="nombrePeriferico" placeholder="Nombre" value={form.nombrePeriferico} onChange={(e) => setForm({ ...form, nombrePeriferico: e.target.value })} />
                    <input type="text" id="fabricante" placeholder="Fabricante" value={form.fabricante} onChange={(e) => setForm({ ...form, fabricante: e.target.value })} />
                    <input type="date" id="fechaSalida" placeholder="Fecha de Salida" value={form.fechaSalida} onChange={(e) => setForm({ ...form, fechaSalida: e.target.value })} />
                    <input type="text" id="precio" placeholder="Precio" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} />
                    <input type="number" id="cantidad" placeholder="Cantidad" value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: e.target.value })} />
                    <button type="button" onClick={postPerifericos}>Añadir Periférico</button>
                </form>

                <button type="button" onClick={getPerifericos}>Cargar Periféricos</button>
                <table id="tablePerifericos">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Fabricante</th>
                            <th>Fecha de Salida</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tbodyPerifericos">
                        {perifericos.length > 0 ? (
                            perifericos.map((periferico) => (
                                <tr key={periferico.IdPeriferico}>
                                                                        <td>{periferico.IdPeriferico}</td>
                                    <td>{periferico.Nombre}</td>
                                    <td>{periferico.Fabricante}</td>
                                    <td>{formatDate(periferico.FechaSalida)}</td>
                                    <td>{formatMoney(periferico.Precio)}</td>
                                    <td>{periferico.Cantidad}</td>
                                    <td>
                                        <button onClick={() => updatePeriferico(periferico.IdPeriferico)}>Actualizar</button>
                                        <button onClick={() => deletePeriferico(periferico.IdPeriferico)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">Sin periféricos cargados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Perifericos;

// Función para formatear la fecha
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
};

// Función para formatear el dinero
const formatMoney = (amount) => {
    return amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
};
