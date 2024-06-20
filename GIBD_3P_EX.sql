--CREAMOS LA BASE DE DATOS
CREATE DATABASE GIBD_3P_EX13
GO

USE GIBD_3P_EX13
GO



-- Tabla de Proveedores
CREATE TABLE Proveedores (
    ID_Proveedor INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(255) NOT NULL,
    Dirección VARCHAR(255) NOT NULL,
    Teléfono VARCHAR(15),
    Correo_Electrónico VARCHAR(255),
    Persona_Contacto VARCHAR(255),
    Tipo_Producto VARCHAR(100)
);



--Tabla empleados
CREATE TABLE Empleados (
	Id_Empleado INT PRIMARY KEY IDENTITY(1,1),
	Nombre NVARCHAR(100),
    Dirección NVARCHAR(255),
    País NVARCHAR(50),
    Correo_Electrónico NVARCHAR(100),
    Contraseña NVARCHAR(50),
    Teléfono NVARCHAR(20)
);

--TABLA CLIENTE
CREATE TABLE Clientes(
    IdClientes INT PRIMARY KEY IDENTITY(1,1),
	Nombre VARCHAR(100),
	Apellido VARCHAR(100),
	Telefono VARCHAR(15),
	Direccion VARCHAR(150)
);


--Crear tabla Perifericos
CREATE TABLE Perifericos(
IdPeriferico INT PRIMARY KEY IDENTITY(1,1),
Nombre NVARCHAR(60) NOT NULL,
Fabricante VARCHAR(100),
FechaSalida DATE,
Precio MONEY,
Cantidad INT DEFAULT (0)
)


--Crear tabla Consola
CREATE TABLE Consolas(
IdConsola INT PRIMARY KEY IDENTITY(1,1),
Nombre NVARCHAR(60) NOT NULL,
Propietario VARCHAR(100),
FechaSalida DATE,
Precio MONEY,
Cantidad INT DEFAULT (0)
)
GO

--Crear tabla Juegos
CREATE TABLE Juegos(
IdJuego INT PRIMARY KEY IDENTITY(1,1),
Nombre NVARCHAR(60) NOT NULL,
Numjugadores INT DEFAULT(1),
Genero VARCHAR(100),
Publisher VARCHAR(100),
FechaSalida DATE,
Precio MONEY,
Cantidad INT DEFAULT (0),
IdConsola INT FOREIGN KEY REFERENCES Consolas(IdConsola)
)
GO

--TABLA VENTAS 
CREATE TABLE Ventas(
    IdVentas INT PRIMARY KEY IDENTITY(1,1),
	Categoria VARCHAR(50),
	IdConsola INT FOREIGN KEY REFERENCES Consolas(IdConsola),
	IdJuego INT FOREIGN KEY REFERENCES Juegos(IdJuego),
	IdPeriferico INT FOREIGN KEY REFERENCES Perifericos(IdPeriferico),
	Cantidad INT,
	PrecioTotal MONEY,
	FechaVenta DATE
);


GO

SELECT * FROM Juegos
SELECT * FROM Consolas

GO

-- Crear el trigger de precio total
CREATE TRIGGER CalcularPrecioTotal
ON Ventas
AFTER INSERT
AS
BEGIN
    -- Actualizar el precio total basado en la cantidad y precio del producto
    UPDATE Ventas
    SET PrecioTotal = inserted.Cantidad * (
        CASE 
            WHEN Ventas.Categoria = 'Consola' THEN (SELECT Precio FROM Consolas WHERE Consolas.IdConsola = inserted.IdConsola)
            WHEN Ventas.Categoria = 'Juego' THEN (SELECT Precio FROM Juegos WHERE Juegos.IdJuego = inserted.IdJuego)
            WHEN Ventas.Categoria = 'Periferico' THEN (SELECT Precio FROM Perifericos WHERE Perifericos.IdPeriferico = inserted.IdPeriferico)
        END
    )
    FROM Ventas
    INNER JOIN inserted ON Ventas.IdVentas = inserted.IdVentas;
END;
GO


-- Crear el trigger cantidad consolas
CREATE TRIGGER ActualizarCantidadConsolas
ON Ventas
AFTER INSERT
AS
BEGIN
    -- Actualizar la cantidad de consolas
    UPDATE Consolas
    SET Consolas.Cantidad = Consolas.Cantidad - inserted.Cantidad
    FROM inserted
    WHERE Consolas.IdConsola = inserted.IdConsola AND inserted.Categoria = 'Consola';
END;
GO

-- Crear el trigger cantidad juegos 
CREATE TRIGGER ActualizarCantidadJuegos
ON Ventas
AFTER INSERT
AS
BEGIN
	-- Actualizar la cantidad de juegos
    UPDATE Juegos
    SET Juegos.Cantidad = Juegos.Cantidad - inserted.Cantidad
    FROM inserted
    WHERE Juegos.IdConsola = inserted.IdJuego AND inserted.Categoria = 'Juego';
END;
GO

-- Crear el trigger cantidad perifericos
CREATE TRIGGER ActualizarCantidadPerifericos
ON Ventas
AFTER INSERT
AS
BEGIN
    -- Actualizar la cantidad de periféricos
    UPDATE Perifericos
    SET Perifericos.Cantidad = Perifericos.Cantidad - inserted.Cantidad
    FROM inserted
    WHERE Perifericos.IdPeriferico = inserted.IdPeriferico AND inserted.Categoria = 'Periferico';
END;
GO


--INSERTAR POR MEDIO DE SP

