const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Groq = require("groq-sdk");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// MongoDB Connection

mongoose
.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected ✅");
})
.catch((err) => {
    console.log("MongoDB Error ❌", err);
});



// User Schema

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    }

});


const User = mongoose.model("User", userSchema);



// Groq Setup

const groq = new Groq({

    apiKey: process.env.GROQ_API_KEY

});



// Home Route

app.get("/",(req,res)=>{

    res.send("AstroGuru AI Server Running 🌙");

});



// Signup API

app.post("/api/auth/signup", async(req,res)=>{


    try{


        const {
            name,
            email,
            password
        } = req.body;



        if(!name || !email || !password){

            return res.status(400).json({

                success:false,
                message:"All fields are required"

            });

        }



        const existUser = await User.findOne({email});


        if(existUser){

            return res.status(400).json({

                success:false,
                message:"Email already exists"

            });

        }



        const hashedPassword = await bcrypt.hash(
            password,
            10
        );



        const user = await User.create({

            name,
            email,
            password:hashedPassword

        });



        res.json({

            success:true,

            message:"Account created successfully",

            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }

        });



    }
    catch(error){


        console.log(error);


        res.status(500).json({

            success:false,

            message:"Signup error"

        });


    }


});





// Login API

app.post("/api/auth/login", async(req,res)=>{


    try{


        const {
            email,
            password
        } = req.body;



        const user = await User.findOne({email});



        if(!user){

            return res.status(400).json({

                success:false,

                message:"User not found"

            });

        }



        const match = await bcrypt.compare(

            password,

            user.password

        );



        if(!match){


            return res.status(400).json({

                success:false,

                message:"Invalid password"

            });


        }




        const token = jwt.sign(

            {
                id:user._id
            },

            process.env.JWT_SECRET || "astroguru_secret",

            {
                expiresIn:"7d"
            }

        );



        res.json({

            success:true,

            token,

            user:{

                name:user.name,

                email:user.email

            }

        });



    }
    catch(error){


        console.log(error);


        res.status(500).json({

            success:false,

            message:"Login error"

        });


    }


});





// AI Chat API

app.post("/api/chat", async(req,res)=>{


    try{


        const {

            question,
            name,
            birthDate,
            birthTime,
            birthPlace

        } = req.body;



        if(!question || !birthDate || !birthTime || !birthPlace){

            return res.status(400).json({

                success:false,

                message:"Complete birth details required"

            });

        }



        const prompt = `

You are AstroGuru AI 🌙

User Name:
${name}

Birth Date:
${birthDate}

Birth Time:
${birthTime}

Birth Place:
${birthPlace}


Question:
${question}


Give friendly astrology style guidance.

Include:
Career
Love and Relationship
Personal Advice

Do not give guaranteed predictions.
Mention AI-based guidance.

`;



        const response = await groq.chat.completions.create({


            model:"llama-3.1-8b-instant",


            messages:[

                {
                    role:"system",
                    content:"You are AstroGuru AI assistant."
                },

                {
                    role:"user",
                    content:prompt
                }

            ]


        });



        res.json({

            success:true,

            reply:
            response.choices[0].message.content

        });



    }
    catch(error){


        console.log("AI ERROR ❌",error);


        res.status(500).json({

            success:false,

            message:"AI response failed"

        });


    }


});





const PORT = process.env.PORT || 5000;


app.listen(PORT,()=>{

    console.log(
        `Server running on port ${PORT} 🚀`
    );

});