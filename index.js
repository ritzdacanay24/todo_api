const connectDB = require('./startup/db');
const express = require('express');
const app = express();
const http = require('http')
const socketIo = require('socket.io')

//app api
const user = require('./routes/users')
const list = require('./routes/lists')
const items = require('./routes/items')
const recipes = require('./routes/recipes')
const supports = require('./routes/support')

//3rd party api
const kroger = require('./routes/kroger')
const spoonacular = require('./routes/spoonacular')
const cookieParser = require('cookie-parser');

const cors = require('cors');
app.use(cors());
app.use(cookieParser());

connectDB();
app.use(express.json());

app.use("/api/users", user);
app.use("/api/lists", list);
app.use("/api/items", items);
app.use("/api/recipes", recipes);
app.use("/api/supports", supports);

app.use("/api/kroger", kroger);
app.use("/api/spoonacular", spoonacular);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});

/** Socket server **/
const server = http.createServer(app);
const io = socketIo(server);
const wsPort = process.env.WSPORT || 4001;
server.listen(wsPort, () => console.log(`Socket server started on port ${wsPort}`));

io.on('connection', (socket) => {

    socket.on('CREATE_TASK', function (data, listId) {
        io.emit('RECEIVE_CREATE_TASK', data, listId);
    })

    socket.on('UPDATE_TASK', function (data, listId) {
        io.emit('RECEIVE_UPDATE_TASK', data, listId);
    })

});


