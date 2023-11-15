const express = require("express");
const app = express();
const {pool}= require("./dbConfig");
const session = require("express-session");
const flash = require("express-flash");
const bodyParser=require("body-parser");
const morgan = require("morgan");

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("dev"));

let items = [];


app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM expensesheet WHERE DATE_TRUNC('day', timestamp) = CURRENT_DATE AND user_id = $1 ORDER BY expense_id DESC;",[1]);
    items = result.rows;
    console.log(result);
    res.render("home.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});


app.get('/delete/:id',async(req,res)=>{
const deletingId = req.params.id;
try{
  pool.query(`DELETE FROM expensesheet WHERE expense_id = $1;`,[parseInt(deletingId)]);
}catch(err){
console.log(err);  
}
});

// app.get('/edit/:id',async(req,res)=>{
//   const updatingingId = req.params.id;
//   try{
//     pool.query(`UPDATE expensesheet SET note = $1 WHERE expense_id = $2;`,[req.body.note,parseInt(updatingingId)]);
//   }catch(err){
//   console.log(err);  
//   }
//   });


app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  // const amount=parseInt;
  // items.push({title: item});
  try {
    pool.query("INSERT INTO expensesheet (amount,category,user_id,note) VALUES ($1,$2,$3,$4);", [req.body.newAmount,req.body.newCategory,1,req.body.newNote]);
     res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await pool.query("UPDATE expensesheet SET note = ($1) WHERE expense_id = $2", [item,id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

// app.delete("/delete", async (req, res) => {
//   const id = req.params.deleteItemId;
//   // try {
//   //   await pool.query("DELETE FROM expensesheet WHERE expense_id = $1", [3,1]);
//   //   res.redirect("/");
//   // } catch (err) {
//   //   console.log(err);
//   // }

//   await pool.query("DELETE FROM expensesheet WHERE expense_id = $1", [id])
//     .then(result =>{
//       res.redirect("/");
//         })
//     .catch(err =>{
//       console.log(err);
//     });
// });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});