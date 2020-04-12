const express = require("express");
const app = express();
const path = require("path");

app.use("/assets", express.static('public'));

app.get("/", function(req, res) {
    res.status(200).sendFile(path.join(__dirname, "index.html"));
});


app.listen(3000, function() {
    console.log("Example app listening on port 3000!");
  });