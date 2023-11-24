const express = require("express");
const app = express();
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const passportLocal = require("passport-local");
const morgan = require('morgan');



const initializePassport = require("./passportConfig");
initializePassport(passport);


const port = process.env.PORT || 3000; 

app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret for now',
    resave: false,
    saveUninitialized: false,
})
);

app.use(passport.initialize());
app.use(passport.session());


app.use(flash());
app.use(express.static("public"))



app.get('/', checkNotAuthenticated, (req, res) => {
    res.render('dashboard.ejs');
});
app.get('/login',(req, res) => {
    res.render('login.ejs');
});
app.get('/signup', checkAuthenticated, (req, res) => {
    res.render('login.ejs');
});

app.get('/logout', checkAuthenticated, (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success_msg", "you have successfully loggedout");
        res.render('login');
    });
});

let items = [];
let categorywise = {
    food:0,
    entertainment:0,
    commute:0,
    shopping:0,
    health:0,
    education:0,
    others:0
  };

app.get("/home", checkAuthenticated,async (req, res) => {
    try {

        const result = await pool.query("SELECT * FROM expensesheet WHERE DATE_TRUNC('day', timestamp) = CURRENT_DATE AND user_id = $1 ORDER BY expense_id DESC;",[req.user.user_id]);
        items = result.rows;
        // console.log(result);
        categorywise = {
            food:0,
            entertainment:0,
            commute:0,
            shopping:0,
            health:0,
            education:0,
            others:0
          };
    
    items.forEach(item=>{
      switch(item.category){
    case 'Food':
      categorywise.food += parseFloat(item.amount);
      break;
      case 'Entertainment':
      categorywise.entertainment +=parseFloat( item.amount);
      break;
    
      case 'Commute':
      categorywise.commute += parseFloat(item.amount);
      break;
    
      case 'Shopping':
      categorywise.shopping +=parseFloat( item.amount);
      break;
    
      case 'Health':
      categorywise.health +=parseFloat( item.amount);
      break;
    
      case 'Education':
        categorywise.education += parseFloat(item.amount);
        break;
      case 'Others':
          categorywise.others += parseFloat(item.amount);
          break;
      default :
      console.log("in default case");  
      
      }
      
    });
        res.render("home.ejs", {
          listTitle: "Today",
          listItems: items,
          categorywise
        });
      } catch (err) {
        console.log(err);
      }
});



app.get('/deleteexpense/:id',checkAuthenticated,async(req,res)=>{
    const deletingId = req.params.id;
    try{
      pool.query(`DELETE FROM expensesheet WHERE expense_id = $1;`,[parseInt(deletingId)]);
      res.redirect('/home')
    }catch(err){
    console.log(err);  
    }
    });



app.get('/friends', checkAuthenticated, async (req, res) => {
    const friendsData = await pool.query(`SELECT *FROM friends WHERE user_id = $1`, [req.user.user_id]);
    console.log(friendsData.rows)

    console.log(friendsData.rows[0].friends_array);
    if (notFoundUser) {
        res.render('friends', { friends: friendsData.rows[0].friends_array, errmsg: "user not found" });

    }
    res.render('friends', { friends: friendsData.rows[0].friends_array,
    categorywise,listItems: items });
});



app.get('/delete/:friend', checkAuthenticated, async (req, res) => {
    const deletingFriend = req.params.friend;
    const result = await (pool.query(`SELECT friends_array FROM friends where user_id = $1;`, [req.user.user_id]));
    const Bfriends_array = result.rows[0].friends_array;


    let Afriends_array = [];
    function removeItem(arr, value) {
        var i = 0;
        const l = arr.length;
        while (i < l) {
            if (arr[i] === value) {
                arr.splice(i, 1);
                break;
            } else {
                ++i;
            }
        }
        return arr;
    }

    Afriends_array = removeItem(Bfriends_array, deletingFriend);


    await pool.query(`UPDATE friends SET friends_array =$1 WHERE user_id = $2;`, [Afriends_array, req.user.user_id]);

    res.redirect('/friends');
});
 

