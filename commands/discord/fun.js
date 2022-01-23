const rand = require('../../util/random')

//For those tricky decisions
exports.coin = function(input = 1) {
  if (`${input}`.toLowerCase() == 'help') {
    return `\`!coin [number]\` will flip one (or \`number\` of) coins`
  }
  if (isNaN(input) || input <= 1) {
    return 'the flip landed on ' + ['heads!', 'tails!'][rand.randIntMinZero(1)]
  } else if (input > 1024) {
    return `I don't get paid enough for that, try less coins`
  } else {
    let flipsDone = 0
    let results = [0, 0] //Same indexing as the faces array
    input = Math.min(input, 10000)
    while (flipsDone++ < input) {
      results[rand.randIntMinZero(1)]++
    }
    return `we flipped a total of ${results[0]} heads and ${results[1]} tails`
  }
}

exports.pick = function(input) {
  if (`${input}`.toLowerCase() == 'help') {
    return `\`!pick thing1, thing2[, thing3...]\` will split the options by comma and pick a random one for you`
  }
  let inputArray = input.split(',')
  let choice = rand.choice(inputArray)
  let quip = rand.choice([
    'the universe has spoken, and it said',
    'a winner is',
    'well hey, this one looks good',
    'lets go with',
    'hmm... I think I like',
    'well if you have to ask, I\'d have to say',
    'a wise man once said "don\'t overthink sh\*t", so go with'
  ])
  return `${quip}: **${choice}**`
}

exports.roll = function(input) {
  if (!input || isNaN(input))
    input = 100
  input = Math.abs(parseInt(input))
  return `on a ${input}-sided die, you rolled a ${rand.randIntMinOne(input)}`
}
exports.r = exports.roll