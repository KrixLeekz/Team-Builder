const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employees = []

const managerQs = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "managerName",
            message: "What is the name of the manager?",
        },
        {
            type: "input",
            name: "managerID",
            message: "What is the manager ID?",
        },
        {
            type: "input",
            name: "managerEmail",
            message: "What is the manager email?",
        },
        {
            type: "input",
            name: "officeNumber",
            message: "What is the office number?",
        }]).then(answers => {
            manager = new Manager(answers.managerName, answers.managerID, answers.managerEmail, answers.officeNumber);
            employees.push(manager)
            lowerEmployeeQs();
        });
}

const lowerEmployeeQs = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "role",
            message: "What is the role of the new employee?",
            choices: ["Engineer", "Intern"]
        },
        {
            type: "input",
            name: "employeeName",
            message: "What is the name of the employee?",
        },
        {
            type: "input",
            name: "employeeID",
            message: "What is the employee ID?",
        },
        {
            type: "input",
            name: "employeeEmail",
            message: "What is the employee email?",
        },
        {
            when: (input) => input.role === "Engineer",
            type: "input",
            name: "github",
            message: "What is the employee's github?"
        },
        {
            when: (input) => input.role === "Intern",
            type: "input",
            name: "school",
            message: "What is the school of the intern?"
        },
        {
            type: "confirm",
            name: "anotherEmployee",
            message: "Would you like to add any more employees?"
        }
    ]).then (answers => {
        if (answers.role === "Intern") {
            const intern = new Intern(answers.employeeName, answers.employeeId, answers.employeeEmail, answers.school)
            employees.push(intern)
        } else if (answers.role === "Engineer") {
            const engineer = new Engineer(answers.employeeName, answers.employeeId, answers.employeeEmail, answers.github)
            employees.push(engineer)
        }
        if (answers.anotherEmployee === true) {
            lowerEmployeeQs()
        } else {
            fs.writeFileSync('./templates/main.html', render(employees))
        }
    })
}



managerQs()