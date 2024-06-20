const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const sql = require('mssql');

app.get('/', (req, res) => {
    res.send('Hola, el servidor está funcionando correctamente');
});

app.listen(PORT, () => {
    console.log(`El servidor está en el puerto ${PORT}`);
});

// Middleware
app.use(express.json());
app.use(cors());

const config = {
    user: 'sa',
    password: '200413',
    server: 'SINCK\\SQLEXPRESS',
    database: 'TallerProyecto1',
    options: {
        port: 1433,
        encrypt: false
    },
};

// Conexión a la base de datos
sql.connect(config, (err) => {
    if (err) {
        console.error('Error de conexión:', err);
    } else {
        console.log('Conexión exitosa a la base de datos');
    }
});

// PROVEEDORES
app.get('/proveedores', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Proveedores`;
        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener proveedores', error);
        res.status(500).json({error: 'Error al obtener Proveedores'});
    }
});

app.post('/ProveedoresInsert', async (req, res) => {
    try {
        const { Nombre, Dirección, Teléfono, Correo_Electrónico, Persona_Contacto, Tipo_Producto } = req.body;
        const result = await sql.query`
            INSERT INTO Proveedores (Nombre, Dirección, Teléfono, Correo_Electrónico, Persona_Contacto, Tipo_Producto)
            OUTPUT INSERTED.ID_Proveedor
            VALUES (${Nombre}, ${Dirección}, ${Teléfono}, ${Correo_Electrónico}, ${Persona_Contacto}, ${Tipo_Producto});
        `;
        const nuevoId = result.recordset[0].ID_Proveedor;
        res.json({ message: `Se agregó el proveedor ${Nombre} con ID ${nuevoId}` });
    } catch (error) {
        console.error('Error al agregar proveedor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.put('/proveedores/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const { Nombre, Dirección, Teléfono, Correo_Electrónico, Persona_Contacto, Tipo_Producto } = req.body;
        const result = await sql.query`
            UPDATE Proveedores
            SET Nombre = ${Nombre}, Dirección = ${Dirección}, Teléfono = ${Teléfono}, Correo_Electrónico = ${Correo_Electrónico}, Persona_Contacto = ${Persona_Contacto}, Tipo_Producto = ${Tipo_Producto}
            WHERE ID_Proveedor = ${id};
        `;
        res.json({ message: `Se actualizó el proveedor con ID ${id}` });
    } catch (error) {
        console.error('Error al actualizar proveedor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.delete('/proveedores/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await sql.query`
            DELETE FROM Proveedores
            WHERE ID_Proveedor = ${id};
        `;
        res.json({ message: `Se eliminó el proveedor con ID ${id}` });
    } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// CONSOLAS
app.get('/Consolas', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Consolas`;
        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener Consolas', error);
        res.status(500).json({error: 'Error al obtener las consolas'});
    }
});

