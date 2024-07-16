const express = require('express');
const app = express();
const port = 8080;
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const nodemailer = require("nodemailer");

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://haran2231:DhpURaYAbHtpzQ77@cluster0.lqsredr.mongodb.net/bulk_email?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { monitorCommands: true });

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

const users = [
    { username: 'admin', password: 'password' }
];

// Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const database = client.db();
        const collection = database.collection("passkeys");
    
        const user = await collection.findOne({ username: username, password: password });
        console.log(user);
    
        if (user) {
          res.json({
            success: true,
            message: "Login successful",
            receivedData: { username, password },
          });
        } else {
          res.status(401).json({
            success: false,
            message: "Invalid username or password",
          });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "An unexpected error occurred" });
    }
});

// Send email
app.post("/sendemail", async (req, res) => {
  var msg = req.body.msg
  var emailList = req.body.email

    console.log("Received /sendemail request:", req.body);

    if (!Array.isArray(emailList)) {
        return res.status(400).json({ message: "emailList should be an array" });
    }

    try {
        const database = client.db();
        const collection = database.collection("mail_passkeys");

        const credentials = await collection.findOne({ service: "gmail" });
        if (!credentials) {
            return res.status(500).json({ message: "Email credentials not found" });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: credentials.user,
                pass: credentials.password,
            },
        });

        for (const email of emailList) {
            await transporter.sendMail({
                from: credentials.user,
                to: email,
                subject: "Message from Hari",
                text: msg
            });
            console.log("Email sent to " + email);
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending email" });
    }
});

// Start the server
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});
