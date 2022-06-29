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
    const contactCollection = database.collection("ContactUserCollection");

    // CONTACT MAIL HANDLE
    app.post("/send", async (req, res) => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "theskyauralhelp@gmail.com",
          pass: process.env.PASSWORD,
        },
      });

      const mailOpctions = {
        from: "theskyauralhelp@gmail.com",
        to: req.body.email,
        subject: `Message From`,
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