--STORED PROCEDURE PARA LA TABLA PROVEEDORES

-- Creamos el Stored Procedure actualizado
CREATE PROCEDURE InsertarProveedor
    @Nombre NVARCHAR(255),
    @Direccion NVARCHAR(255),
    @Telefono NVARCHAR(15),
    @Correo_Electronico NVARCHAR(255),
    @Persona_Contacto NVARCHAR(255),
    @Tipo_Producto NVARCHAR(100)
AS
BEGIN
    INSERT INTO Proveedores (Nombre, Dirección, Teléfono, Correo_Electrónico, Persona_Contacto, Tipo_Producto)
    VALUES (@Nombre, @Direccion, @Telefono, @Correo_Electronico, @Persona_Contacto, @Tipo_Producto)
END
GO

SELECT * FROM Proveedores

-- Llamadas al procedimiento InsertarProveedor para insertar los proveedores

EXEC InsertarProveedor 'Tech Supplies Inc.', '123 Tech Lane, Silicon Valley, CA', '555-1234', 'contacto@techsupplies.com', 'Juan Pérez', 'Electrónica'
EXEC InsertarProveedor 'Office Essentials Co.', '456 Office Park, Nueva York, NY', '555-5678', 'info@officeessentials.com', 'Ana Martínez', 'Suministros de Oficina'
EXEC InsertarProveedor 'Gourmet Foods Ltd.', '789 Gourmet St, Los Ángeles, CA', '555-9101', 'ventas@gourmetfoods.com', 'Roberto Gómez', 'Alimentos y Bebidas'
EXEC InsertarProveedor 'Fashion Trends', '321 Fashion Ave, Miami, FL', '555-1122', 'servicio@fashiontrends.com', 'Alicia Blanco', 'Ropa'
EXEC InsertarProveedor 'Dell', 'Blvd. Adolfo López Mateos', '477-456-3355', 'dell@correo.com', 'Miguel', 'Computadoras'
EXEC InsertarProveedor 'HP', 'Blvd. Juan Alonso de Torres', '477-752-0900', 'hp@correo.com', 'Daniel', 'Impresoras'
EXEC InsertarProveedor 'Samsung', 'Blvd. Paseo de los Insurgentes', '477-2255-0114', 'samsung@correo.com', 'Luis', 'Electrónica'
EXEC InsertarProveedor 'Apple', 'Blvd. José María Morelos', '477-275-2273', 'apple@correo.com', 'Pedro', 'Electrónica'
EXEC InsertarProveedor '8BitDo', 'Hong Kong', NULL, 'shop@8bitdo.com', NULL, 'Periférico'
EXEC InsertarProveedor 'Gulikit', 'Nanshan District, Shenzhen, China, 518052', '867-5581785319', 'ray@rhbusinesstrading.net', 'Ray Hussain', 'Periféricos'
EXEC InsertarProveedor 'ASUS', 'Taiwan', '+52 5560963739', 'b2b_mx@asus.com', NULL, 'Electrónica'
EXEC InsertarProveedor 'Thrustmaster', 'Northwest Houston', '+44 1483 977943', NULL, NULL, 'Periféricos'
EXEC InsertarProveedor 'Future Fundacion', 'cuarta manzana y media, Av 3', '444-9402823', 'FutureF4@gmail.com', 'Reed Richards', 'Consolas'
EXEC InsertarProveedor 'S.T.A.R. Labs', '1029 Hamburguer, Av. fork', '233-0928376', 'StarLabs@gmail.com', 'Harrison Wells', 'Periféricos'
EXEC InsertarProveedor 'Gallos', 'Av. Lopes Mateos, Rosario 4983', '477-1928475', 'GallosdPla@gmail.com', 'Bob Mendes', 'Mercancía'
EXEC InsertarProveedor 'Horus Colabs', 'OK Av. 12 Alonzo Mendosa', '123-4921048', 'HorusColbs@gmail.com', 'Ricardo Rojas', 'Juegos Importados'
EXEC InsertarProveedor 'Proveedor A', 'Calle 144, Tampico', '4771548787', 'contacto@proveedora.com', 'Dani Domingues', 'Consolas'
EXEC InsertarProveedor 'Proveedor B', 'Avenida 556, Monterrey', '4771523665', 'contacto@proveedorb.com', 'Paulina Mireles', 'Juegos'
EXEC InsertarProveedor 'Proveedor C', 'Boulevard Campestre, Tijuana', '4777892193', 'contacto@proveedorc.com', 'Ricardo Ruiz', 'Periféricos'
EXEC InsertarProveedor 'Proveedor D', 'Calle 221, Ciudad de México', '4777895566', 'contacto@proveedord.com', 'Andrea Leon', 'Accesorios'

-- Verificación: Seleccionamos todos los registros de Proveedores
SELECT * FROM Proveedores
GO

--STORED PROCEDURE PARA LA TABLA EMPLEADOS

-- Procedimiento Almacenado para insertar empleado
CREATE PROCEDURE InsertarEmpleado
    @Nombre NVARCHAR(100),
    @Direccion NVARCHAR(255),
    @Pais NVARCHAR(50),
    @Correo_Electronico NVARCHAR(100),
    @Contraseña NVARCHAR(50),
    @Telefono NVARCHAR(20)
AS
BEGIN
    INSERT INTO Empleados (Nombre, Dirección, País, Correo_Electrónico, Contraseña, Teléfono)
    VALUES (@Nombre, @Direccion, @Pais, @Correo_Electronico, @Contraseña, @Telefono)
