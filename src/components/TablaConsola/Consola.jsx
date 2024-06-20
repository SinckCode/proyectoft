import React, { useState, useEffect } from 'react';
import './Consola.css';

const Consolas = () => {
    const [consolas, setConsolas] = useState([]);
    const [form, setForm] = useState({
        nombre: '',
        propietario: '',
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
            const response = await fetch('http://localhost:3000/consolas');
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

    const getConsolas = async () => {
        try {
            const response = await fetch('http://localhost:3000/consolas');
            const data = await response.json();
            setConsolas(data);
        } catch (error) {
            console.error(error);
            setConsolas([]);
        }
    };

    const postConsola = async () => {
        const { nombre, propietario, fechaSalida, precio, cantidad } = form;

        if (!validateConsolaForm(nombre, propietario, fechaSalida, precio, cantidad)) {
            return;
        }

        const data = {
            Nombre: nombre,
            Propietario: propietario,
            FechaSalida: fechaSalida,
            Precio: precio,
            Cantidad: cantidad
        };

        const request = {
            url: "http://localhost:3000/consolas",
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
            alert("Consola creada:", result);
        } catch (error) {
            console.error("Error:", error);
            pushToStack(request);
            alert("Sin conexión. La solicitud se guardó y se enviará cuando haya conexión.");
        }
    };

    const updateConsola = async (id) => {
        // Implementar lógica de actualización aquí
        // Aquí puedes manejar la actualización localmente en la interfaz de usuario
        // Actualizar la interfaz de usuario con el nuevo nombre, propietario, etc. 
        // mientras el usuario está offline.

        // Luego, guarda la solicitud en el almacenamiento local para procesarla más tarde.
        const newName = prompt("Nuevo nombre:");
        const newPropietario = prompt("Nuevo propietario:");
        const newFechaSalida = prompt("Nueva fecha de salida:");
        const newPrecio = prompt("Nuevo precio:");
        const newCantidad = prompt("Nueva cantidad:");

        const data = {
            IdConsola: id,
            Nombre: newName,
            Propietario: newPropietario,
            FechaSalida: newFechaSalida,
            Precio: newPrecio,
            Cantidad: newCantidad
        };

        const request = {
            url: `http://localhost:3000/consolas/${id}`,
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
            alert("Consola actualizada:", result);

            // Actualizar la tabla de consolas después de la actualización
            getConsolas();
        } catch (error) {
            console.error("Error:", error);

            // Si hay un error, guarda la solicitud en el almacenamiento local.
            pushToStack(request);
            alert("Sin conexión. La solicitud se guardó y se enviará cuando haya conexión.");
        }
    };

    const deleteConsola = async (id) => {
        if (!confirm("¿Estás seguro de que quieres eliminar esta consola?")) {
            return;
        }

        // Aquí puedes manejar la eliminación localmente en la interfaz de usuario
        // Eliminar la consola de la interfaz de usuario mientras el usuario está offline.

        // Luego, guarda la solicitud en el almacenamiento local para procesarla más tarde.
        const request = {
            url: `http://localhost:3000/consolas/${id}`,
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
            alert("Consola eliminada:", result);

            // Actualizar la tabla de consolas después de la eliminación
            getConsolas();
        } catch (error) {
            console.error("Error:", error);

            // Si hay un error, guarda la solicitud en el almacenamiento local.
            pushToStack(request);
            alert("Error al eliminar consola. La solicitud se guardó y se enviará cuando haya conexión.");
        }
    };

    const validateConsolaForm = (nombre, propietario, fechaSalida, precio, cantidad) => {
        if (nombre === '' || propietario === '' || fechaSalida === '' || precio === '' || cantidad === '') {
            alert('Todos los campos son obligatorios para consolas.');
            return false;
        }
    
        // Validar que el nombre tenga entre 3 y 60 caracteres
        if (nombre.length < 3 || nombre.length > 60) {
            alert('El nombre de la consola debe tener entre 3 y 60 caracteres.');
            return false;
        }
    
        // Validar que el propietario tenga entre 3 y 100 caracteres
        if (propietario.length < 3 || propietario.length > 100) {
            alert('El propietario debe tener entre 3 y 100 caracteres.');
            return false;
        }
    
        // Validar que la fecha de salida no sea en el futuro
        const today = new Date();
        const selectedDate = new Date(fechaSalida);
        if (selectedDate > today) {
            alert('La fecha de salida no puede estar en el futuro.');
            return false;
        }
    
        // Validar que el precio sea un número positivo
        const parsedPrecio = parseFloat(precio);
        if (isNaN(parsedPrecio) || parsedPrecio <= 0) {
            alert('El precio debe ser un número positivo.');
            return false;
        }
    
        // Validar que la cantidad sea un número entero positivo
        const parsedCantidad = parseInt(cantidad);
        if (isNaN(parsedCantidad) || parsedCantidad <= 0 || !Number.isInteger(parsedCantidad)) {
            alert('La cantidad debe ser un número entero positivo.');
            return false;
        }
    
        return true;
    };
    

    return (
        <div className="container">
            <div className="card">
                <h1>Consolas</h1>

                <form id="consolaForm">
                    <input type="text" id="nombreConsola" placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                    <input type="text" id="propietarioConsola" placeholder="Propietario" value={form.propietario} onChange={(e) => setForm({ ...form, propietario: e.target.value })} />
                    <input type="date" id="fechaSalidaConsola" placeholder="Fecha de Salida" value={form.fechaSalida} onChange={(e) => setForm({ ...form, fechaSalida: e.target.value })} />
                    <input type="text" id="precioConsola" placeholder="Precio" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} />
                    <input type="number" id="cantidadConsola" placeholder="Cantidad" value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: e.target.value })} />
                    <button type="button" onClick={postConsola}>Click to POST</button>
                </form>

                <button type="button" onClick={getConsolas}>Registro de consolas</button>
                <table id="tableConsolas">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Propietario</th>
                            <th>Fecha de Salida</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tbodyConsolas">
                        {consolas.length > 0 ? (
                            consolas.map((consola) => (
                                <tr key={consola.IdConsola}>
                                    <td>{consola.IdConsola}</td>
                                    <td>{consola.Nombre}</td>
                                    <td>{consola.Propietario}</td>
                                    <td>{consola.FechaSalida}</td>
                                    <td>{consola.Precio}</td>
                                    <td>{consola.Cantidad}</td>
                                    <td>
                                        <button onClick={() => updateConsola(consola.IdConsola)}>Actualizar</button>
                                        <button onClick={() => deleteConsola(consola.IdConsola)}>Eliminar</button>
                        </td>
                    </tr>
))
) : (
<tr>
    <td colSpan="7">Sin conexión. Por el momento no tienes conexión a internet.</td>
</tr>
)}
</tbody>
</table>

</div>
</div>
);
};

export default Consolas;