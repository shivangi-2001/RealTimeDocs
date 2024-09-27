require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174", "https://github.com"],
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());

const sequelize = require("./database");
sequelize.sync({ force: false });

const DocumentRoute = require("./routes/document.js");
app.use("", DocumentRoute);

const AuthenticationRoute = require('./routes/authentication.js')
app.use("/auth", AuthenticationRoute);

const GoogleLoginRoute = require('./routes/googleAuth.js')
app.use("/auth", GoogleLoginRoute);

const GithubLoginRoute = require('./routes/githubAuth.js')
app.use("/auth", GithubLoginRoute)

const { Document } = require("./model/document.js");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("documentMessage", async (id, title, content) => {
    try {
      const doc = await Document.findOne({ where: { title, id } });
      if (!doc) {
        console.log("Document with the specified title does not exist.");
        return;
      }
      await doc.update({ content });
    } catch (err) {
      console.error("Error updating document:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


server.listen(8000, () => {
  console.log("Server is running on port 8000");
});
