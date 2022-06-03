require('dotenv').config({path: "./config.env"});
const express = require('express');
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')
var cors = require('cors')

// Connect DB
connectDB();

const app = express();

app.use(express.json());
app.use(cors())
app.use('/api/auth',require('./routes/auth'));
app.use('/api/groups',require('./routes/groups'));
app.use('/api/dna',require('./routes/dna'));
app.use('/api/posts',require('./routes/posts'));
app.use('/api/tree',require('./routes/tree'));

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on("unhandledRejection", (err,promise)=>{
    console.log(`Logged Error: ${err}`)
    server.close(()=> process.exit(1))
})