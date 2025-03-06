const app = require('./app');

// Start the server
const port = process.env.PORT || 3006;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
