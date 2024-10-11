module.exports = {
  HOST: process.env.DB_HOST || "localhost",  // Hôte de la base de données (localhost si tu es en local)
  USER: process.env.DB_USER || "root",       // Utilisateur, ici 'root' (ou tout autre utilisateur que tu as créé)
  PASSWORD: process.env.DB_PASSWORD || "my-secret-pw",  // Le mot de passe défini lors de la création du conteneur
  DB: process.env.DB_DB || "medtrackr",      // Nom de la base de données, ici 'medtrackr' (ou une autre base si nécessaire)
  dialect: "mariadb",                        // Dialecte du SGBD (ici MariaDB)
  pool: {
    max: 5,                                  // Nombre max de connexions dans le pool
    min: 0,                                  // Nombre min de connexions dans le pool
    acquire: 30000,                          // Temps maximal pour établir une connexion (en ms)
    idle: 10000                              // Temps maximal de connexion inactive avant d’être libérée (en ms)
  }
};
