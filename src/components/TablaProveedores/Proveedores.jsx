import React, { useState, useEffect } from 'react';
import './Proveedores.css';

const Proveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [form, setForm] = useState({
        nombre: '',
        direccion: '',
        telefono: '',
        correo: '',
        personaContacto: '',
        tipoProducto: ''
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
            const response = await fetch('http://localhost:3000/proveedores');
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

    const getProveedores = async () => {
        try {
            const response = await fetch('http://localhost:3000/proveedores');
            const data = await response.json();
            setProveedores(data);
        } catch (error) {
            console.error(error);
            setProveedores([]);
        }
    };

    const postProveedores = async () => {
        const { nombre, direccion, telefono, correo, personaContacto, tipoProducto } = form;

        if (!validateProveedorForm(nombre, direccion, telefono, correo, personaContacto, tipoProducto)) {
            return;
        }

        const data = {
            Nombre: nombre,
            Dirección: direccion,
            Teléfono: telefono,
            Correo_Electrónico: correo,
            Persona_Contacto: personaContacto,
            Tipo_Producto: tipoProducto
        };

        const request = {
            url: "http://localhost:3000/ProveedoresInsert",
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

    const updateProveedor = async (id) => {
        // Aquí puedes manejar la actualización localmente en la interfaz de usuario
        // Actualizar la interfaz de usuario con el nuevo nombre, dirección, etc. 
        // mientras el usuario está offline.
    
        // Luego, guarda la solicitud en el almacenamiento local para procesarla más tarde.
        const newName = prompt("Nuevo nombre:");
        const newDireccion = prompt("Nueva dirección:");
        const newTelefono = prompt("Nuevo teléfono:");
        const newCorreo = prompt("Nuevo correo electrónico:");
        const newPersonaContacto = prompt("Nueva persona de contacto:");
        const newTipoProducto = prompt("Nuevo tipo de producto:");
    
        const data = {
            ID_Proveedor: id,
            Nombre: newName,
            Dirección: newDireccion,
            Teléfono: newTelefono,
            Correo_Electrónico: newCorreo,
            Persona_Contacto: newPersonaContacto,
            Tipo_Producto: newTipoProducto
        };
    
        const request = {
            url: `http://localhost:3000/proveedores/${id}`,
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
            alert("Proveedor actualizado:", result);
    
            // Actualizar la tabla de proveedores después de la actualización
            getProveedores();
        } catch (error) {
            console.error("Error:", error);
    
            // Si hay un error, guarda la solicitud en el almacenamiento local.
            pushToStack(request);
            alert("Sin conexión. La solicitud se guardó y se enviará cuando haya conexión.");
        }
    };
    
    const deleteProveedor = async (id) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este proveedor?")) {
            return;
        }
    
        // Aquí puedes manejar la eliminación localmente en la interfaz de usuario
        // Eliminar el proveedor de la interfaz de usuario mientras el usuario está offline.
    
        // Luego, guarda la solicitud en el almacenamiento local para procesarla más tarde.
        const request = {
            url: `http://localhost:3000/proveedores/${id}`,
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
            alert("Proveedor eliminado:", result);
    
            // Actualizar la tabla de proveedores después de la eliminación
            getProveedores();
        } catch (error) {
            console.error("Error:", error);
    
            // Si hay un error, guarda la solicitud en el almacenamiento local.
            pushToStack(request);
            alert("Error al eliminar proveedor. La solicitud se guardó y se enviará cuando haya conexión.");
        }
    };
    
    
    const validateProveedorForm = (nombre, direccion, telefono, correo, personaContacto, tipoProducto) => {
        if (nombre === '' || direccion === '' || telefono === '' || correo === '' || personaContacto === '' || tipoProducto === '') {
            alert('Todos los campos son obligatorios para proveedores.');
            return false;
        }

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(correo)) {
            alert('El correo electrónico ingresado para proveedores no es válido.');
            return false;
        }

        const regexTelefono = /^\d{10}$/;
        if (!regexTelefono.test(telefono)) {
            alert('El número de teléfono para proveedores debe contener 10 dígitos.');
            return false;
        }

        return true;
    };

    return (
        <div className="container">
            <div className="card">
                <h1>Proveedores</h1>

                <form id="proveedorForm">
                    <input type="text" id="nombreProveedor" placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                    <input type="text" id="direccionProveedor" placeholder="Dirección" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
                    <input type="tel" id="telefonoProveedor" placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
                    <input type="email" id="correoProveedor" placeholder="Correo Electrónico" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} />
                    <input type="text" id="personaContactoProveedor" placeholder="Persona de Contacto" value={form.personaContacto} onChange={(e) => setForm({ ...form, personaContacto: e.target.value })} />
                    <input type="text" id="tipoProductoProveedor" placeholder="Tipo de Producto" value={form.tipoProducto} onChange={(e) => setForm({ ...form, tipoProducto: e.target.value })} />
                    <button type="button" onClick={postProveedores}>Click to POST</button>


                </form>

                <button type="button" onClick={getProveedores}>Registro de proveedores</button>
                <table id="tableProveedores">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Dirección</th>
                            <th>Teléfono</th>
                            <th>Correo Electrónico</th>
                            <th>Persona de Contacto</th>
                            <th>Tipo de Producto</th>
                            <th>Acciones</th>
                            </tr>
                    </thead>
                    <tbody id="tbodyProveedores">
                        {proveedores.length > 0 ? (
                            proveedores.map((proveedor) => (
                                <tr key={proveedor.ID_Proveedor}>
                                    <td>{proveedor.ID_Proveedor}</td>
                                    <td>{proveedor.Nombre}</td>
                                    <td>{proveedor.Dirección}</td>
                                    <td>{proveedor.Teléfono}</td>
                                    <td>{proveedor.Correo_Electrónico}</td>
                                    <td>{proveedor.Persona_Contacto}</td>
                                    <td>{proveedor.Tipo_Producto}</td>
                                    <td>
                                        <button onClick={() => updateProveedor(proveedor.ID_Proveedor)}>Actualizar</button>
                                        <button onClick={() => deleteProveedor(proveedor.ID_Proveedor)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">Sin conexión. Por el momento no tienes conexión a internet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
            </div>
        </div>
    );
};

export default Proveedores;