END
GO


-- Llamadas al procedimiento InsertarEmpleado para insertar los empleados

EXEC InsertarEmpleado 'Carlos Martínez', 'Calle 123, Ciudad de México', 'México', 'carlos.martinez@empresa.com', 'contraseña123', '555-0101'
EXEC InsertarEmpleado 'Laura Gómez', 'Avenida 456, Madrid', 'España', 'laura.gomez@empresa.com', 'laura2021', '555-0202'
EXEC InsertarEmpleado 'Miguel Brown', '789 Main St, Nueva York, USA', 'Estados Unidos', 'miguel.brown@empresa.com', 'miguelbrown', '555-0303'
EXEC InsertarEmpleado 'Ana Pereira', 'Rua 101, São Paulo', 'Brasil', 'ana.pereira@empresa.com', 'anapereira2022', '555-0404'
EXEC InsertarEmpleado 'Carlos Slim', 'Paseo de la Reforma 505, Ciudad de México', 'México', 'carlosslim@correo.com', 'slim1234', '555-1234567'
EXEC InsertarEmpleado 'Bill Gates', '1835 73rd Ave NE, Medina, WA', 'Estados Unidos', 'billgates@correo.com', 'gates2023', '555-7654321'
EXEC InsertarEmpleado 'Miguel Muñoz', 'Los naranjos', 'México', 'miguel@correo.com', 'pichai2023', '477-3333333'
EXEC InsertarEmpleado 'Sebastian Mendoza', 'El campestre', 'México', 'sebastian@correo.com', 'nadella2023', '477-4444444'
EXEC InsertarEmpleado 'Jane Doe', '718 Riverview Lane Rego Park, NY 11374', 'Estados Unidos', 'maggot@correo.com', 'ILoveAmerica', '+1-52-315-2719'
EXEC InsertarEmpleado 'John Miller', '117 Marcela Drive, New Cheyenneberg, WY 14454', 'Estados Unidos', 'johnmil@correo.com', 'soccerfootball', '+1-190-189-2201'
EXEC InsertarEmpleado 'Oscar Neville', 'Apt. 229 671 Long Spurs, Port Rosita, IA 06924', 'Australia', 'moistSquirrel@correo.com', 'IAmAllOfMe', '048-277-2104'
EXEC InsertarEmpleado 'Luqmann Sutar', 'Puerta 814 Monte Irene Vélez s/n., Logroño, Can 60112', 'México', 'emulove@correo.com', 'blastHLE', '477-192-1937'
EXEC InsertarEmpleado 'Armando Torres', 'Av. Revolucion 214, Guadalupe', 'Perú', 'ArmandoTT@gmail.com', 'AT183Nmdo@', '272-3441230'
EXEC InsertarEmpleado 'Gabriel Montiel', 'Oikos 193, calle 2', 'Grecia', 'GTQmtiel2@gmail.com', '12ewdf2', '236-9584729'
EXEC InsertarEmpleado 'Joel Juarez', 'Paseo Colonial, Av. tomate', 'Alemania', 'JolJrz123@gmail.com', '213456ytf', '455-9273940'
EXEC InsertarEmpleado 'Jonny Storm', 'cuarta manzana y media, Av 3', 'Estados Unidos', 'JonyyStrm4@gmail.com', 'r98fdw437CD', '444-219831'
EXEC InsertarEmpleado 'María Rojas', 'Calle villas de SanJuan, Ciudad', 'México', 'maria.rojas@empresa.com', 'password108', '4771936699'
EXEC InsertarEmpleado 'Saul Rodrígues', 'Avenida Lopez, Ciudad', 'Argentina', 'saul.rodriguez@empresa.com', 'password2009', '4771200201'
EXEC InsertarEmpleado 'Carmen Sandiego', 'Boulevard JAT, Ciudad', 'Chile', 'carmen.sandiego@empresa.com', 'password2007', '4775200706'
EXEC InsertarEmpleado 'Hector Torres', 'Calle Benito Juarez, Ciudad', 'Perú', 'hector.torres@empresa.com', 'password158', '4770309889'

-- Verificación: Seleccionamos todos los registros de Empleados
SELECT * FROM Empleados
GO

--STORED PROCEDURE PARA LA TABLA CLIENTES

-- Crear Stored Procedure para insertar clientes
CREATE PROCEDURE InsertarCliente
    @Nombre VARCHAR(100),
    @Apellido VARCHAR(100),
    @Telefono VARCHAR(15),
    @Direccion VARCHAR(150)
AS
BEGIN
    INSERT INTO Clientes (Nombre, Apellido, Telefono, Direccion)
    VALUES (@Nombre, @Apellido, @Telefono, @Direccion)
END
GO


