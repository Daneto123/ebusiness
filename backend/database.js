import mysql from 'mysql'

// използване на enviroment ,за подкарване на различни платформи
import dotenv from 'dotenv'
dotenv.config()

// връзка с база данни
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 100,
  multipleStatements: true
})

db.connect();

// вземане на информация за всички телефони
export function getAllPhones() {

    return new Promise(function(resolve, reject) {
      db.query("SELECT * FROM phones", function (err, result, fields) {
        if (err) throw err;
        console.log("print");
        resolve(result);
      });

    })

}

// вземане на информация за телефон по зададено име
export function getPhoneByName(name) {
  return new Promise(function(resolve, reject) {
  db.query(`
  SELECT * 
  FROM phones
  WHERE name = ?
  `, [name], function (err, result, fields){
    if (err) throw err;
      console.log("db: " + result)
      resolve(result);
    })
  })

}

// вземане на информация за телефон по размери
export function getPhoneBySize(width, height, thickness) {
  return new Promise(function(resolve, reject) { 
    db.query(`
    SELECT * 
    FROM phones
    WHERE width = ?
    AND height = ?
    AND thickness = ?
    `, [width, height, thickness], function (err, result, fields){
      if (err) throw err;
        resolve(result);
    })
  })

}

export function getUser(username, password) {
  return new Promise(function(resolve, reject) { 
    db.query(`
    SELECT * 
    FROM accounts 
    WHERE username = ? 
    AND password = ?`
    , [username, password], function(err, result, fields) {
      if (err) throw err;
        resolve(result);
    })
  })

}

// добавяне на нова фирма и продукт която тя предлага
export function addPhone(name, width, height, thickness, color, company, availability, price) {
  return new Promise(function(resolve, reject) {  
    db.query(`
    INSERT INTO phones (name, width, height, thickness, color, company, availability, price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, width, height, thickness, color, company, availability, price], function(err, result, fields){
      if (err) throw err;
        console.log(result)
        resolve(result);
    });
  })
  
}

// добавяне на нов потребител
export function addNewUser(username, password, email) {
  return new Promise(function(resolve, reject) {  
    db.query(`
    INSERT INTO accounts (username, password, email)
    VALUES (?, ?, ?)
    `, [username, password, email], function(err, result, fields){
      if (err) throw err;
        console.log(result)
        resolve(result);
    });
  })
  
}