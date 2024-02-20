module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres', // Usuario de la base de datos
  password: 'postgres', // Contraseña del usuario anterior
  database: 'codeburger', // Nombre de la BD a utilizar
  define: {
    timestamps: true, // Agrega campos de createdAt y updatedAt
    underscored: true, // Se agregan _ en los nombres de las tab
    underscoredAll: true,
  },
}
