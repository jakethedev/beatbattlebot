// Note: Non of these methods are up to crypto-safe random standards. Don't use them for crypto ever.

// Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// Random number inclusive of both values, defaults to 1 -> inclusiveMax
function _randPosInt(inclusiveMax, min) {
  return Math.floor(Math.random() * (inclusiveMax - min + 1)) + min;
}

function _randArrIdx(array) {
  if (array) {
    return _randPosInt(array.length - 1, 0)
  } else {
    console.log('Requested array index from nonarray: ' + array + ' -- returning NaN')
    return NaN
  }
}

function _randomizedCopyOfArray(inputArray) {
  let array = inputArray.slice(0) //Quick clone
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

exports.randIntMinOne = function(inclusiveMax) {
  return _randPosInt(inclusiveMax, 1);
}

exports.randIntMinZero = function(inclusiveMax) {
  return _randPosInt(inclusiveMax, 0);
}

// Give back a random item (or set of items) from a list
exports.choice = function(array = [], numChoices = 1) {
  if (numChoices == 1) {
    let idx = _randArrIdx(array)
    return array[idx]
  } else if (numChoices > 1) {
    if (numChoices >= array.length - 1) return array;
    let result = []
    while (numChoices-- > 0) {
      let idx = _randArrIdx(array)
      result.push(array.splice(idx, 1)[0]) //Splice returns array
    }
    return result
  }
}

//https://stackoverflow.com/a/12646864/6794180 - No native shuffle functions. Bummer.
//Needed to smash up our data arrays for randomness
exports.getShuffledCopyOfArray = function(inputArray) {
  return _randomizedCopyOfArray(inputArray)
}

exports.getShuffledCopyOfObject = function(someJson) {
  let output = {}
  let randKeys = _randomizedCopyOfArray(Object.keys(someJson))
  for (let key of randKeys){
    output[key] = someJson[key]
  }
  return output
}
