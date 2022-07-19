const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const nodemailer = require("nodemailer");


// mongodb=====
const ObjectId = require("mongodb").ObjectId;
const { MongoClient, ServerApiVersion } = require("mongodb");

// mongodb connection link
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vsobqhy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    // Information collections
    const database = client.db("TheAksAural");
    const userCollection = database.collection("userCollection");
    const contactCollection = database.collection("ContactUserCollection");
    const adminPostMobileCollection = database.collection("AdminPostMobileCollection");









    app.get('/users/:email',async (req,res)=>{
      const email=req.params.email;
      const query={email:email};
      const user=await userCollection.findOne(query)
      let isAdmin=false;
      if(user?.role==='admin'){
        isAdmin=true
      }
      res.json({admin:isAdmin})
    })

// user save database
app.post('/users',async(req,res)=>{
    const user=req.body;
    const result=await userCollection.insertOne(user);
    res.json(result)
})


// make admin'
app.put('/users/admin',async (req,res)=>{
  const user=req.body;
  const filter={email:user.email};
  const updateDoc={$set:{role:'admin'}}
  const result= await userCollection.updateOne(filter,updateDoc)
  res.json(result)


})



    // CONTACT MAIL HANDLE
    app.post("/send", async (req, res) => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "dracula_king@sonicompany.in",
          pass: process.env.PASSWORD,
        },
      });

      const mailOpctions = {
        from: `${req.body.email}`,
        to: "dracula_king@sonicompany.in",
        subject: `new message`,
        text: "<h2>Hello Everyone</h2>",
        html: `
                    <span>User Name: ${req.body.name}</span>
                    <h4> User  Email: ${req.body.email}</h4>
                    <h5>User Number: ${req.body.number}</h5>
                    <h5> User Comment:${req.body.comment}</h5>
                    `,
      };

      transporter.sendMail(mailOpctions, (error, info) => {
        if (error) {
          console.log("This is error: ", error);
          res.send("Error");
        } else {
          const newContact = req.body;
          const result = contactCollection.insertOne(newContact);
          res.send(result);
        }
      });
    });


    // hadle (admin) mobile post
app.post('/mobileDetailsPost',async(req,res)=>{
  const result=await adminPostMobileCollection.insertOne(req.body)
  console.log(req.body)
  res.json(result)
})


    // GET  posted data
    app.get('/mobileDetailsPost',async(req,res)=>{
      const result=await adminPostMobileCollection.find({}).toArray();
      res.send(result)
  })


// delete mobile shop collection

app.delete("/mobileDetailsPost/:id", async(req,res)=>{
  const id=req.params.id;
  console.log('deleting id:',id);
  res.json(1)
})




  } finally {
    // await client.close()
  }





















}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to Server.");
});

app.listen(port, () => {
  console.log("Wellcome!");
});