-- Ejecutar el Stored Procedure para insertar clientes con los datos proporcionados
EXEC InsertarCliente 'Sofía', 'Hernández', '555-1101', 'Calle A, Bogotá, Colombia';
EXEC InsertarCliente 'Lucas', 'Fernández', '555-2202', 'Avenida B, Buenos Aires, Argentina';
EXEC InsertarCliente 'Emma', 'López', '555-3303', 'Calle C, Lima, Perú';
EXEC InsertarCliente 'Mateo', 'García', '555-4404', 'Avenida D, Santiago, Chile';
EXEC InsertarCliente 'Elon', 'Musk', '555-5551234', '3500 Deer Creek Road, Palo Alto, CA';
EXEC InsertarCliente 'Jeff', 'Bezos', '555-5555678', '2121 7th Ave, Seattle, WA';
EXEC InsertarCliente 'Mark', 'Zuckerberg', '555-5559101', '1 Hacker Way, Menlo Park, CA';
EXEC InsertarCliente 'Warren', 'Buffett', '555-5551122', '3555 Farnam Street, Omaha, NE';
EXEC InsertarCliente 'Dell', 'Conagher', '713-2007', 'Beecave, Texas';
EXEC InsertarCliente 'Emiliano', 'Flores', '252-8137', 'León, Guanajuato';
EXEC InsertarCliente 'Christian', 'Guzmán', '211-0127', 'Guasave, Sinaloa';
EXEC InsertarCliente 'Carlos', 'Juarez', '418-4181', 'Guadalajara, Jalisco';
EXEC InsertarCliente 'Andres', 'Suniga', '879-2398270', 'Hernesto Cedillo, Colonia Cerro Verde 124';
EXEC InsertarCliente 'Miguel', 'Hidalgo', '755-1264074', 'Dolores Hidalgo, Sirena 12';
EXEC InsertarCliente 'Gustabo', 'Dolores', '981-2750193', 'Ass de corazones, 55';
EXEC InsertarCliente 'Edgar', 'Colorado', '123-7382694', 'Dos tres 55, Colonia ocho';
EXEC InsertarCliente 'Allison', 'Arranza', '5556789451', 'Punta del este';
EXEC InsertarCliente 'Jose', 'Suarez', '5557890245', 'Lomas punta del este';
EXEC InsertarCliente 'Diego', 'Diaz', '5558901245', 'Punta del este';
EXEC InsertarCliente 'Javi', 'Villa', '5559012265', 'Lomas punta del este';
GO

--STORED PROCEDURE PARA LA TABLA PERIFERICOS

-- Crear Stored Procedure para insertar periféricos
CREATE PROCEDURE InsertarPeriferico
    @Nombre NVARCHAR(60),
    @Fabricante VARCHAR(100),
    @FechaSalida DATE,
    @Precio MONEY,
    @Cantidad INT
AS
BEGIN
    INSERT INTO Perifericos (Nombre, Fabricante, FechaSalida, Precio, Cantidad)
    VALUES (@Nombre, @Fabricante, @FechaSalida, @Precio, @Cantidad)
END
GO

-- Ejecutar el Stored Procedure para insertar periféricos con los datos proporcionados
EXEC InsertarPeriferico 'Control Inalámbrico DualSense', 'Sony', '2020-11-12', 1189.83, 500;
EXEC InsertarPeriferico 'Control Inalámbrico Xbox', 'Microsoft', '2020-11-10', 1019.83, 400;
EXEC InsertarPeriferico 'Control Pro de Nintendo Switch', 'Nintendo', '2017-03-03', 1189.83, 300;
EXEC InsertarPeriferico 'PlayStation VR', 'Sony', '2016-10-13', 5099.83, 100;
EXEC InsertarPeriferico 'Ratón inalámbrico Logitech', 'Logitech', '2023-01-15', 499.99, 100;
EXEC InsertarPeriferico 'Teclado mecánico Razer', 'Razer', '2023-02-20', 799.99, 80;
EXEC InsertarPeriferico 'Auriculares inalámbricos Sony', 'Sony', '2023-03-25', 899.99, 120;
EXEC InsertarPeriferico 'Gamepad inalámbrico Xbox Elite Series 2', 'Microsoft', '2023-04-30', 1299.99, 70;
EXEC InsertarPeriferico 'M30', '8BitDo', '2019-01-28', 599.99, 17;
EXEC InsertarPeriferico 'K4 V2', 'Keychron', '2020-07-21', 2599.99, 30;
EXEC InsertarPeriferico 'Wireless adapter 2', '8BitDo', '2022-08-12', 499.99, 22;
EXEC InsertarPeriferico 'Steam controller', 'Valve', '2015-11-10', 999.99, 13;
EXEC InsertarPeriferico 'Guitarra Guitar Hero deluxe', 'Neversoft', '2003-02-19', 1400, 4;
EXEC InsertarPeriferico 'Kinect Xbox 360', 'Microsoft', '2009-12-20', 499.99, 2;
EXEC InsertarPeriferico 'Kinect Xbox One', 'Microsoft', '2016-12-20', 599.99, 4;
EXEC InsertarPeriferico 'Logitech G29 Driving Volante', 'Logitech', '2020-12-21', 4334, 2;
EXEC InsertarPeriferico 'CascosGamer', 'Sony', '2024-11-12', 69.99, 200;
EXEC InsertarPeriferico 'Joy-Con', 'Nintendo', '2019-04-03', 79.99, 150;
EXEC InsertarPeriferico 'Mouse Gamer', 'Microsoft', '2023-08-12', 59.99, 180;
EXEC InsertarPeriferico 'Teclado Gamer', 'Logitech', '2020-03-01', 99.99, 100;
GO


--STORED PROCEDURE PARA LA TABLA CONSOLAS

-- Crear Stored Procedure para insertar consolas
CREATE PROCEDURE InsertarConsola
    @Nombre NVARCHAR(60),
    @Propietario VARCHAR(100),
    @FechaSalida DATE,
    @Precio MONEY,
    @Cantidad INT
AS
BEGIN
    INSERT INTO Consolas (Nombre, Propietario, FechaSalida, Precio, Cantidad)
    VALUES (@Nombre, @Propietario, @FechaSalida, @Precio, @Cantidad)
END
GO

