var inquirer = require("inquirer");
const fs = require('fs');
let converter = require('json-2-csv');

var data = require("./experimental.json")
const CSVToJSON = require('csvtojson');

const nssmCof = 1.36
const nsmlCof = 1.48


let uarray = []

function popArray() {
    data.forEach(elem => {
        uarray.push(elem)
    })

}

popArray()

if (data.length !== 0) {
    runPrompt()
} else {
    runCompile()
}

function runCompile() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What do you want to do?",
        choices: [
          "Compile and Convert to JSON",
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "Compile and Convert to JSON":
            convertJson();
            break;
        }
      });
  }



function runPrompt() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What do you want to do?",
        choices: [
          "Recompile",
          "Update Fill SKU And Compile to CSV",
          "Update Weight And Compile to CSV",
          "Update Category And Compile to CSV",
          "Update Name And Compile to CSV",
          "Update All",
          "Compile to CSV",
        
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "Recompile":
            convertJson();
            break;
        case "Update Fill SKU And Compile to CSV":
            fillSku();
            break;
        case "Update Weight And Compile to CSV":
            weight();
            break;
        case "Update Category And Compile to CSV":
            cat();
            cat2();
            break;
        case "Update Name And Compile to CSV":
            name();
            break;
        case "Update All":
            name();
            fillSku();
            weight();
            cat();
            cat2();
            break;
        case "Compile to CSV":
            convertCsv();
            break;
        }
      });
  }


function fillSku() {


    uarray.forEach(elem => {
     
        if (elem.FillSku.toString().charAt(1) != "-") {
        let name = elem.Name
        const packSize = parseInt(elem.SKU)
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
       
    })
    runPrompt()
}

function cat() {

    uarray.forEach(elem => {
     
            let cat = elem.SKU.substr(0,elem.SKU.indexOf('-')).replace(/[0-9]/g, '') + "'s"
            catLower = cat.toLowerCase()
            catFormatted = catLower.charAt(0).toUpperCase() + catLower.slice(1);
            console.log(catFormatted)
            elem.Catergory = catFormatted
          
        }
        
    )
    runPrompt()
    }

function cat2() {
        uarray.forEach(elem => {
         
                let name = elem.SKU.substr(elem.SKU.indexOf("-", elem.SKU.indexOf("-")) )
                let name1 = name.substr(1)
                let name2 = name1.substr(0,name1.indexOf("-") )
                console.log(name2)
                if (name2 === "NOSHOW") {
                    category2Formatted = "No Show"
                }
                if (name2 === "CREWCUT") {
                    category2Formatted = "Crew Cut"
                }
                 if (name2 === "LOWCUT") {
                    category2Formatted = "Low Cut"
                }
                if (name2 === "PACAS") {
                    category2Formatted = "Pacas"
                }
                elem.Catergory_2 = category2Formatted
                
            }
            
        )
        runPrompt()
}


function weight() {


    uarray.forEach(elem => {
        
        
            let size = elem.SKU.substr(elem.SKU.length - 3)
            if (size === "M/L") {
                weight = parseInt(elem.SKU) * nsmlCof
            } else {
                weight = parseInt(elem.SKU) * nssmCof
            }

            elem.Weight = weight
            
            
        }
        
    )
    runPrompt()
}
function name() {


    uarray.forEach(elem => {

        const packSize = parseInt(elem.SKU)
        let cat = elem.SKU.substr(0,elem.SKU.indexOf('-')).replace(/[0-9]/g, '') + "'s"
        catLower = cat.toLowerCase()
        catFormatted = catLower.charAt(0).toUpperCase() + catLower.slice(1);
        let cat2_1 = elem.SKU.substr(elem.SKU.indexOf("-", elem.SKU.indexOf("-")) )
        let cat2_2 = cat2_1.substr(1)
        let cat2_3 = cat2_2.substr(0,cat2_2.indexOf("-") )
      
        if (cat2_3 === "NOSHOW") {
            category2Formatted = "No Show"
        }
        if (cat2_3 === "CREWCUT") {
            category2Formatted = "Crew Cut"
        }
         if (cat2_3 === "LOWCUT") {
            category2Formatted = "Low Cut"
        }
        if (cat2_3 === "PACAS") {
            category2Formatted = "Pacas"
        }
        console.log(cat2_3)

        let size = elem.SKU.substr(elem.SKU.length - 3)
                    if (size === "M/L" && cat === "WOMEN") {
                        size1 = "Medium / Large (US: 8.5 - 11.5+)"
                    } 
                    if (size === "S/M" && cat === "WOMEN's") {
                        size1 = "Small / Medium (US: 5 - 8)"
                    }
                    if (size === "M/L" && cat === "MEN's") {
                        size1 = "Medium / Large (US: 7 - 11)"
                    }
                    if ( cat === "TODDLER's") {
                        size1 = "One Size Fits All (Ages 1 - 5)"
                    }
                    if ( cat === "KID's") {
                        size1 = "One Size Fits All (Ages 5 - 11)"
                    }
        let test1 = elem.SKU.substr(elem.SKU.indexOf("-", elem.SKU.indexOf("-") + 1) )
        //****IMPORTANT this code will not work with L/XL due to char dif
        let colors = test1.substr(1, test1.length - 5) 
        //***** 
        var separators = [ '-', '/', '&', ['A-Z']];
        var colorsFormatted = colors.replace(new RegExp('\\' + separators.join('|\\'), 'g'), ' $& ')
        //REGEX for leading space on caps not useable atm because of SKU diffs
        // newValue = colorsFormatted.replace(/([A-Z])/g, ' $1')
        // console.log(newValue)
      
        
        let name = packSize + " Pack - " + catFormatted + " " + category2Formatted + " Socks - " + size1 + " / " + colorsFormatted
            elem.Name = name
            
            
    }
        
    )
    runPrompt()
}

function convertCsv() {
    let json2csvCallback = function (err, csv) {
        if (err) throw err;
    
        fs.writeFileSync('experimentalUpdated.csv', csv);
    };

    converter.json2csv(uarray, json2csvCallback);
    console.log("##### Success output at experimental.csv I don't know why this logs 4 times... shrug emoji #####")
}

function convertJson() {
    CSVToJSON().fromFile('experimental.csv')
    .then((jsonObj)=>{
        let data = JSON.stringify(jsonObj);
        fs.writeFileSync('experimental.json', data);
        console.log("##### Successfully compiled and converted #####")
    })
        .catch(err => {
            console.log(err);
        });
}