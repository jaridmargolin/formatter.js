/*
 * test/fake-user/keys.js:
 *
 * (C) 2013 First Opinion
 * MIT LICENCE
 *
 */ 

module.exports = keys = {};


//
// Helper method to fix characters that cannot
// be store as a json key
//
var fixChar = function (char) {
  if (char == '"') {
    char = 'doublequote';
  } else if (char == "\\") {
    char = 'forwardslash';
  }
  return char;
};

//
// Method to get key press obj
//
keys.getPress = function (char) {
  return keys.press[fixChar(char)];
};

//
// Method to get key down obj
//
keys.getDown = function (char) {
  return keys.down[fixChar(char)];
};


// Press obj
keys.press = {
  "shift": { "code": 16, "shiftKey": true },
  "!": { "code": 33, "shiftKey": true },
  "doublequote": { "code": 34, "shiftKey": true },
  "#": { "code": 35, "shiftKey": true },
  "$": { "code": 36, "shiftKey": true },
  "%": { "code": 37, "shiftKey": true },
  "&": { "code": 38, "shiftKey": true },
  "'": { "code": 39, "shiftKey": false },
  "(": { "code": 40, "shiftKey": true },
  ")": { "code": 41, "shiftKey": true },
  "*": { "code": 42, "shiftKey": true },
  "+": { "code": 43, "shiftKey": true },
  ",": { "code": 44, "shiftKey": false },
  "-": { "code": 45, "shiftKey": false },
  ".": { "code": 46, "shiftKey": false },
  "/": { "code": 47, "shiftKey": false },
  "0": { "code": 48, "shiftKey": false },
  "1": { "code": 49, "shiftKey": false },
  "2": { "code": 50, "shiftKey": false },
  "3": { "code": 51, "shiftKey": false },
  "4": { "code": 52, "shiftKey": false },
  "5": { "code": 53, "shiftKey": false },
  "6": { "code": 54, "shiftKey": false },
  "7": { "code": 55, "shiftKey": false },
  "8": { "code": 56, "shiftKey": false },
  "9": { "code": 57, "shiftKey": false },
  ":": { "code": 58, "shiftKey": true },
  ";": { "code": 59, "shiftKey": false },
  "<": { "code": 60, "shiftKey": true },
  "=": { "code": 61, "shiftKey": false },
  ">": { "code": 62, "shiftKey": true },
  "?": { "code": 63, "shiftKey": true },
  "@": { "code": 64, "shiftKey": true },
  "A": { "code": 65, "shiftKey": true },
  "B": { "code": 66, "shiftKey": true },
  "C": { "code": 67, "shiftKey": true },
  "D": { "code": 68, "shiftKey": true },
  "E": { "code": 69, "shiftKey": true },
  "F": { "code": 70, "shiftKey": true },
  "G": { "code": 71, "shiftKey": true },
  "H": { "code": 72, "shiftKey": true },
  "I": { "code": 73, "shiftKey": true },
  "J": { "code": 74, "shiftKey": true },
  "K": { "code": 75, "shiftKey": true },
  "L": { "code": 76, "shiftKey": true },
  "M": { "code": 77, "shiftKey": true },
  "N": { "code": 78, "shiftKey": true },
  "O": { "code": 79, "shiftKey": true },
  "P": { "code": 80, "shiftKey": true },
  "Q": { "code": 81, "shiftKey": true },
  "R": { "code": 82, "shiftKey": true },
  "S": { "code": 83, "shiftKey": true },
  "T": { "code": 84, "shiftKey": true },
  "U": { "code": 85, "shiftKey": true },
  "V": { "code": 86, "shiftKey": true },
  "W": { "code": 87, "shiftKey": true },
  "X": { "code": 88, "shiftKey": true },
  "Y": { "code": 89, "shiftKey": true },
  "Z": { "code": 90, "shiftKey": true },
  "[": { "code": 91, "shiftKey": false },
  "forwardslash": { "code": 92, "shiftKey": false },
  "]": { "code": 93, "shiftKey": false },
  "^": { "code": 94, "shiftKey": true },
  "_": { "code": 95, "shiftKey": true },
  "`": { "code": 96, "shiftKey": false },
  "a": { "code": 97, "shiftKey": false },
  "b": { "code": 98, "shiftKey": false },
  "c": { "code": 99, "shiftKey": false },
  "d": { "code": 100, "shiftKey": false },
  "e": { "code": 101, "shiftKey": false },
  "f": { "code": 102, "shiftKey": false },
  "g": { "code": 103, "shiftKey": false },
  "h": { "code": 104, "shiftKey": false },
  "i": { "code": 105, "shiftKey": false },
  "j": { "code": 106, "shiftKey": false },
  "k": { "code": 107, "shiftKey": false },
  "l": { "code": 108, "shiftKey": false },
  "m": { "code": 109, "shiftKey": false },
  "n": { "code": 110, "shiftKey": false },
  "o": { "code": 111, "shiftKey": false },
  "p": { "code": 112, "shiftKey": false },
  "q": { "code": 113, "shiftKey": false },
  "r": { "code": 114, "shiftKey": false },
  "s": { "code": 115, "shiftKey": false },
  "t": { "code": 116, "shiftKey": false },
  "u": { "code": 117, "shiftKey": false },
  "v": { "code": 118, "shiftKey": false },
  "w": { "code": 119, "shiftKey": false },
  "x": { "code": 120, "shiftKey": false },
  "y": { "code": 121, "shiftKey": false },
  "z": { "code": 122, "shiftKey": false },
  "{": { "code": 123, "shiftKey": true },
  "|": { "code": 124, "shiftKey": true },
  "}": { "code": 125, "shiftKey": true },
  "~": { "code": 126, "shiftKey": true }
};

