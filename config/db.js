import { Sequelize, QueryTypes } from 'sequelize';

const sequelize = new Sequelize('GDA00539-OT-Emerson-Mendez', 'sa', 'TuContraseñaSegura123', {
host: 'localhost',
dialect: 'mssql',
dialectOptions: {
    encrypt: true,
    trustServerCertificate: true,
}
});
export const query = sequelize.query.bind(sequelize);
export { sequelize, QueryTypes };
