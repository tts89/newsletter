const express= require("express");
const parser= require("body-parser");
const request= require("request");
const app = express();
const apiSecret = require(__dirname+"/secret");

app.use(parser.urlencoded({extended:true}));
app.use(express.static("public"));

app.listen(process.env.PORT || 3000,function () {
    console.log("Server is Listening");
});

app.get("/",function (req,res) {
    res.sendFile(__dirname+"/signup.html")
});

app.post("/",function (req,res) {
    var fname= req.body.fName;
    var lname= req.body.lName;
    var email= req.body.email;
    console.log(fname,lname,email);

    var server= apiSecret.server;
    var apiKey= apiSecret.apiKey;
    var listId= apiSecret.listId;

    var data= {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ],
        update_existing: false
    };
    // console.log(data);

    var options= {
        url: `https://${server}.api.mailchimp.com/3.0/lists/${listId}`,
        method: "post",
        qs: {
            skip_merge_validation: 0,
            skip_duplicate_check: 0
        },
        headers: {
            "Authorization": `spt ${apiKey}`
        },
        body: JSON.stringify(data)
    };
    // console.log(options);

    request(options,function (error,respose,body) {
        if(error) {
            console.log(error);
            res.sendFile(__dirname+"/failure.html");
        }else {
            if(respose.statusCode!=200) res.sendFile(__dirname+"/failure.html");
            else res.sendFile(__dirname+"/success.html");
            console.log(`respnse: ${respose.statusCode}`);
        }
    });
});

app.post("/failure",function (req,res) {
    res.redirect("/");
});