-- Ejecutar el Stored Procedure para insertar consolas con los datos proporcionados
EXEC InsertarConsola 'PlayStation 5', 'Sony', '2020-11-12', 8499.83, 100;
EXEC InsertarConsola 'Xbox Series X', 'Microsoft', '2020-11-10', 8499.83, 120;
EXEC InsertarConsola 'Nintendo Switch', 'Nintendo', '2017-03-03', 5099.83, 150;
EXEC InsertarConsola 'PlayStation 4', 'Sony', '2013-11-15', 6799.83, 200;
EXEC InsertarConsola 'Nintendo 3DS', 'Nintendo', '2011-03-27', 2999.99, 80;
EXEC InsertarConsola 'PlayStation 3', 'Sony', '2006-11-11', 3999.99, 50;
EXEC InsertarConsola 'Xbox 360', 'Microsoft', '2005-11-22', 3999.99, 30;
EXEC InsertarConsola 'Nintendo Wii', 'Nintendo', '2006-11-19', 1999.99, 60;
EXEC InsertarConsola 'Genesis/Mega Drive', 'Sega', '1998-08-29', 3999.99, 35;
EXEC InsertarConsola 'Super Nintendo Entertainment System', 'Nintendo', '1991-09-09', 3999.99, 32;
EXEC InsertarConsola 'Game Gear', 'Sega', '1990-08-06', 2999.99, 27;
EXEC InsertarConsola 'Game boy', 'Nintendo', '1989-04-21', 1999.99, 30;
EXEC InsertarConsola 'Zeebo', 'Tectoy', '1998-06-13', 25999.99, 2;
EXEC InsertarConsola 'Dreamcast', 'Sega', '1998-12-16', 9599.99, 6;
EXEC InsertarConsola 'KFConsole', 'KFC Gaming', '2022-09-13', 18000, 1;
EXEC InsertarConsola 'Play 2 phipeada', 'Sony', '2003-02-22', 7500, 3;
EXEC InsertarConsola 'PlayStation 1', 'Sony', '2015-11-12', 1005.99, 110;
EXEC InsertarConsola 'GameCube', 'Nintendo', '2000-03-03', 689.99, 155;
EXEC InsertarConsola 'PSP', 'Sony', '2013-11-10', 1119.99, 35;
EXEC InsertarConsola 'Nintendo2Ds', 'Nintendo', '2010-11-15', 516.99, 135;

SELECT * FROM Consolas

GO


--STORED PROCEDURE PARA LA TABLA CONSOLAS

-- Crear Stored Procedure para insertar juegos
CREATE PROCEDURE InsertarJuego
    @Nombre NVARCHAR(60),
    @Numjugadores INT,
    @Genero VARCHAR(100),
    @Publisher VARCHAR(100),
    @FechaSalida DATE,
    @Precio MONEY,
    @Cantidad INT,
    @IdConsola INT
AS
BEGIN
    INSERT INTO Juegos (Nombre, Numjugadores, Genero, Publisher, FechaSalida, Precio, Cantidad, IdConsola)
    VALUES (@Nombre, @Numjugadores, @Genero, @Publisher, @FechaSalida, @Precio, @Cantidad, @IdConsola)
END
GO

-- Ejecutar el Stored Procedure para insertar juegos con los datos proporcionados
EXEC InsertarJuego 'The Last of Us Parte II', 1, 'Acción-Aventura', 'Sony Interactive Entertainment', '2020-06-19', 1019.83, 1, 1;
EXEC InsertarJuego 'Halo Infinite', 1, 'Disparos en Primera Persona', 'Xbox Game Studios', '2021-12-08', 1019.83, 1, 2;
EXEC InsertarJuego 'The Legend of Zelda: Breath of the Wild', 1, 'Acción-Aventura', 'Nintendo', '2017-03-03', 1019.83, 1, 3;
EXEC InsertarJuego 'God of War', 1, 'Acción-Aventura', 'Sony Interactive Entertainment', '2018-04-20', 849.83, 1, 1;
EXEC InsertarJuego 'Super Mario 3D Land', 1, 'Plataforma', 'Nintendo', '2011-11-03', 299.99, 1, 6;
EXEC InsertarJuego 'Gran Turismo 5', 1, 'Carreras', 'Sony Computer Entertainment', '2010-11-24', 399.99, 1, 7;
EXEC InsertarJuego 'Halo 3', 1, 'Shooter', 'Microsoft Game Studios', '2007-09-25', 499.99, 1, 8;
EXEC InsertarJuego 'The Legend of Zelda: Twilight Princess', 1, 'Acción-Aventura', 'Nintendo', '2006-11-19', 499.99, 1, 9;
EXEC InsertarJuego 'Panorama Cotton', 1, 'Shoot-em-up (cute-em-up)', 'Sunsoft', '1994-08-12', 125, 1, 9; -- Genesis/Mega drive
EXEC InsertarJuego 'F-Zero', 1, 'Carreras', 'Nintendo', '1991-09-09', 200, 1, 10; -- Super Nintendo Entertainment System
EXEC InsertarJuego 'Puyo puyo 2', 2, 'Puzzle', 'Compile', '1994-07-06', 125, 1, 11; -- Game Gear
EXEC InsertarJuego 'Donkey kong', 1, 'Plataformas/puzzle', 'Nintendo', '1994-06-14', 125, 1, 12; -- Gameboy
EXEC InsertarJuego 'Stardew Valley', 4, 'Indi', 'ConcernedApe LLC', '2016-02-16', 250, 1, 8;
EXEC InsertarJuego 'Lego Indiana Jones 2', 2, 'Coperativo', 'Warner Games', '2003-04-12', 499, 1, 2;
EXEC InsertarJuego 'Marvel: Ultimate Alliance', 4, 'Beat em up', 'Activision', '2006-06-18', 799, 1, 4;
EXEC InsertarJuego 'Mortal Kombat 10', 2, 'Peleas', 'Warner Games', '2012-06-23', 550, 1, 3;
EXEC InsertarJuego 'Super Mario Odyssey', 1, 'Plataforma', 'Nintendo', '2017-10-27', 59.99, 1, 2;
EXEC InsertarJuego 'Call of Duty', 1, 'Acción', 'Microsoft', '2021-12-08', 59.99, 1, 3;
EXEC InsertarJuego 'The Witcher 3: Wild Hunt', 1, 'RPG', 'CD Projekt', '2015-05-19', 39.99, 1, 1;
EXEC InsertarJuego 'FIFA 23', 1, 'Deportes', 'EA Sports', '2022-09-27', 59.99, 1, 4;
GO

