const express = require('express')
const fs = require('fs')
const mongoose = require("mongoose")




const app = express();
const PORT =6000;

// Middleware - plugin
app.use(express.urlencoded({ extended: false })); // for form data




//connection
mongoose.connect('mongodb://127.0.0.1:27017/Database-learning')
.then(() =>console.log("Mongo connected"))
.catch((err) => console.log("Mongo Error" , err))

//schema 
const userSchema = new mongoose.Schema({
  firstName: {
    type:String,
    required:true,
  },

  lastName: {
    type:String,
  },

  email: {
    type:String,
    unique:true,
    required:true,
  },

  jobTitle: {
    type:String,
  },

  gender:{
    type:String,
  },

})


//model
const User = mongoose.model("user" , userSchema)



//create new users
app.post("/api/users" ,  async (req,res) => {
 const body = req.body;

 if(
  !body ||
  !body.first_name ||
  !body.last_name ||
  !body.email ||
  !body.gender ||
  !body.job_title
 ) {
  return res.status(400).json({msg:"All fields are req....."});
 }

const result = await User.create({
 firstName: body.first_name,
 lastName:body.last_name,
 email:body.email,
 gender : body.gender,
 jobTitle : body.job_title
})

console.log("Result",result)

return result.status(201).json({msg:"Success"})


});



//get the user and email id by this routes
app.get('/users' ,async (req,res)=>{
const allDbUsers = await User.find({})

  const html =`
  <ul>
  ${allDbUsers.map((user) =>`<li>${user.firstName} - ${user.email}</li>`)}
  
  </ul>
  `
   res.send(html)
});


//get the user by id
app.get('/api/users/:id' ,async (req,res)=>{
  
  const user = await User.findById(req.params.id);

if(!user) return res.status(404).json({error:"user not found"});
  return res.json(user)
})


//edit the user with id
app.patch("/api/users/:id" , async (req,res) => {
  const user = await User.findByIdAndUpdate(req.params.id , {lastName : "Chamar"})
  return res.json({status :"success"})
})


//delete the user with id 
app.delete("/api/users/:id" , async (req,res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  return res.json({status :"succes"})
})


app.listen(PORT,()=>console.log(`Server started at Port:${PORT}`))
