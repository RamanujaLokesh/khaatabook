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




app.get("/", async (req, res) => {
  try {
    let items = [];
    const result = await pool.query("SELECT * FROM expensesheet WHERE DATE_TRUNC('day', timestamp) = CURRENT_DATE AND user_id = $1 ORDER BY expense_id DESC;",[1]);
    items = result.rows;
    // console.log(result);
    let categorywise = {
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


app.get('/delete/:id',async(req,res)=>{
const deletingId = req.params.id;
try{
  pool.query(`DELETE FROM expensesheet WHERE expense_id = $1;`,[parseInt(deletingId)]);
}catch(err){
console.log(err);  
}
});




app.post("/add", async (req, res) => {
  const item = req.body.newItem;

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
    await pool.query("UPDATE expensesheet SET note = ($1) WHERE expense_id = $2", [req.body.updatedItemTitle,req.body.updatedItemId]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});