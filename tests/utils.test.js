const { validateCoordinateValue, validatePosition, deployRover, processCommands } = require('../src/utils');

const readline = require('readline-sync');

jest.mock('readline-sync', () => {
  return {
    question: jest.fn(),
  };
});

console.log = jest.fn();

describe('Mars Rover Functions', () => {

  test('validateCoordinateValue should return a valid positive integer', () => {
    readline.question.mockReturnValueOnce ('5');
    expect(validateCoordinateValue('Input: ')).toBe(5);
  });

  test('validateCoordinateValue should reject non-numeric input', () => {
    readline.question.mockReturnValueOnce ('any string value'); //invalid input
    readline.question.mockReturnValueOnce ('5'); // correct on second try
    expect(validateCoordinateValue('Input: ')).toBe(5);
  });

  test('validatePosition should return false for out-of-bounds coordinates', () => {
    const roversArray = [];
    expect(validatePosition(6, 6, 5, 5, roversArray)).toBe(false);
  });

  test('validatePosition should return false if a rover is already at the same position', () => {
    const roversArray = [{ id: 1, xPosition: 3, yPosition: 3, direction: 'N' }];
    expect(validatePosition(3, 3, 5, 5, roversArray)).toBe(false);
  });

  test('validatePosition should return true for valid coordinates', () => {
    const roversArray = [{ id: 1, xPosition: 3, yPosition: 3, direction: 'N' }];
    expect(validatePosition(2, 2, 5, 5, roversArray)).toBe(true);
  });

  test('deployRover should successfully deploy a rover', () => {
    readline.question.mockReturnValueOnce ('1');
    readline.question.mockReturnValueOnce ('1');
    readline.question.mockReturnValueOnce ('Z'); //invalid direction
    readline.question.mockReturnValueOnce ('N'); //correct direction on second try
    readline.question.mockReturnValueOnce ('MRMLL');
    const roversArray = [];
    deployRover(5, 5, roversArray, ['N', 'W', 'S', 'E']);
    expect(roversArray.length).toBe(1);
    expect(roversArray[0].xPosition).toBe(2);
    expect(roversArray[0].yPosition).toBe(2);
    expect(roversArray[0].direction).toBe('W');
  });

});
