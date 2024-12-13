const dotenv = require('dotenv');
const app = require('./app.js');
const { sequelize } = require('./models/index.js');

dotenv.config();

const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');

        app.listen(port, host, () => {
            console.log(`Server is running on http://${host}:${port}`);
        });
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    });