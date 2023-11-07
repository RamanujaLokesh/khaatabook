const express = require("express");
const app = express();
const {pool}= require("./dbConfig");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");



const initializePassport = require("./passportConfig");
initializePassport(passport);


const port = process.env.PORT || 3000;

app.set("view engine","ejs");
app.use(express.urlencoded({extended:false}));
app.use(session({
    secret:'secret for now',
    resave:false,
    saveUninitialized:false,
})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());



app.get('/',(req,res)=>{
res.render('login.ejs');
});

app.get('/register',(req,res)=>{
    res.render('register.ejs');
});


app.get('/secrets',(req,res)=>{
res.render('secrets')
});

app.get('/logout',(req,res)=>{
req.logOut((err)=>{
    if (err) {
        return next(err);
    }
    req.flash("success_msg","you have successfully loggedout");
    res.render('login');
});
});




app.post('/register',async(req,res)=>{
let {name,email,password,password2}=req.body;

// console.log({name,email,password,password2});
let errors =[];

if (!name||!email||!password||!password2) {
    errors.push({message:"please enter all fields"});
}
if (password.length<6) {
    errors.push({message:"password should be atleast 6 characters"});
}
if (password!==password2) {
    errors.push({message:"passwords donot match"});
    
}
// console.log(errors.length);
if (errors.length>0) {
    console.log('reached here');
    res.render('register.ejs',{errors})
}else{
//form validation has passed
let hashedPassword = await bcrypt.hash(password,10);
console.log(hashedPassword);


pool.query(
    `SELECT * FROM users
    WHERE email = $1`,[email],(err,results)=>{
        if (err) {
            throw err;
        }
        console.log(results.rows)
        if (results.rows.length>0) {
            errors.push({message:"user already exist"});
            res.render('register',{errors});
        }else{
            pool.query(
                `INSERT INTO users (name, email, password)
                VALUES ($1, $2, $3)
                RETURNING id, password`,[name,email, hashedPassword],(err,results)=>{
                    if(err){
                        throw err;
                    }
                    console.log(results.rows);
                    req.flash("success_msg","you have successfully registered, Please Login");
                    res.redirect('/')
                }
            )
        }
    }
)
}

// console.log(errors);

 
});


app.post('/login',passport.authenticate('local',{
    successRedirect:"/secrets",
    failureRedirect:"/login",
    failureFlash:true
}));

app.listen(port,()=>{
    console.log(`sever running on port ${port}`);
})