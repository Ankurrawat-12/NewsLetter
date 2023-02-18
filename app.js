const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const client = require("@mailchimp/mailchimp_marketing");


// Api Key
const APIKEY = "4f6c78758e6570625debe8ce3af62bcd-us21";

// Audience Id
const audience_id = "07866c0ab0";


client.setConfig({
    apiKey: APIKEY,
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
        // mobileNumber: req.body.mobileNumber,
        email: req.body.email,
    };
    const run = async () => {
        try{
            const response = await client.lists.addListMember(audience_id, {
                email_address: suscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: suscribingUser.firstName,
                    LNAME: suscribingUser.lastName,
                    // PHONE: suscribingUser.mobileNumber
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

app.listen("3000", () => {
    console.log("Server Running at port 3000");
});
