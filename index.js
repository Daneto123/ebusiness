import express from 'express'
import path from 'path'
import nodemailer from 'nodemailer'
import session from 'express-session'
import { fileURLToPath } from 'url';

import { getAllPhones, getPhoneByName, getPhoneBySize, addPhone, getUser, addNewUser } from './backend/database.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded())
app.use(express.static('public'))

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname,"public")));
app.use('/styles', express.static(path.join(__dirname,"public/styles")));

app.use(session({ 
  name: "session-id", 
  secret: "GFGEnter", // Secret key, 
  saveUninitialized: true, 
  resave: true,
})) 

// настойки на имейл от който ще се изпращат съобщенията
var transporter = nodemailer.createTransport({
  host: 'smtp.abv.bg',
  port: 465,
  secure: true,
  auth: {
    user: 'razzoto123@abv.bg',
    pass: 'J014106nsa'
  }
});

let username;
let item = [];

app.set('view engine', 'ejs');

// зареждане на началната страница
app.get("/", (req, res) => {

  if (req.session.loggedin) {
    username = req.session.username;
    res.render('home', {user: username, items: item})
  } else {
    res.redirect('/login');
	}

  res.end();

})

app.get("/logout", (req, res, next) => {
  req.session.destroy(function(err){
    if(err){
        console.log(err);
        res.send("Error")
    }else{
        res.render('base', { title: "Express", logout : "logout Successfully...!"})
    }
  })

})

// главна страница на магазина
// app.get("/h", (req, res) => {

//   res.sendFile('C:/Users/dancho/Desktop/e-business/public/src/index.html')
// })

// страница за регистрация
app.get("/login", (req, res) => {

  res.sendFile('C:/Users/dancho/Desktop/e-business/public/src/login.html')
})

app.get("/register", (req, res) => {

  res.sendFile('C:/Users/dancho/Desktop/e-business/public/src/register.html')
})

// създаване на профил
app.post('/r', function(req, res) {

	let username = req.body.username;
	let password = req.body.password;
  let repassword = req.body.repassword;
  let email = req.body.email;

  if(!username || !password || !repassword || !email){
		return res.status(400).json({error: "Invalid parameter" });
	}

  const phoneByName = addNewUser(username, password, email)
  phoneByName.then(function(result) {
    console.log(result)
    return res.json(result)
  })
	
});
// проверяване дали профилът съществува
app.post('/auth', function(req, res) {

	let username = req.body.username;
	let password = req.body.password;
	
	if (username && password) {
      const results = getUser(username, password)

      results.then(function(result) {
        if (result.length > 0) {
          req.session.loggedin = true;
          req.session.username = username;
          res.redirect('/');
        } else {
          res.send('Incorrect Username and/or Password!');
        }			
        res.end();
      })
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

// зареждане на страницата за контакти
app.get("/contact", (req, res) => {
  //res.sendFile('C:/Users/dancho/Desktop/e-business/public/src/contact.html')
  res.render('contact', {user: username});

})

// зареждане на страницата за добавяне на нов продукт
app.get("/addProd", (req, res) => {
  //res.sendFile('C:/Users/dancho/Desktop/e-business/public/src/addProduct.html')
  res.render('addProduct', {user: username});
})


app.post("/addItemCart", (req, res) => {

  //const user = req.body.user;
  const id = req.body.item;
  console.log(id);

  if(!id){
    return res.status(400).json({error: "Invalid parameter"});
  }

  let newItem = {
    username: username,
    id: id
  }
  item.push(newItem);

})

// показване на всички телефони
app.get("/phones", (req, res) => {
  const phones = getAllPhones()

  if(!phones || phones.length == 0){
		return res.status(400).json({error: "Invalid parameter" });
	}

  phones.then(function(result) {
    console.log(result)
    return res.json(result)
  })
})

// търсене на телефон по име
app.get("/phonesByName/:name", (req, res) => {
  let name = req.params.name;

  if(!name){
		return res.status(400).json({error: "Invalid parameter" });
	}

  const phoneByName = getPhoneByName(name)
  phoneByName.then(function(result) {
    console.log(result)
    return res.json(result)
  })
})

// търсене на телефон по размери
app.get("/phonesBySize/:height/:width/:thickness", (req, res) => {
  let height = req.params.height;
  let width = req.params.width;
  let thickness = req.params.thickness;

  if(!height || !width || !thickness){
		return res.status(400).json({error: "Invalid parameter" });
	}

  const phoneBySize = getPhoneBySize(height, width, thickness)
  phoneBySize.then(function(result) {
    return res.json(result)
  })

})

// добавяне на нова обява
app.post("/addPhones", (req, res) => {
  const name = req.body.PhoneModel
  const width = req.body.Width
  const height = req.body.Height
  const thickness = req.body.Thickness
  const color = req.body.Color
  const company = req.body.CompanyName
  const availability = req.body.Availability
  const price = req.body.Price

  if(!name || !height || !width || !thickness || !color || !company || !availability || !price){
		console.log(name);
    console.log(width);
    console.log(height);
    console.log(thickness);
    console.log(color);
    console.log(company);
    console.log(availability);
    console.log(price);
    return res.status(400).json({error: "Invalid parameter" });
	}

  const phoneNew = addPhone(name, width, height, thickness, color, company, availability, price)
  phoneNew.then(function(result) {
    console.log(result);
    return res.json(result)
  })
})

// изпращане на заявка за нов калъф
app.post("/makeReq", (req, res) => {
  
  const name = req.body.phoneModule
  const width = req.body.width
  const height = req.body.height
  const thickness = req.body.thickness
  const color = req.body.color
  const email = req.body.email
  const moreInfo = req.body.moreInfo

  if(!name || !height || !width || !thickness || !color || !email || !moreInfo){
		console.log(name);
    console.log(width);
    console.log(height);
    console.log(thickness);
    console.log(color);
    console.log(email);
    console.log(moreInfo);

    return res.status(400).json({error: "Invalid parameter" });
	}

  // имейл до мен
  var mailOptions = {
    from: 'razzoto123@abv.bg',
    to: 'razzoto123@abv.bg',
    subject: 'Заявка за нов калъф',
    text: "name:" + name + "\nwidth: " + width + "\nheight: " + height +
    "\n thickness :" + thickness + "\n color: " + color + "\n email: " + email +
    "\n moreInfo: " + moreInfo,
  };

  // имейл до изпращача на заявката
  var mailOptions1 = {
    from: 'razzoto123@abv.bg',
    to: email,
    subject: 'Заявка за нов калъф',
    text: "Благодарим за вашата заявка ще я разгледаме и ще ви отговорим в най-кратък срок.\n" 
    + "Ето и вашата заявка:" + "\nname:" + name + "\nwidth: " + width + "\nheight: " + height +
    "\n thickness :" + thickness + "\n color: " + color + "\n email: " + email +
    "\n moreInfo: " + moreInfo,
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  transporter.sendMail(mailOptions1, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.send(json({message: "Благодарим за заявката тя ще бъде обработена и ще получите отговор."})).redirect('/')
})

// ако се опита да се достъпи невалиден линк
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Page not found')
})

// стартиране на сървъра
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})