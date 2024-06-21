const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection=require("./config")

const app = express();// taking help of express 
app.use(express.json());// to store data collected

app.use(express.urlencoded({extended:false}));// it is used to understand url language for the program

app.set('view engine','ejs');//it is used to render dynamic pages from views page  15 line
app.use(express.static("public"));// used to send staic files from public directory (css img)
app.get("/",(req,res) =>//when root is (/) is accessed it renders login page
{
    res.render("login");
});

app.get("/signup",(req,res)=>{//when (/signup) is accesses it renders signup page
    res.render("signup");
});
// This code extracts username nd password frmo the request body
app.post("/signup",async (req,res)=>{
    const data= {
        name:req.body.username,
        password:req.body.password
    }
    //checks if there is already an user
    const existuser = await collection.findOne({name:data.name});
    if(existuser)
        {
           return res.send("User Alredy exits, Pls choose different name");
        }
    else
       {
            const saltRounds =10;
            const hashpwd = await bcrypt.hash(data.password,saltRounds);
            data.password=hashpwd;

            const userdata = await collection.insertMany(data);
            console.log(userdata);
        }
});

app.post("/login",async (req,res)=>{
    try{
        const check =await collection.findOne({name:req.body.username});
        if(!check)
            {
                return res.send("User Name not found");
            }
        const pwdmatch = await bcrypt.compare(req.body.password,check.password)
        if(pwdmatch)
        {
              return res.render("home");
        }
        else
        {
           return  res.send("wrong password");
        }
    }
    catch{
        res.send("Wrong Details");
    }

});



 const port =5000;
app.listen(port,()=>{
    console.log(`Server running On Port:${port}`);
})