--STORED PROCEDURE PARA LA TABLA VENTAS


-- Crear Stored Procedure para insertar ventas
CREATE PROCEDURE InsertarVenta
    @Categoria VARCHAR(50),
    @IdConsola INT = NULL,
    @IdJuego INT = NULL,
    @IdPeriferico INT = NULL,
    @Cantidad INT,
    @PrecioTotal MONEY,
    @FechaVenta DATE
AS
BEGIN
    INSERT INTO Ventas (Categoria, IdConsola, IdJuego, IdPeriferico, Cantidad, PrecioTotal, FechaVenta)
    VALUES (@Categoria, @IdConsola, @IdJuego, @IdPeriferico, @Cantidad, @PrecioTotal, @FechaVenta)
END
GO

-- Ejecutar el Stored Procedure para insertar ventas con los datos proporcionados
EXEC InsertarVenta 'Consola', 1, NULL, NULL, 2, NULL, '2024-06-01'; -- Venta de consolas (01 de junio de 2024)
EXEC InsertarVenta 'Juego', NULL, 2, NULL, 1, NULL, '2024-05-15'; -- Venta de juegos (15 de mayo de 2024)
EXEC InsertarVenta 'Periferico', NULL, NULL, 3, 5, NULL, '2024-05-20'; -- Venta de periféricos (20 de mayo de 2024)
EXEC InsertarVenta 'Consola', 4, NULL, NULL, 3, NULL, '2024-06-10'; -- Venta de consolas (10 de junio de 2024)
EXEC InsertarVenta 'Consola', 2, NULL, NULL, 1, NULL, '2023-12-01'; -- Venta de PlayStation 5 (01 de diciembre de 2023)
EXEC InsertarVenta 'Juego', NULL, 3, NULL, 1, NULL, '2023-12-02'; -- Venta de The Legend of Zelda: Breath of the Wild (02 de diciembre de 2023)
EXEC InsertarVenta 'Periferico', NULL, NULL, 2, 2, NULL, '2023-12-03'; -- Venta de dos controles DualSense (03 de diciembre de 2023)
EXEC InsertarVenta 'Consola', 2, NULL, NULL, 1, NULL, '2023-12-04'; -- Venta de Xbox Series X (04 de diciembre de 2023)
EXEC InsertarVenta 'Juego', NULL, 5, NULL, 1, NULL, '2024-06-05'; -- Venta de panorama contton (05 de junio de 2024)
EXEC InsertarVenta 'Consola', 9, NULL, NULL, 1, NULL, '2024-05-25'; -- Venta de Genesis/Mega drive (25 de mayo de 2024)
EXEC InsertarVenta 'Periferico', NULL, NULL, 11, 2, NULL, '2024-06-11'; -- Venta de periférico (15 de junio de 2024)
EXEC InsertarVenta 'Juego', NULL, 6, NULL, 1, NULL, '2024-06-20'; -- Venta de juego (20 de junio de 2024)
EXEC InsertarVenta 'Consola', 2, NULL, NULL, 3, NULL, '2024-06-25'; -- Venta de GameCube (25 de junio de 2024)
EXEC InsertarVenta 'Juego', NULL, 2, NULL, 2, NULL, '2024-07-01'; -- Venta de Call of Duty (01 de julio de 2024)
EXEC InsertarVenta 'Periferico', NULL, NULL, 3, 4, NULL, '2023-07-05'; -- Venta de Mouse Gamer (05 de julio de 2023)
EXEC InsertarVenta 'Juego', NULL, 4, NULL, 5, NULL, '2022-07-10'; -- Venta de FIFA 23 (10 de julio de 2022)
EXEC InsertarVenta 'Juego', NULL, 15, NULL, 1, NULL, '2023-07-15'; -- Venta de juego (15 de julio de 2023)
EXEC InsertarVenta 'Consola', 16, NULL, NULL, 1, NULL, '2024-02-20'; 
EXEC InsertarVenta 'Juego', NULL, 14, NULL, 1, NULL, '2024-03-25'; 
EXEC InsertarVenta 'Periferico', NULL, NULL, 16, 2, NULL, '2024-04-01';


DROP TABLE Ventas

SELECT * FROM Ventas
GO

--CONSULOTAS SP PARA ACTUALIZAR
--CONSOLA SP
CREATE PROCEDURE ActualizarConsola
    @IdConsola INT,
    @Nombre NVARCHAR(60),
    @Propietario VARCHAR(100),
    @FechaSalida DATE,
    @Precio MONEY,
    @Cantidad INT