app.get('/groups', checkAuthenticated,(req, res) => {
    let result;
pool.query(`SELECT group_codes FROM users WHERE user_id =$1;`,[req.user.user_id],(err,results)=>{
if (err) {
    throw err;
}
result = results.rows;
console.log(result)
const groupCodes = results.rows[0].group_codes;
let groupDetails =[];
console.log(groupCodes);
let topush;

if (groupCodes!==null) {
    
     try {
        console.log("entered try block");
        groupCodes.forEach( groupCode => {
            pool.query(`SELECT group_name,group_code FROM group_details WHERE group_code = $1;`,[groupCode],(err,results)=>{
            if (err) {
                throw err;
            } 
                     // console.log(result);
            topush = results.rows[0]; 
            groupDetails.push(topush);
            console.log("1234....");
            // console.log(groupDetails);
            });
       
        });
     } catch (error) {
        console.log(err);
     }
 
      
   setTimeout(()=>{console.log(groupDetails);
    // console.log(JSON.stringify(groupDetails));
    // const groupsData = JSON.stringify(groupDetails);
    res.render("groupshome",{groups:groupDetails,msg:"rendered from if section"});},900); 
    
}else{
    res.render("groupshome",{msg:"rendered this"});
}
});
});





app.get('/creategroup', checkAuthenticated, async (req, res) => {
    function generateRandomNumber() {
        var minm = 1000000;
        var maxm = 9999990;
        return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    }

    let output = generateRandomNumber();

    let result = await pool.query(`SELECT EXISTS (SELECT 1 FROM group_details WHERE group_code = $1);`, [output]);



    while (result.rows[0].exists) {
        output = generateRandomNumber();
        result = await pool.query(`SELECT EXISTS (SELECT 1 FROM group_details WHERE group_code = $1);`, [output]);
    }

    res.render("creategroup", { groupcode: output })
});








app.post('/signup', async (req, res) => {
    let { name, email, password, password2 } = req.body;

    // console.log({name,email,password,password2});
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ message: "please enter all fields" });
    }
    if (password.length < 6) {
        errors.push({ message: "password should be atleast 6 characters" });
    }
    if (password !== password2) {
        errors.push({ message: "passwords donot match" });

    }

    await pool.query(
        `SELECT * FROM users
        WHERE name = $1`, [name], (err, results) => {
        if (err) {
            throw err;
        }
        if (results.rows.length > 0) {
            errors.push({ message: "Username is already being used" });
        }
    }
    );
    if (errors.length > 0) {
        // console.log('reached here');
        res.render('login.ejs', { errors })
    } else {
        //form validation has passed
        let hashedPassword = await bcrypt.hash(password, 10);
        // console.log(hashedPassword);


        pool.query(
            `SELECT * FROM users
                WHERE email = $1`, [email], (err, results) => {
            if (err) {
                throw err;
            }
            console.log(results.rows)
            if (results.rows.length > 0) {
                errors.push({ message: "email already registered" });
                res.render('login', { errors });
            } else {
                let newUserId;
                pool.query(
                    `INSERT INTO users (name, email, password)
                            VALUES ($1, $2, $3)
                            RETURNING user_id, password`, [name, email, hashedPassword], (err, results) => {
                    if (err) {
                        throw err;
                    }
                    console.log("im here");
                    newUserId = results.rows[0].user_id;
                    console.log(results.rows[0]);
                    console.log(results.rows[0].user_id);
                    console.log(newUserId);
                    req.flash("success_msg", "you have successfully registered, Please Login");
                    pool.query(`INSERT INTO friends (user_id)
                                VALUES ($1)`, [BigInt(newUserId)]);
                    res.redirect('/login')
                }
                )


            }
        }
        )
    }

    // console.log(errors);


});


app.post('/login', passport.authenticate('local', {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true
}));

