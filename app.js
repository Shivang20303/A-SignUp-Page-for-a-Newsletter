//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

//This to send the css and images from the computer to the server
app.use(express.static(__dirname));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/",function(req,res)
{
  //start: This is to add members to the newletter inside the mailchimp account
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    const data = {
        members: [
            {
            email_address: email,
            status: "subscribed",
            merge_fields : {
                FNAME:firstName,
                LNAME:lastName
            }
        }
        ]
    }

    //end
    const jsonData = JSON.stringify(data);
    //url is the the website of the members list where the data would be saved 
    const url = "https://us14.api.mailchimp.com/3.0/lists/911a41cd06/";

    //relevant info regarding checking is successful/failure
    const options = {
        method: "POST",
        auth:"shivang:f942a2edcef2bc4ee3d06c1c0fab869b-us14"
    }

    //post information depending if the subscription of the user has been successful or unsuccessful
    const request = https.request(url, options, function(response){
      //checking if response i.e. statusCode is giving success/failure
      if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
      }
      else{
        res.sendFile(__dirname + "/failure.html");
      }
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure.html",function(req,res){
  res.redirect("/");
});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});

//API Key - f942a2edcef2bc4ee3d06c1c0fab869b-us14
//List ID - 911a41cd06