AS
BEGIN
    UPDATE Consolas
    SET Nombre = @Nombre,
        Propietario = @Propietario,
        FechaSalida = @FechaSalida,
        Precio = @Precio,
        Cantidad = @Cantidad
    WHERE IdConsola = @IdConsola;
END

EXEC ActualizarConsola 
    @IdConsola = 1,
    @Nombre = 'Nueva Consola',
    @Propietario = 'Nuevo Propietario',
    @FechaSalida = '2022-05-15',
    @Precio = 6999.99,
    @Cantidad = 80;

	SELECT * FROM Consolas
GO


--JUEGOS SP

CREATE PROCEDURE ActualizarJuego
    @IdJuego INT,
    @Nombre NVARCHAR(60),
    @Numjugadores INT,
    @Genero VARCHAR(100),
    @Publisher VARCHAR(100),
    @FechaSalida DATE,
    @Precio MONEY,
    @Cantidad INT,
    @IdConsola INT
AS
BEGIN
    UPDATE Juegos
    SET Nombre = @Nombre,
        Numjugadores = @Numjugadores,
        Genero = @Genero,
        Publisher = @Publisher,
        FechaSalida = @FechaSalida,
        Precio = @Precio,
        Cantidad = @Cantidad,
        IdConsola = @IdConsola
    WHERE IdJuego = @IdJuego;
END

EXEC ActualizarJuego 
    @IdJuego = 1,
    @Nombre = 'Nuevo Juego',
    @Numjugadores = 2,
    @Genero = 'Nuevo Género',
    @Publisher = 'Nuevo Publisher',
    @FechaSalida = '2023-08-20',
    @Precio = 39.99,
    @Cantidad = 100,
    @IdConsola = 2; -- Cambiar por el Id de la consola asociada, si es necesario

		SELECT * FROM Juegos

GO

--PERIFERICOS SP


CREATE PROCEDURE ActualizarPeriferico
    @IdPeriferico INT,
    @Nombre NVARCHAR(60),
    @Fabricante VARCHAR(100),
    @FechaSalida DATE,
    @Precio MONEY,
    @Cantidad INT
AS
BEGIN
    UPDATE Perifericos
    SET Nombre = @Nombre,
        Fabricante = @Fabricante,
        FechaSalida = @FechaSalida,
        Precio = @Precio,
        Cantidad = @Cantidad
    WHERE IdPeriferico = @IdPeriferico;
END

EXEC ActualizarPeriferico 
    @IdPeriferico = 1,
    @Nombre = 'Nuevo Periférico',
    @Fabricante = 'Nuevo Fabricante',
    @FechaSalida = '2023-01-01',
    @Precio = 499.99,
    @Cantidad = 50;

		SELECT * FROM Perifericos




SELECT  * FROM Juegos
SELECT  * FROM Perifericos
SELECT  * FROM Consolas

GO

--Crear Views
--Esta View buscara los empleados que no sean de Mexico
CREATE VIEW EmpleadoNoMexico AS 
	SELECT Nombre,Dirección,País,Correo_Electrónico,Teléfono FROM Empleados
	WHERE País != 'México'
	GROUP BY Nombre,Dirección,País,Correo_Electrónico,Teléfono

--Provar View
SELECT * FROM EmpleadoNoMexico
ORDER BY País

GO
--Esta View buscara los empleados que sean de Mexico y tengan en su nombre la letra 'E'
CREATE VIEW CountEmpleadoMexicoE AS 
	SELECT COUNT(Id_Empleado)[Empleados con E] FROM Empleados
	WHERE País = 'México' AND Nombre LIKE '%E%'

--Provar View
SELECT * FROM CountEmpleadoMexicoE
GO
--Esta view buscara el Top 5 consolas de nintendo con mas stock
CREATE VIEW Top5ConsolasNintendoStock AS
	SELECT TOP(5)Cantidad,Nombre,Precio FROM Consolas
	WHERE Propietario = 'Nintendo'
	ORDER BY Cantidad DESC

--Provar View
SELECT * FROM Top5ConsolasNintendoStock
GO

-- Este view nos regresará las ventas cuyo precio total es más grande que el promedio de todas las ventas
CREATE VIEW VentasSupAVG AS
    SELECT Categoria, Cantidad, PrecioTotal, FechaVenta 
    FROM Ventas
    WHERE PrecioTotal > (SELECT AVG(PrecioTotal) FROM Ventas);

--Provar View
SELECT * FROM VentasSupAVG
GO	


--La view nos regresara los proveedores cuyo numero de telefono comienza con 477
CREATE VIEW ProvedoresTel477 AS 
	SELECT Nombre,Teléfono,Correo_Electrónico,Persona_Contacto FROM Proveedores
	WHERE Teléfono LIKE '477%'

--Provar View
SELECT * FROM ProvedoresTel477
GO


--CONSULTAS

INSERT INTO Ventas (Categoria, IdConsola, IdJuego, IdPeriferico, Cantidad, FechaVenta) VALUES
('Juego', NULL, 8, NULL, 1, GETDATE()), -- Venta de panorama contton
('Consola', 8, NULL, NULL, 1, GETDATE()); -- Venta de Genesis/Mega drive
GO


--Consultas
--Ventas de consolas de Microsoft
SELECT Consolas.Nombre AS Consola, Consolas.Propietario, Ventas.FechaVenta AS [Fecha de venta], Ventas.Cantidad FROM Ventas
INNER JOIN Consolas ON Ventas.IdConsola = Consolas.IdConsola
WHERE Consolas.Propietario = 'Microsoft'
GO

