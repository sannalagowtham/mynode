const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const bodyParser = require('body-parser')

app.use(cors());
app.use(express());
app.use(express.json());
app.use(express.urlencoded());
app.use('/uploads',express.static("uploads"));
const db = require("./database");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, 'uploads');
    },
    filename : function(req,file,cb){
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, Date.now()+ "_"+file.originalname);

    }
})

const upload = multer({storage:storage});

app.post("/signup",upload.single("image"),async (req,res)=>{
    console.log(req.file);
    console.log(req.body);
    let hashedPassword = await bcrypt.hash(req.body.password,10)
    let sqlQuery = `insert into customers(first_name,last_name,email,password,image,gender,company_name,dob,official_mail_id,phone_no) 
    values('${req.body.first_name}','${req.body.last_name}','${req.body.email}','${hashedPassword}','${req.file.path}', '${req.body.gender}','${req.body.company_name}','${req.body.dob}','${req.body.official_mail_id}','${req.body.phone_no}')`
    db.query(sqlQuery,(error,result,fields)=>{
        if(error){
            res.json(error);
        }else{
            res.json({status:"User Successfully created"});
        }
    })
});

app.post("/login",upload.none(),(req,res) => {
    const body = {
        post: req.body.post,
        created: new Date()
      };
    console.log(body);
    let sqlQuery =`select * from customers where email = '${req.body.email}'`
    console.log(sqlQuery);
    db.query(sqlQuery,async(error,result,fields) =>{
        if(error){
            res.json(error);
        }else{
            //res.json(result);
            if(result.length>0){
                let isPasswordCorrect = await bcrypt.compare(req.body.password,result[0]["password"]);
                if(isPasswordCorrect == true){
                //if(result[0]["password"] == req.body.password){
                     res.json({
                                loggedIn:true,
                                CLN:result[0]["CLN"],
                                first_name:result[0]["first_name"],
                                last_name:result[0]["last_name"],
                                email:result[0]["email"],
                                password:result[0]["password"],
                                image:result[0]["image"],
                                gender:result[0]["gender"],
                                company_name:result[0]["company_name"],
                                phone_no:result[0]["phone_no"],
                                dob:result[0]["dob"],
                                official_mail_id:result[0]["official_mail_id"],
                                status:"Successfully logged in"});
                    console.log("Sucessfully Login")
                    
                }else{
                    res.json({
                        loggedIn:false,
                        status:"Invalid Password"});
                        console.log("Invalid Password")
                        
                    }
            }else{
                loggedIn:false,
                res.json({status:"User doesn't exit"});
                console.log("User doesn't exit")
            
            }
            }
    });
    
        }
     )
app.get('/user-list', function(req, res, next) {
    let sql=`SELECT * FROM customers`;
    console.log(sql);
    db.query(sql, function (err, data, fields) {
    if (err){
        console.log(err);
    }else{
        res.json( { title: 'customers List', userData: data});
    }
    
   
    });
});

app.get('/customer_detalis', (req,res,next) => {
    let sql = ` select * from customers where CLN = '${req.body.CLN}' or first_name = '${req.body.first_name}' or  phone_no='${req.body.phone_no}'`
    console.log(sql);
    db.query(sql,function(err, data, fields){
        if (err){
            console.log(err);
        }else{
            res.json( { title: 'customers Details', userData: data});
        }
    })
});

app.listen(80,()=>{
    console.log("listing port number is 80");
})