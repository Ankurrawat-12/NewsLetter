const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
require('dotenv').config()
const client = require("@mailchimp/mailchimp_marketing")


client.setConfig({
    apiKey: process.env.APIKEY,
    server: "us21",
});


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const suscribingUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobileNumber: req.body.mobileNumber,
        address: req.body.address,
        email: req.body.email,
    };
    const run = async () => {
        try{
            const response = await client.lists.addListMember(process.env.AUDIENCE_ID, {
                email_address: suscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: suscribingUser.firstName,
                    LNAME: suscribingUser.lastName,
                    ADDRESS: suscribingUser.address,
                    PHONE: suscribingUser.mobileNumber
                }
            });
            res.sendFile(__dirname+ '/success.html');
            console.log(
                `Successfully Added contact as an audiance member. The contact's id is ${response.id}`
            );
        }
        catch(e){
            res.sendFile(__dirname + "/failure.html");
            console.log("=============ERROR=============");
            // console.log(JSON.parse(e.response.error.txt).detail);
        };
    }
    run();
});

app.post("/failure", (req, res) => {
    res.redirect('/')
})

app.listen("3000", () => {
    console.log("Server Running at port 3000");
});
