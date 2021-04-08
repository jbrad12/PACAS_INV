
var inquirer = require("inquirer");
const fs = require('fs');
let converter = require('json-2-csv');

var test = require("./updatedjson.json")
const CSVToJSON = require('csvtojson');





runPrompt()

function runPrompt() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What do you want to do?",
        choices: [
          "Compile and Convert to JSON",
          "Update And Compile to CSV"
       
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "Compile and Convert to JSON":
          convertJson();
          break;
        case "Update And Compile to CSV":
          run();
          break;
  
       
        }
      });
  }





  function run() {
    let uarray = []

    test.forEach(elem => {
     
        if (elem.FillSku.toString().charAt(1) != "-") {
        let name = elem.Name
        const packSize = parseInt(elem.Name.substr(0,elem.Name.indexOf(' ')))
        const packQuant = elem.FillSku.toString().split(",").length
        let leadNum = packSize / packQuant;
        
    
    var item = elem.FillSku.toString().split(",").map(item => {
        return item.trim();
      });
    let fsku1 = item.map(item => {
        return (leadNum + "-" + item)
    })
   elem.FillSku = fsku1.join(", ")
     disp = name + " FILLSKU: " + fsku1
 
     
    
  
        }
        uarray.push(elem)
})



let json2csvCallback = function (err, csv) {
    if (err) throw err;
  
    fs.writeFileSync('csv.csv', csv);
};

converter.json2csv(uarray, json2csvCallback);
console.log("##### Success output at csv.csv #####")


}

function convertJson() {
    CSVToJSON().fromFile('pacas.csv')
    .then((jsonObj)=>{
        let data = JSON.stringify(jsonObj);
        fs.writeFileSync('updatedjson2.json', data);
        console.log("##### Successfully compiled and converted #####")
        runPrompt()
    })
        .catch(err => {
            // log error if any
            console.log(err);
        });
}