// Down obj
keys.down = {
  "backspace": { "code": 8, "shiftKey": false },
  "tab": { "code": 9, "shiftKey": false },
  "enter": { "code": 13, "shiftKey": false },
  "shift": { "code": 16, "shiftKey": false },
  "ctrl": { "code": 17, "shiftKey": false },
  "alt": { "code": 18, "shiftKey": false },
  "capslock": { "code": 20, "shiftKey": false },
  "escape": { "code": 27, "shiftKey": false },
  "leftarrow": { "code": 37, "shiftKey": false },
  "uparrow": { "code": 38, "shiftKey": false },
  "rightarrow": { "code": 39, "shiftKey": false },
  "downarrow": { "code": 40, "shiftKey": false },
  "0": { "code": 48, "shiftKey": false },
  "1": { "code": 49, "shiftKey": false },
  "2": { "code": 50, "shiftKey": false },
  "3": { "code": 51, "shiftKey": false },
  "4": { "code": 52, "shiftKey": false },
  "5": { "code": 53, "shiftKey": false },
  "6": { "code": 54, "shiftKey": false },
  "7": { "code": 55, "shiftKey": false },
  "8": { "code": 56, "shiftKey": false },
  "9": { "code": 57, "shiftKey": false },
  "a": { "code": 65, "shiftKey": false },
  "b": { "code": 66, "shiftKey": false },
  "c": { "code": 67, "shiftKey": false },
  "d": { "code": 68, "shiftKey": false },
  "e": { "code": 69, "shiftKey": false },
  "f": { "code": 70, "shiftKey": false },
  "g": { "code": 71, "shiftKey": false },
  "h": { "code": 72, "shiftKey": false },
  "i": { "code": 73, "shiftKey": false },
  "j": { "code": 74, "shiftKey": false },
  "k": { "code": 75, "shiftKey": false },
  "l": { "code": 76, "shiftKey": false },
  "m": { "code": 77, "shiftKey": false },
  "n": { "code": 78, "shiftKey": false },
  "o": { "code": 79, "shiftKey": false },
  "p": { "code": 80, "shiftKey": false },
  "q": { "code": 81, "shiftKey": false },
  "r": { "code": 82, "shiftKey": false },
  "s": { "code": 83, "shiftKey": false },
  "t": { "code": 84, "shiftKey": false },
  "u": { "code": 85, "shiftKey": false },
  "v": { "code": 86, "shiftKey": false },
  "w": { "code": 87, "shiftKey": false },
  "x": { "code": 88, "shiftKey": false },
  "y": { "code": 89, "shiftKey": false },
  "z": { "code": 90, "shiftKey": false },
  "A": { "code": 65, "shiftKey": false },
  "B": { "code": 66, "shiftKey": false },
  "C": { "code": 67, "shiftKey": false },
  "D": { "code": 68, "shiftKey": false },
  "E": { "code": 69, "shiftKey": false },
  "F": { "code": 70, "shiftKey": false },
  "G": { "code": 71, "shiftKey": false },
  "H": { "code": 72, "shiftKey": false },
  "I": { "code": 73, "shiftKey": false },
  "J": { "code": 74, "shiftKey": false },
  "K": { "code": 75, "shiftKey": false },
  "L": { "code": 76, "shiftKey": false },
  "M": { "code": 77, "shiftKey": false },
  "N": { "code": 78, "shiftKey": false },
  "O": { "code": 79, "shiftKey": false },
  "P": { "code": 80, "shiftKey": false },
  "Q": { "code": 81, "shiftKey": false },
  "R": { "code": 82, "shiftKey": false },
  "S": { "code": 83, "shiftKey": false },
  "T": { "code": 84, "shiftKey": false },
  "U": { "code": 85, "shiftKey": false },
  "V": { "code": 86, "shiftKey": false },
  "W": { "code": 87, "shiftKey": false },
  "X": { "code": 88, "shiftKey": false },
  "Y": { "code": 89, "shiftKey": false },
  "Z": { "code": 90, "shiftKey": false },
  "`": { "code": 192, "shiftKey": false },
  "~": { "code": 192, "shiftKey": true },
  "-": { "code": 189, "shiftKey": false },
  "_": { "code": 189, "shiftKey": true },
  "=": { "code": 187, "shiftKey": false },
  "+": { "code": 187, "shiftKey": true },
  "[": { "code": 219, "shiftKey": false },
  "{": { "code": 219, "shiftKey": true },
  "]": { "code": 221, "shiftKey": false },
  "}": { "code": 221, "shiftKey": true },
  "forwardslash": { "code": 220, "shiftKey": false },
  "|": { "code": 220, "shiftKey": true },
  ";": { "code": 186, "shiftKey": false },
  ":": { "code": 186, "shiftKey": true },
  "'": { "code": 222, "shiftKey": false },
  "doublequote": { "code": 222, "shiftKey": true },
  ",": { "code": 188, "shiftKey": false },
  "<": { "code": 188, "shiftKey": true },
  ".": { "code": 190, "shiftKey": false },
  ">": { "code": 190, "shiftKey": true },
  "/": { "code": 191, "shiftKey": false },
  "?": { "code": 191, "shiftKey": true }
};