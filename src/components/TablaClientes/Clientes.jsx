import React, { useState, useEffect } from 'react';
import './Clientes.css';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        direccion: ''
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
            const response = await fetch('http://localhost:3000/clientes');
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

    const getClientes = async () => {
        try {
            const response = await fetch('http://localhost:3000/clientes');
            const data = await response.json();
            setClientes(data);
        } catch (error) {
            console.error(error);
            setClientes([]);
        }
    };

    const postCliente = async () => {
        const { nombre, apellido, telefono, direccion } = form;

        // Aquí puedes agregar la validación de los campos del cliente si es necesario

        const data = {
            Nombre: nombre,
            Apellido: apellido,
            Telefono: telefono,
            Direccion: direccion
        };

        const request = {
            url: "http://localhost:3000/ClientesInsert",
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
            alert("Cliente registrado:", result);

            // Actualizar la lista de clientes después de la inserción
            getClientes();
        } catch (error) {
            console.error("Error:", error);
            pushToStack(request);
            alert("Sin conexión. El cliente se guardó y se enviará cuando haya conexión.");
        }
    };

    const updateCliente = async (id) => {
        // Simulación de actualización local en la interfaz de usuario
        const newName = prompt("Nuevo nombre:");
        const newApellido = prompt("Nuevo apellido:");
        const newTelefono = prompt("Nuevo teléfono:");
        const newDireccion = prompt("Nueva dirección:");

        const data = {
            ID_Cliente: id,
            Nombre: newName,
            Apellido: newApellido,
            Telefono: newTelefono,
            Direccion: newDireccion
        };

        const request = {
            url: `http://localhost:3000/clientes/${id}`,
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
            alert("Cliente actualizado:", result);

            // Actualizar la lista de clientes después de la actualización
            getClientes();
        } catch (error) {
            console.error("Error:", error);

            // Si hay un error, guarda la solicitud en el almacenamiento local.
            pushToStack(request);
            alert("Sin conexión. La solicitud de actualización se guardó y se enviará cuando haya conexión.");
        }
    };

    const deleteCliente = async (id) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este cliente?")) {
            return;
        }

        const request = {
            url: `http://localhost:3000/clientes/${id}`,
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
            alert("Cliente eliminado:", result);

            // Actualizar la lista de clientes después de la eliminación
            getClientes();
        } catch (error) {
            console.error("Error:", error);

            // Si hay un error, guarda la solicitud en el almacenamiento local.
            pushToStack(request);
            alert("Error al eliminar cliente. La solicitud se guardó y se enviará cuando haya conexión.");
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h1>Clientes</h1>

                <form id="clienteForm">
                    <input type="text" id="nombreCliente" placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                    <input type="text" id="apellidoCliente" placeholder="Apellido" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
                    <input type="tel" id="telefonoCliente" placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
                    <input type="text" id="direccionCliente" placeholder="Dirección" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
                    <button type="button" onClick={postCliente}>Agregar Cliente</button>
                </form>

                <button type="button" onClick={getClientes}>Registro de clientes</button>
                <table id="tableClientes">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Teléfono</th>
                            <th>Dirección</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tbodyClientes">
                        {clientes.length > 0 ? (
                            clientes.map((cliente) => (
                                <tr key={cliente.IdClientes}>
                                    <td>{cliente.IdClientes}</td>
                                    <td>{cliente.Nombre}</td>
                                    <td>{cliente.Apellido}</td>
                                    <td>{cliente.Telefono}</td>
                                    <td>{cliente.Direccion}</td>
                                    <td>
                                        <button onClick={() => updateCliente(cliente.IdClientes)}>Actualizar</button>
                                        <button onClick={() => deleteCliente(cliente.IdClientes)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">Sin clientes registrados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
            </div>
        </div>
    );
};

export default Clientes;