--Ventas de consolas de Sony
SELECT Consolas.Nombre AS Consola, Consolas.Propietario, Ventas.FechaVenta AS [Fecha de venta], Ventas.Cantidad FROM Ventas
INNER JOIN Consolas ON Ventas.IdConsola = Consolas.IdConsola
WHERE Consolas.Propietario = 'Sony'
GO

--Ventas de consolas de Nintendo
SELECT Consolas.Nombre AS Consola, Consolas.Propietario, Ventas.FechaVenta AS [Fecha de venta], Ventas.Cantidad FROM Ventas
INNER JOIN Consolas ON Ventas.IdConsola = Consolas.IdConsola
WHERE Consolas.Propietario = 'Nintendo'
GO

--Total unidades vendidas de consolas
SELECT Consolas.Nombre AS Consola, SUM(Ventas.Cantidad) AS [Unidades totales vendidas] FROM Ventas
INNER JOIN Consolas ON Ventas.IdConsola = Consolas.IdConsola
GROUP BY Consolas.Nombre
GO

--Total juegos vendidos
SELECT Juegos.Nombre AS Juego, SUM(Ventas.Cantidad) AS [Unidades totales vendidas] FROM Ventas
INNER JOIN Juegos ON Ventas.IdJuego = Juegos.IdJuego
GROUP BY Juegos.Nombre
GO

--Total de perifericos vendidos
SELECT Perifericos.Nombre AS Periferico, SUM(Ventas.Cantidad) AS [Unidades totales vendidas] FROM Ventas
INNER JOIN Perifericos ON Ventas.IdPeriferico = Perifericos.IdPeriferico
GROUP BY Perifericos.Nombre
GO

--Unir tabla ventas para ser mas leible
SELECT Ventas.IdVentas, Ventas.Categoria, Consolas.Nombre, Ventas.Cantidad, Ventas.FechaVenta FROM Ventas
INNER JOIN Consolas ON Ventas.IdConsola = Consolas.IdConsola
UNION
SELECT Ventas.IdVentas, Ventas.Categoria, Juegos.Nombre, Ventas.Cantidad, Ventas.FechaVenta FROM Ventas
INNER JOIN Juegos ON Ventas.IdJuego = Juegos.IdJuego
UNION
SELECT Ventas.IdVentas, Ventas.Categoria, Perifericos.Nombre, Ventas.Cantidad, Ventas.FechaVenta FROM Ventas
INNER JOIN Perifericos ON Ventas.IdPeriferico = Perifericos.IdPeriferico
GO

--Obtener los 10 juegos mejor vendidos
SELECT TOP 10 Sub.[Unidades totales vendidas], Sub.Juego FROM(
	SELECT Juegos.Nombre AS Juego, SUM(Ventas.Cantidad) AS [Unidades totales vendidas] FROM Ventas
	INNER JOIN Juegos ON Ventas.IdJuego = Juegos.IdJuego
	GROUP BY Juegos.Nombre
) AS Sub
ORDER BY [Unidades totales vendidas] DESC
GO

--Obtener los 10 perifericos mejor vendidos
SELECT TOP 10 Sub.[Unidades totales vendidas], Sub.Periferico FROM(
	SELECT Perifericos.Nombre AS Periferico, SUM(Ventas.Cantidad) AS [Unidades totales vendidas] FROM Ventas
	INNER JOIN Perifericos ON Ventas.IdPeriferico = Perifericos.IdPeriferico
	GROUP BY Perifericos.Nombre
) AS Sub
ORDER BY [Unidades totales vendidas] DESC
GO

--Obtener las 10 consolas mas vendidas
SELECT TOP 10 Sub.[Unidades totales vendidas], Sub.Consola FROM(
	SELECT Consolas.Nombre AS Consola, SUM(Ventas.Cantidad) AS [Unidades totales vendidas] FROM Ventas
	INNER JOIN Consolas ON Ventas.IdConsola = Consolas.IdConsola
	GROUP BY Consolas.Nombre
) AS Sub
ORDER BY [Unidades totales vendidas] DESC
GO

INSERT INTO Ventas (Categoria, IdConsola, IdJuego, IdPeriferico, Cantidad, FechaVenta) VALUES
('Consola', 5, NULL, NULL, 1, GETDATE()),
('Consola', 3, NULL, NULL, 1, GETDATE());
GO


-- Juegos que tienen una consola asociada y están disponibles
SELECT Juegos.Nombre
FROM Juegos
INNER JOIN Consolas ON Juegos.IdConsola = Consolas.IdConsola
INTERSECT
SELECT Nombre AS JuegoDisponible
FROM Juegos
WHERE Cantidad > 0;


--Juegos disponibles en todas las consolas
SELECT Nombre
FROM Juegos

EXCEPT

SELECT J.Nombre
FROM Juegos J
LEFT JOIN Consolas C ON J.IdConsola = C.IdConsola
WHERE C.IdConsola IS NULL;

--Encontrar juegos exclusivos de otras consolas 
SELECT J.Nombre AS Juego, C.Nombre AS Consola
FROM Juegos J
JOIN Consolas C ON J.IdConsola = C.IdConsola

EXCEPT

SELECT J.Nombre AS Juego, C.Nombre AS Consola
FROM Juegos J
JOIN Consolas C ON J.IdConsola = C.IdConsola
JOIN Juegos J2 ON J.Nombre = J2.Nombre AND J.IdConsola <> J2.IdConsola;

