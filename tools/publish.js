console.log("The Eldest Daughter publisher ready");
const inquirer = require("inquirer");

inquirer
    .prompt([
        {
            type: "input",
            name: "title",
            message: "Titolo articolo:"
        },
        {
            type: "input",
            name: "category",
            message: "Categoria:"
        },
        {
            type: "input",
            name: "tags",
            message: "Tag (separati da virgola):"
        },
        {
            type: "input",
            name: "cover",
            message: "Nome copertina:"
        }
    ])
    .then(answers => {
        console.log("\nDati raccolti:");
        console.log(answers);
    });