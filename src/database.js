const mysql = require("mysql2");

const connection = mysql.createConnection({
    host        :  "localhost",
    user        :  "root",
    password    :  "Password",
    port        :   3306,
    database    :   "SDApp"
})
connection.connect((err)=>{
    if(err){
        console.log(err);
        console.log("Unable to connect Database");
    }else{
        console.log("Successfully Connect Database");
    }
})

module.exports = connection;