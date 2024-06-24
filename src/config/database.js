module.exports = {
  dialect: 'postgres',
url:'postgresql://postgres:xUHugCeiUnnGJmvqVdcUOXrewdieUDsA@monorail.proxy.rlwy.net:46685/railway',
  define: {
    timestamps: true, // Agrega campos de createdAt y updatedAt
    underscored: true, // Se agregan _ en los nombres de las tab
    underscoredAll: true,
  },
}
