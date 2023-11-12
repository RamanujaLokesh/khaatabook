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
    res.render('login.ejs');
});
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login');
});
app.get('/signup', checkAuthenticated, (req, res) => {
    res.render('login.ejs');
});

// passport.authenticate('local', { failureRedirect: '/login' })
app.get('/secrets', checkAuthenticated, (req, res) => {
    // if (isAuthenticated) {

    //     res.render('secrets');
    // }
    res.render('secrets');
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

app.get('/friends', checkAuthenticated, async (req, res) => {
    const friendsData = await pool.query(`SELECT *FROM friends WHERE user_id = $1`, [req.user.user_id]);
    console.log(friendsData.rows)

    console.log(friendsData.rows[0].friends_array);
    if (notFoundUser) {
        res.render('friends', { friends: friendsData.rows[0].friends_array, errmsg: "user not found" });

    }
    res.render('friends', { friends: friendsData.rows[0].friends_array });
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


app.get('/groups', checkAuthenticated, (req, res) => {
    res.render("groupshome");
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
                    res.redirect('/')
                }
                )


            }
        }
        )
    }

    // console.log(errors);


});


app.post('/login', passport.authenticate('local', {
    successRedirect: "/secrets",
    failureRedirect: "/login",
    failureFlash: true
}));

let notFoundUser = false;
app.post('/add-friend', checkAuthenticated, async (req, res) => {
    const user = req.user;
    console.log(user);
    let friendname;
    const friendExists = await pool.query(`SELECT EXISTS (SELECT 1 FROM users WHERE name = $1);`, [req.body.intofriends]);
    console.log(friendExists);
    if (!friendExists.rows[0].exists) {
        notFoundUser = true;
        res.render('errorpg', { errmsg: "no user identified of incorrect username", link: "/friends" });
        return;
    } else {

        friendname = req.body.intofriends;
        console.log(friendname);
        pool.query(` UPDATE friends SET friends_array = friends_array ||$1 WHERE user_id=$2
                    
                    RETURNING friends_array;`, [[friendname], parseInt(user.user_id)], (err, results) => {
            if (err) {
                throw err;
            }
            console.log(results);
            res.render("friends", { friends: results.rows[0].friends_array });

        });
    }
});





app.post('/create/:code', (req, res) => {

    if (req.body.groupcode !== req.params.code) {
        res.render("creategroup", { errmsg: "entered group code not matched", groupcode: req.params.code });
    } else {
        pool.query(`INSERT INTO group_details (group_name,host_id,host_name,group_code) VALUES ($1,$2,$3,$4);`, [req.body.groupname, BigInt(req.user.user_id), req.user.name, req.params.code]);
        res.redirect('/groups');
    }
});




app.post('/joingroup',checkAuthenticated,async(req,res)=>{

    
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