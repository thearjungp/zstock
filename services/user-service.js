
const User = require("../models/user");
const mysql = require("mysql2");
const pusers = require("../sample_data/users.json")
const insertPredefinedValues = require("../index").insertPredefinedValues;


const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'rootroot',
    multipleStatements: true,
  });




exports.getUserByIdPromise = (id) => {

    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM users WHERE user_id = ?', [id], (err, results) => {
            if(err || results[0] == undefined)
            {
                reject(new Error("Unable to find user with the given id"))
            }
            resolve(results[0])
        })
    })
    
    
}

exports.getAllUsersPromise = () => {

    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM users', (err, results) => {
            if(err)
            {
                reject(new Error(err))
            }
            resolve(results);
        })
    })

    
}



exports.createUserPromise = (user) => {

    return new Promise ((resolve, reject) => {
        connection.query(`INSERT INTO users(name, email, phone, pan, acnt_number, role, available_margin)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user.name, user.email, user.phone, user.pan, user.acnt_number, user.role, user.available_margin],
        (err, results) => {
            if(err){
                reject(new Error("Unable to create a new user"))
            }
            return resolve({
                message: "User CREATED with given details with user ID " + results.insertId
            });
        })
    })
    
}



exports.updateUserPromise = (user_id, user) => {

    return new Promise((resolve, reject) => {
        connection.query(`UPDATE users SET name=?, email=?, phone=?, pan=?, acnt_number=?, role=?, available_margin=? WHERE user_id=?`,
        [user.name, user.email, user.phone, user.pan, user.acnt_number, user.role, user.available_margin, user_id],
        (err, results) => {
            if(err){
                reject(new Error("Unable to update the user"))
            }
            resolve({
                message: "User UPDATED" 
            })
        })
    })

}

exports.updateUserMarginPromise = (amount, user) => {

    return new Promise((resolve, reject) => {
        connection.query(`UPDATE users SET available_margin=? WHERE user_id=?`,
        [user.available_margin - amount, user.user_id],
        (err, results) => {
            if(err){
                reject(new Error("Unable to update the user"))
            }
            resolve({
                message: "User UPDATED" 
            })
        })
    })

}



exports.deleteUserPromise = (user) => {

    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM users WHERE user_id=?`, [user.user_id],
        (err, results) => {
            if(err)
            {
                reject(new Error("Unable to delete the user with given User ID"))
            }
            resolve({
                message: "User deleted"
            })
        })
    })    

}


let insertPredefinedValsUsers = () => {

    // TABLE CREATION
    connection.query(`CREATE TABLE IF NOT EXISTS users(
        user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(30),
        email VARCHAR(30),
        phone VARCHAR(10),
        pan VARCHAR(10),
        acnt_number VARCHAR(16),
        role INT,
        available_margin FLOAT(12,2)
        )`,
      (err, results) => {
      if(err)
      {
        console.error(err);
        return;
      }
      console.log('USERS table created')
  
    })
  
    // DATA CREATION 
    for(let u of pusers)
    {

        let user = new User(u.name, u.email, u.phone, u.pan, u.acnt_number, u.role, u.available_margin)
        connection.query(`INSERT INTO users(name, email, phone, pan, acnt_number, role, available_margin)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user.name, user.email, user.phone, user.pan, user.acnt_number, user.role, user.available_margin],
        (err, results) =>{
            if(err){
            console.error('Unable to insert predefined user values - ' + err)
            return;
            } 
        })
        console.log("Inserted Predefined USER values")
  
    }
  
}

connection.query('USE stocks;',(err, results) => {
    if(err){
        console.error('ERROR USING DB: ' + err.stack)
        return;
    } 

    // Inserting predefined values for users;
    if(insertPredefinedValues) insertPredefinedValsUsers();
}
)