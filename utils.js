const readline = require('readline-sync');

const mainMenuText = `
What do you wish to do? Please input the corresponding option number:
1 - Deploy a new rover
2 - Delete a deployed rover
3 - Exit
> 
`;

function validateCoordinateValue(promptText) {
    let value;
    while (true) {
        value = readline.question(promptText);
        if (!isNaN(value) && Number.isInteger(parseFloat(value)) && value >= 0) {
            return Number(value); 
        } else {
            console.log("Invalid input. Please enter a positive integer.");
        }
    }
}


function mainMenu(xMaxValue, yMaxValue, roversArray, directionsArray) {    
    let option;
    while(true){    
        option = readline.question(mainMenuText);
        if (option > 0 && option <=5) {
            switch (option) {
                case '1':
                    deployRover(xMaxValue, yMaxValue, roversArray, directionsArray);
                    break;
                case '2':
                    deleteRover(roversArray);
                    break;
                case '3':
                    console.log('Exiting.');
                    return;
            }
        }   else {
            console.clear();
            console.log("Invalid option. Please try again.");
        }
    }
}


let nextRoverID = 1

class Rover {
    constructor(xPosition, yPosition, direction) {
        this.id = nextRoverID++;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.direction = direction.toUpperCase();
    }
    getId(){
        return this.id
    }
    getX() {
        return this.xPosition
    }
    getY() {
        return this.yPosition
    }
    getDirection() {
        return this.direction
    }
}


function validatePosition(x,y,xMaxValue,yMaxValue,roversArray) {
    if (x < 0 || x > xMaxValue || y < 0 || y > yMaxValue) {
        console.log('Sorry, out of bounds.');
        return false;
    }
    
    for (let rover of roversArray) {
        if (x == rover.xPosition && y == rover.yPosition) {
            console.log('Sorry, there is already a rover in that position');
            return false;
        }

    }
    
    return true;
}


function deployRover(xMaxValue, yMaxValue, roversArray, directionsArray) {
    let isValidPosition = false;
    let xPosition;
    let yPosition;
    console.log('Please define the landing position and direction for the new rover');
    while(!isValidPosition) {
        xPosition = validateCoordinateValue('Insert the landing X coordinate: ');
        yPosition = validateCoordinateValue('Insert the landing Y coordinate: ');
        isValidPosition = validatePosition(xPosition, yPosition, xMaxValue, yMaxValue, roversArray);
        if (!isValidPosition) {
            console.log('Please try again.');
        }
    }
    while(true){            
        let direction = readline.question('Direction the rover is facing: ');
        if (directionsArray.includes(direction.toUpperCase())) {
            let rover = new Rover(xPosition, yPosition, direction);
            roversArray.push(rover);
            console.log(`Rover successfully deployed at position ${xPosition}, ${yPosition} facing ${direction}`);
            let commands = readline.question('Enter movement commands for the rover (L, R, M): ');
            processCommands(rover, commands, xMaxValue, yMaxValue, roversArray, directionsArray);
            return            
        } else {
            console.log('Invalid input, please try again');
        }
    }
    
}
    

function processCommands(rover, commands, xMaxValue, yMaxValue, roversArray, directionsArray) {
    let commandArray = commands.split('');
    for (let command of commandArray) {
        if (command === 'M') {
            moveRover(rover, xMaxValue, yMaxValue, roversArray);
        } else if (command === 'L' || command === 'R') {
            rotateRover(rover, command, directionsArray);
        } else {
            console.log('Invalid command.');
        }
    }
    console.log(`The rover's final position is ${rover.getX()}, ${rover.getY()} facing ${rover.getDirection()}`);
}


function moveRover(rover, xMaxValue, yMaxValue, roversArray) {
    let { xPosition, yPosition, direction } = rover;
    let futureX = xPosition;
    let futureY = yPosition;

    switch (direction) {
        case 'N':
            futureY += 1;
            break;
        case 'S':
            futureY -= 1;
            break;
        case 'W':
            futureX -= 1;
            break;
        case 'E':
            futureX += 1;
            break;
    }

    if (validatePosition(futureX, futureY, xMaxValue, yMaxValue, roversArray)) {
        rover.xPosition = futureX;
        rover.yPosition = futureY;
        console.log(`The rover has moved to (${futureX}, ${futureY}).`);
    }
}


function rotateRover(rover, command, directionsArray) {
    let currentFacingPos = directionsArray.indexOf(rover.direction);

    if (command === 'L') {
        currentFacingPos = (currentFacingPos + 1) % directionsArray.length;
    } else if (command === 'R') {
        currentFacingPos = (currentFacingPos - 1 + directionsArray.length) % directionsArray.length;
    }

    rover.direction = directionsArray[currentFacingPos];
    console.log(`The rover is now facing ${rover.direction}.`);
}


function deleteRover(roversArray) {
    if (roversArray.length === 0) {
        console.log('No rovers available to delete.');
        return;
    }

    console.log('Deployed rovers:');
    roversArray.forEach(rover => {
        console.log(`ID: ${rover.id}, Position: (${rover.xPosition}, ${rover.yPosition}), Facing: ${rover.direction}`);
    });

    const roverIdToDelete = readline.questionInt('Enter the ID of the rover you want to delete: ');

    const roverIndex = roversArray.findIndex(rover => rover.id === roverIdToDelete);

    if (roverIndex === -1) {
        console.log(`No rover found with ID ${roverIdToDelete}.`);
    } else {
        roversArray.splice(roverIndex, 1);
        console.log(`Rover with ID ${roverIdToDelete} has been deleted.`);
    }
}


module.exports = {
    validateCoordinateValue,
    mainMenu
};