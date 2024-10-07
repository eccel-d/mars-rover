const readline = require('readline-sync');

const directionsArray = ['N', 'W', 'S', 'E'];

let roversArray = [];

let xMaxValue;

let yMaxValue;

const {validateCoordinateValue, mainMenu} = require('./utils');

console.log('Welcome to the Mars Rover mission.');

console.log('Before we start, please set the plateau size.');

xMaxValue = validateCoordinateValue('What is the maximum value for the X axis? ');

yMaxValue = validateCoordinateValue('What is the maximum value for the Y axis? ');

console.log(`Max coordinates set to x = ${xMaxValue} and y = ${yMaxValue}`);

mainMenu(xMaxValue, yMaxValue, roversArray, directionsArray);