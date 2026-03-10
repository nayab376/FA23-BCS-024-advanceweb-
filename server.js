const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const mysql = require("mysql2");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));

// ------------------ SQLite ------------------
const sqliteDB = new sqlite3.Database("./mydb.sqlite", (err)=>{
  if(err) console.log(err.message);
  else console.log("SQLite connected!");
});
sqliteDB.run(`CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT
)`);

// ------------------ MySQL ------------------
const mysqlDB = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"", // XAMPP default blank
  database:"testdb"
});
mysqlDB.connect(err=>{
  if(err) console.log(err.message);
  else console.log("MySQL connected!");
});

// ------------------ MongoDB ------------------
mongoose.connect("mongodb://127.0.0.1:27017/testdb"); // <-- removed deprecated options
const mongoSchema = new mongoose.Schema({ name:String, email:String });
const MongoUser = mongoose.model("User", mongoSchema);
mongoose.connection.once("open", () => console.log("MongoDB connected!"));

// ------------------ Routes ------------------

// Home page
app.get("/", (req,res)=>{
  res.render("index");
});

// ------------------ SQLite CRUD ------------------
app.get("/api/sqlite/users",(req,res)=>{
  sqliteDB.all("SELECT * FROM users",[],(err,rows)=>{
    if(err) res.status(500).send(err.message);
    else res.send(rows);
  });
});
app.post("/api/sqlite/users",(req,res)=>{
  const { name,email } = req.body;
  sqliteDB.run("INSERT INTO users(name,email) VALUES(?,?)",[name,email],function(err){
    if(err) res.status(500).send(err.message);
    else res.send({id:this.lastID,name,email});
  });
});
app.post("/api/sqlite/users/delete",(req,res)=>{
  const { id } = req.body;
  sqliteDB.run("DELETE FROM users WHERE id=?",[id],(err)=>{
    if(err) res.status(500).send(err.message);
    else res.send("Deleted");
  });
});
app.post("/api/sqlite/users/update",(req,res)=>{
  const { id,name,email } = req.body;
  sqliteDB.run("UPDATE users SET name=?, email=? WHERE id=?",[name,email,id],(err)=>{
    if(err) res.status(500).send(err.message);
    else res.send("Updated");
  });
});

// ------------------ MySQL CRUD ------------------
app.get("/api/mysql/users",(req,res)=>{
  mysqlDB.query("SELECT * FROM users",(err,result)=>{
    if(err) res.status(500).send(err.message);
    else res.send(result);
  });
});
app.post("/api/mysql/users",(req,res)=>{
  const { name,email } = req.body;
  mysqlDB.query("INSERT INTO users(name,email) VALUES(?,?)",[name,email],(err,result)=>{
    if(err) res.status(500).send(err.message);
    else res.send({id:result.insertId,name,email});
  });
});
app.post("/api/mysql/users/delete",(req,res)=>{
  const { id } = req.body;
  mysqlDB.query("DELETE FROM users WHERE id=?",[id],(err)=>{
    if(err) res.status(500).send(err.message);
    else res.send("Deleted");
  });
});
app.post("/api/mysql/users/update",(req,res)=>{
  const { id,name,email } = req.body;
  mysqlDB.query("UPDATE users SET name=?, email=? WHERE id=?",[name,email,id],(err)=>{
    if(err) res.status(500).send(err.message);
    else res.send("Updated");
  });
});

// ------------------ MongoDB CRUD ------------------
app.get("/api/mongo/users",async(req,res)=>{
  try {
    const users = await MongoUser.find();
    res.send(users);
  } catch(err){
    res.status(500).send(err.message);
  }
});
app.post("/api/mongo/users",async(req,res)=>{
  try {
    const user = new MongoUser(req.body);
    await user.save();
    res.send(user);
  } catch(err){
    res.status(500).send(err.message);
  }
});
app.post("/api/mongo/users/delete",async(req,res)=>{
  try {
    const { id } = req.body;
    await MongoUser.findByIdAndDelete(id);
    res.send("Deleted");
  } catch(err){
    res.status(500).send(err.message);
  }
});
app.post("/api/mongo/users/update",async(req,res)=>{
  try {
    const { id,name,email } = req.body;
    await MongoUser.findByIdAndUpdate(id,{name,email});
    res.send("Updated");
  } catch(err){
    res.status(500).send(err.message);
  }
});

// ------------------ Start Server ------------------
app.listen(3000,()=>console.log("Server running on http://localhost:3000"));