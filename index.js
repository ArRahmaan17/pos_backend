require('dotenv').config();
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3001
const db = require('./models');
const UserRoute = require('./routes/Auth');
app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.get('/', (req, res) => {
    res.status(200).json({ 'message': 'welcome to backend pos aplikasi', 'ip': req.ip });
});
app.use('/auth', UserRoute)
db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
})