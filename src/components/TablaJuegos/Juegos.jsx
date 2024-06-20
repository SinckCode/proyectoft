import React, { useState, useEffect } from 'react';
import './Juegos.css';

const Juegos = () => {
    const [juegos, setJuegos] = useState([]);
    const [form, setForm] = useState({
        nombre: '',
        numJugadores: 1,
        genero: '',
        publisher: '',
        fechaSalida: '',
        precio: '',
        cantidad: 0,
        idConsola: ''
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
            const response = await fetch('http://localhost:3000/juegos');
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

    const getJuegos = async () => {
        try {
            const response = await fetch('http://localhost:3000/juegos');
            const data = await response.json();
            setJuegos(data);
        } catch (error) {
            console.error(error);
            setJuegos([]);
        }
    };

    const postJuego = async () => {
        const { nombre, numJugadores, genero, publisher, fechaSalida, precio, cantidad, idConsola } = form;

        if (!validateJuegoForm(nombre, genero, publisher, fechaSalida, precio, cantidad, idConsola)) {
            return;
        }

        const data = {
            Nombre: nombre,
            NumJugadores: numJugadores,
            Genero: genero,
            Publisher: publisher,
            FechaSalida: fechaSalida,
            Precio: precio,
            Cantidad: cantidad,
            IdConsola: idConsola
        };

        const request = {
            url: "http://localhost:3000/JuegosInsert",
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

    const updateJuego = async (id) => {
        // Aquí puedes manejar la actualización localmente en la interfaz de usuario
        // Actualizar la interfaz de usuario con el nuevo nombre, género, etc.
        // mientras el usuario está offline.

        // Luego, guarda la solicitud en el almacenamiento local para procesarla más tarde.
        const newName = prompt("Nuevo nombre:");
        const newGenero = prompt("Nuevo género:");
        const newPublisher = prompt("Nuevo publisher:");
        const newFechaSalida = prompt("Nueva fecha de salida (AAAA-MM-DD):");
        const newPrecio = prompt("Nuevo precio:");
        const newCantidad = prompt("Nueva cantidad:");
        const newIdConsola = prompt("Nuevo ID de consola:");

        const data = {
            ID_Juego: id,
            Nombre: newName,
            Genero: newGenero,
            Publisher: newPublisher,
            FechaSalida: newFechaSalida,
            Precio: newPrecio,
            Cantidad: newCantidad,
            IdConsola: newIdConsola
        };

        const request = {
            url: `http://localhost:3000/juegos/${id}`,
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
            alert("Juego actualizado:", result);

            // Actualizar la tabla de juegos después de la actualización
            getJuegos();
        } catch (error) {
            console.error("Error:", error);

            // Si hay un error, guarda la solicitud en el almacenamiento local.
            pushToStack(request);
            alert("Sin conexión. La solicitud se guardó y se enviará cuando haya conexión.");
        }
    };

    const deleteJuego = async (id) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este juego?")) {
            return;
        }

        // Aquí puedes manejar la eliminación localmente en la interfaz de usuario
        // Eliminar el juego de la interfaz de usuario mientras el usuario está offline.

        // Luego, guarda la solicitud en el almacenamiento local para procesarla más tarde.
        const request = {
            url: `http://localhost:3000/juegos/${id}`,
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
            alert("Juego eliminado:", result);

            // Actualizar la tabla de juegos después de la eliminación
            getJuegos();
        } catch (error) {
            console.error("Error:", error);

            // Si hay un error, guarda la solicitud en el almacenamiento local.
            pushToStack(request);
            alert("Error al eliminar juego. La solicitud se guardó y se enviará cuando haya conexión.");
        }
    };

    const validateJuegoForm = (nombre, genero, publisher, fechaSalida, precio, cantidad, idConsola) => {
        if (nombre === '' || genero === '' || publisher === '' || fechaSalida === '' || precio === '' || cantidad === '' || idConsola === '') {
            alert('Todos los campos son obligatorios para juegos.');
            return false;
        }

        // Validar que el nombre tenga entre 3 y 60 caracteres
        if (nombre.length < 3 || nombre.length > 60) {
            alert('El nombre del juego debe tener entre 3 y 60 caracteres.');
            return false;
        }

        // Validar que el género tenga entre 3 y 100 caracteres
        if (genero.length < 3 || genero.length > 100) {
            alert('El género debe tener entre 3 y 100 caracteres.');
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

        // Validar que el ID de consola sea un número entero positivo
        const parsedIdConsola = parseInt(idConsola);
        if (isNaN(parsedIdConsola) || parsedIdConsola <= 0 || !Number.isInteger(parsedIdConsola)) {
            alert('El ID de consola debe ser un número entero positivo.');
            return false;
        }

        return true;
    };

    return (
        <div className="container">
            <div className="card">
                <h1>Juegos</h1>

                <form id="juegoForm">
                    <input type="text" id="nombreJuego" placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                    <input type="number" id="numJugadoresJuego" placeholder="Número de Jugadores" value={form.numJugadores} onChange={(e) => setForm({ ...form, numJugadores: e.target.value })} />
                    <input type="text" id="generoJuego" placeholder="Género" value={form.genero} onChange={(e) => setForm({ ...form, genero: e.target.value })} />
                    <input type="text" id="publisherJuego" placeholder="Publisher" value={form.publisher} onChange={(e) => setForm({ ...form, publisher: e.target.value })} />
                    <input type="date" id="fechaSalidaJuego" placeholder="Fecha de Salida" value={form.fechaSalida} onChange={(e) => setForm({ ...form, fechaSalida: e.target.value })} />
                    <input type="number" id="precioJuego" placeholder="Precio" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} />
                    <input type="number" id="cantidadJuego" placeholder="Cantidad" value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: e.target.value })} />
                    <input type="number" id="idConsolaJuego" placeholder="ID de Consola" value={form.idConsola} onChange={(e) => setForm({ ...form, idConsola: e.target.value })} />
                    <button type="button" onClick={postJuego}>Click to POST</button>
                </form>

                <button type="button" onClick={getJuegos}>Registro de juegos</button>
                <table id="tableJuegos">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Número de Jugadores</th>
                            <th>Género</th>
                            <th>Publisher</th>
                            <th>Fecha de Salida</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>ID de Consola</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tbodyJuegos">
                        {juegos.length > 0 ? (
                            juegos.map((juego) => (
                                <tr key={juego.ID_Juego}>
                                    <td>{juego.ID_Juego}</td>
                                    <td>{juego.Nombre}</td>
                                    <td>{juego.NumJugadores}</td>
                                    <td>{juego.Genero}</td>
                                    <td>{juego.Publisher}</td>
                                    <td>{juego.FechaSalida}</td>
                                    <td>{juego.Precio}</td>
                                    <td>{juego.Cantidad}</td>
                                    <td>{juego.IdConsola}</td>
                                    <td>
                                        <button onClick={() => updateJuego(juego.ID_Juego)}>Actualizar</button>
                                        <button onClick={() => deleteJuego(juego.ID_Juego)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10">Sin conexión. Por el momento no tienes conexión a internet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Juegos;