app.post("/addexpense", checkAuthenticated,async (req, res) => {
    const item = req.body.newItem;
    // const amount=parseInt;
    // items.push({title: item});
    try {
      pool.query("INSERT INTO expensesheet (amount,category,user_id,note) VALUES ($1,$2,$3,$4);", [req.body.newAmount,req.body.newCategory,BigInt(req.user.user_id),req.body.newNote]);
       res.redirect("/home");
    } catch (err) {
      console.log(err);
    }
  });


  app.post("/editexpense",checkAuthenticated, async (req, res) => {
    const item = req.body.updatedItemTitle;
    const id = req.body.updatedItemId;
  
    try {
      await pool.query("UPDATE expensesheet SET note = ($1) WHERE expense_id = $2", [req.body.updatedItemTitle,req.body.updatedItemId]);
      res.redirect("/home");
    } catch (err) {
      console.log(err);
    }
  });

let notFoundUser = false;
app.post('/add-friend', checkAuthenticated, async (req, res) => {
    const user = req.user;
    console.log(user);
    let friendname;
    const friendExists = await pool.query(`SELECT EXISTS (SELECT 1 FROM users WHERE name = $1);`, [req.body.intofriends]);
    console.log(friendExists);
    if (!friendExists.rows[0].exists) {
        notFoundUser = true;
        res.render('errorpg', { errmsg: "no user identified of incorrect username", link: "friends" });
        
    } else {

        friendname = req.body.intofriends;
        console.log(friendname);
        pool.query(` UPDATE friends SET friends_array = friends_array ||$1 WHERE user_id=$2
                    
                    RETURNING friends_array;`, [[friendname], parseInt(user.user_id)], (err, results) => {
            if (err) {
                throw err;
            }
            console.log(results);
            res.render("friends", { friends: results.rows[0].friends_array, categorywise,listItems: items});

        });
    }
});





app.post('/create/:code', async(req, res) => {

    
    if (req.body.groupcode !== req.params.code) {
        res.render("creategroup", { errmsg: "entered group code not matched", groupcode: req.params.code });
    } else {
      await  pool.query(`INSERT INTO group_details (group_name,host_id,host_name,group_code) VALUES ($1,$2,$3,$4);`, [req.body.groupname, BigInt(req.user.user_id), req.user.name, req.params.code]);
      await  pool.query(`UPDATE users SET group_codes = group_codes||$1 WHERE user_id  = $2;`,[[BigInt(req.params.code)],req.user.user_id]);
        res.redirect('/groups');
    }
});




app.post('/joingroup',checkAuthenticated,async(req,res)=>{
const result = await pool.query(`SELECT members FROM group_details WHERE group_code=$1;`,[req.body.groupcode]);
if (result.rows[0].members===null) {
     
    await pool.query(`UPDATE group_details SET members = members||$1 WHERE group_code = $2;` [[req.user.name],req.body.groupcode]);
    await pool.query(`UPDATE users SET group_codes = group_codes||$1 WHERE user_id = $2;` [[req.body.groupcode],req.user.user_id]);
    
    res.redirect('/groups');   
}
const index = result.rows[0].members.indexOf(req.user.name);
if (index!==-1) {
    
    await pool.query(`UPDATE group_details SET members = members||$1 WHERE group_code = $2;` [[req.user.name],req.body.groupcode]);
    await pool.query(`UPDATE users SET group_codes = group_details||$1 WHERE user_id = $2;` [[req.body.groupcode],req.user.user_id]);
    
    res.redirect('/groups');
}else {
    res.render("errorpg",{errmsg:"already in group",link:"/groups"});
    }
});





function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }    
    res.redirect('/login');
}    
function checkNotAuthenticated(req, res, next) {
    if (!(req.isAuthenticated())) {
        return next();
    }    
    res.redirect('/home');
}    


app.listen(port, () => {
    console.log(`sever running on port ${port}`);
})