app.post('/ConsolasInsert', async (req, res) => {
    try {
        const { Nombre, Propietario, FechaSalida, Precio, Cantidad} = req.body;
        const result = await sql.query`
            INSERT INTO Consolas (Nombre, Propietario, FechaSalida, Precio, Cantidad) VALUES 
            (${Nombre}, ${Propietario}, ${FechaSalida}, ${Precio}, ${Cantidad});`;
        const nuevoId = result.recordset[0].IdConsola;
        res.json({ message: `Se agregó el proveedor ${Nombre} con ID ${nuevoId}` });
    } catch (error) {
        console.error('Error al agregar la consola:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.put('/Consolas/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const { Nombre, Propietario, FechaSalida, Precio, Cantidad} = req.body;
        const result = await sql.query`
            UPDATE Consolas
            SET Nombre = ${Nombre}, Propietario = ${Propietario}, FechaSalida = ${FechaSalida}, Precio = ${Precio}, Cantidad = ${Cantidad}
            WHERE IdConsola = ${id};
        `;
        res.json({ message: `Se actualizó la consola con ID ${id}` });
    } catch (error) {
        console.error('Error al actualizar la consola:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.delete('/Consolas/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await sql.query`
            DELETE FROM Consolas
            WHERE IdConsola = ${id};
        `;
        res.json({ message: `Se eliminó la consola con ID ${id}` });
    } catch (error) {
        console.error('Error al eliminar la consola:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Juegos
app.get('/Juegos', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Juegos`;
        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener los juegos', error);
        res.status(500).json({error: 'Error al obtener los juegos'});
    }
});

app.post('/JuegosInsert', async (req, res) => {
    try {
        const { Nombre, Numjugadores, Genero, Publisher, FechaSalida, Precio, Cantidad, IdConsola} = req.body;
        const result = await sql.query`
            INSERT INTO Juegos (Nombre, Numjugadores, Genero, Publisher, FechaSalida, Precio, IdConsola) VALUES 
            (${Nombre}, ${Numjugadores}, ${Genero}, ${Publisher}, ${FechaSalida}, ${Precio}, ${Cantidad}, ${IdConsola});`;
        const nuevoId = result.recordset[0].IdJuego;
        res.json({ message: `Se agregó el proveedor ${Nombre} con ID ${nuevoId}` });
    } catch (error) {
        console.error('Error al agregar el juego:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.put('/Juegos/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const { Nombre, Numjugadores, Genero, Publisher, FechaSalida, Precio, Cantidad, IdConsola} = req.body;
        const result = await sql.query`
            UPDATE Juegos
            SET Nombre = ${Nombre}, Numjugadores = ${Numjugadores}, Genero = ${Genero}, Publisher = ${Publisher}, FechaSalida = ${FechaSalida}, Precio = ${Precio}, Cantidad = ${Cantidad}, IdConsola = ${IdConsola}
            WHERE IdJuegos = ${id};
        `;
        res.json({ message: `Se actualizó el juego con ID ${id}` });
    } catch (error) {
        console.error('Error al actualizar el juego:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.delete('/Juegos/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await sql.query`
            DELETE FROM Juegos
            WHERE IdJuegos = ${id};
        `;
        res.json({ message: `Se eliminó el juego con ID ${id}` });
    } catch (error) {
        console.error('Error al eliminar el juego:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// PERIFERICOS  
app.get('/Perifericos', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Perifericos`;
        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener los perifericos', error);
        res.status(500).json({error: 'Error al obtener los perifericos'});
    }
});


app.post('/PerifericosInsert', async (req, res) => {
    try {
        const { Nombre, Fabricante, FechaSalida, Precio, Cantidad } = req.body;
        const result = await sql.query`
            INSERT INTO Perifericos (Nombre, Fabricante, FechaSalida, Precio, Cantidad)
            VALUES (${Nombre}, ${Fabricante}, ${FechaSalida}, ${Precio}, ${Cantidad});
        `;
        const nuevoId = result.recordset[0].IdJuego;
        res.json({ message: `Se agregó el proveedor ${Nombre} con ID ${nuevoId}` });
    } catch (error) {
        console.error('Error al agregar el juego:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});





app.put('/Perifericos/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const { Nombre, Fabricante, FechaSalida, Precio, Cantidad} = req.body;
        const result = await sql.query`
            UPDATE Perifericos
            SET Nombre = ${Nombre}, Fabricante = ${Fabricante}, FechaSalida = ${FechaSalida}, Precio = ${Precio}, Cantidad = ${Cantidad}
            WHERE IdPeriferico = ${id};
        `;
        res.json({ message: `Se actualizó el periferico con ID ${id}` });
    } catch (error) {
        console.error('Error al actualizar el periferico:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.delete('/Perifericos/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await sql.query`
            DELETE FROM Perifericos
            WHERE IdPeriferico = ${id};
        `;
        res.json({ message: `Se eliminó la Periferico con ID ${id}` });
    } catch (error) {
        console.error('Error al eliminar la Periferico:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// CLIENTES
app.get('/clientes', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Clientes`;
        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener clientes', error);
        res.status(500).json({ error: 'Error al obtener clientes' });
    }
});

app.post('/ClientesInsert', async (req, res) => {
    try {
        const { Nombre, Apellido, Telefono, Direccion } = req.body;
        const result = await sql.query`
            INSERT INTO Clientes (Nombre, Apellido, Telefono, Direccion)
            OUTPUT INSERTED.IdClientes
            VALUES (${Nombre}, ${Apellido}, ${Telefono}, ${Direccion});
        `;
        const nuevoId = result.recordset[0].IdClientes;
        res.json({ message: `Se agregó el cliente ${Nombre} con ID ${nuevoId}` });
    } catch (error) {
        console.error('Error al agregar cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.put('/clientes/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const { Nombre, Apellido, Telefono, Direccion } = req.body;
        const result = await sql.query`
            UPDATE Clientes
            SET Nombre = ${Nombre}, Apellido = ${Apellido}, Telefono = ${Telefono}, Direccion = ${Direccion}
            WHERE IdClientes = ${id};
        `;
        res.json({ message: `Se actualizó el cliente con ID ${id}` });
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.delete('/clientes/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await sql.query`
            DELETE FROM Clientes
            WHERE IdClientes = ${id};
        `;
        res.json({ message: `Se eliminó el cliente con ID ${id}` });
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// VENTAS
app.get('/ventas', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Ventas`;
        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener ventas', error);
        res.status(500).json({ error: 'Error al obtener ventas' });
    }
});

app.post('/ventas', async (req, res) => {
    try {
        const { Categoria, IdConsola, IdJuego, IdPeriferico, Cantidad, PrecioTotal, FechaVenta } = req.body;
        const result = await sql.query`
            INSERT INTO Ventas (Categoria, IdConsola, IdJuego, IdPeriferico, Cantidad, PrecioTotal, FechaVenta)
            OUTPUT INSERTED.IdVentas
            VALUES (${Categoria}, ${IdConsola}, ${IdJuego}, ${IdPeriferico}, ${Cantidad}, ${PrecioTotal}, ${FechaVenta});
        `;
        const nuevoId = result.recordset[0].IdVentas;
        res.json({ message: `Se agregó la venta ${Categoria} con ID ${nuevoId}` });
    } catch (error) {
        console.error('Error al agregar venta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.put('/ventas/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const { Categoria, IdConsola, IdJuego, IdPeriferico, Cantidad, PrecioTotal, FechaVenta } = req.body;
        const result = await sql.query`
            UPDATE Ventas
            SET Categoria = ${Categoria}, IdConsola = ${IdConsola}, IdJuego = ${IdJuego}, IdPeriferico = ${IdPeriferico}, Cantidad = ${Cantidad}, PrecioTotal = ${PrecioTotal}, FechaVenta = ${FechaVenta}
            WHERE IdVentas = ${id};
        `;
        res.json({ message: `Se actualizó la venta con ID ${id}` });
    } catch (error) {
        console.error('Error al actualizar venta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.delete('/ventas/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await sql.query`
            DELETE FROM Ventas
            WHERE IdVentas = ${id};
        `;
        res.json({ message: `Se eliminó la venta con ID ${id}` });
    } catch (error) {
        console.error('Error al eliminar venta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
