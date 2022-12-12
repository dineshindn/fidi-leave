const app = require('./src/app');
const { PORT } = require('./src/config/config');
let port = PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
})