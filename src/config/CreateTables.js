// createTables.js
import { db } from './DB.js';

async function createTablesIfNotExist() {
    try {
        // Verificar y crear la tabla rolesUser si no existe
        const rolesUserExists = await db.schema.hasTable('rolesUser');
        if (!rolesUserExists) {
            await db.schema.createTable('rolesUser', (table) => {
                table.increments('idRol').primary();  // Columna primaria con auto incremento
                table.string('nombreRol', 250);
                table.date('FechaRol').defaultTo(db.fn.now());
            });
            console.log("Tabla 'rolesUser' creada.");

            // Insertar roles predeterminados
            await db('rolesUser').insert([
                { nombreRol: 'Administrador' },
                { nombreRol: 'Moderador' }
            ]);
            console.log("Roles 'Administrador' y 'Moderador' insertados.");
        }

        // Verificar y crear la tabla usuarios si no existe
        const usuariosExists = await db.schema.hasTable('usuarios');
        if (!usuariosExists) {
            await db.schema.createTable('usuarios', (table) => {
                table.increments('idUsuarios').primary();  // Columna primaria con auto incremento
                table.string('nombre', 400);
                table.string('apellido', 400);
                table.string('Correo', 800).unique(); // Columna única para evitar duplicados
                table.string('Contrasena', 400);
                table.date('FechaCreacion').defaultTo(db.fn.now());
                table.date('ultimoAcceso').defaultTo(db.fn.now());
                table.string('estado', 250);
                table.integer('idRol').unsigned();
                table.foreign('idRol').references('rolesUser.idRol');  // Clave foránea
            });
            console.log("Tabla 'usuarios' creada.");
        }
    } catch (error) {
        console.error("Error al crear las tablas o insertar datos:", error);
    } finally {
        // Cierra la conexión después de la creación de las tablas e inserciones
        await db.destroy();
    }
}

const CreateDefaultUser = async () => {
    fetch('http://localhost:5000/api/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: "Joel Eduardo",
            apellido: "Arriola Santos",
            Correo: "joelarriola@gmail.com",
            Contrasena: "Joelarriola40$",
            estado: "Activo",
            idRol: 1
        })
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));

}

CreateDefaultUser()

// Ejecutar la creación de tablas
createTablesIfNotExist();
