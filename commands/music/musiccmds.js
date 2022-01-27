const musiclib = require('./musiclib')
const rand = require('../../util/random')

let debug = msg => console.log(`musiccmds: ${msg}`)

exports.transpose = function(input, msg) {
  return `this is still under construction, check back later`
}

exports.genrespin = function() {
  return `this is still under construction, check back later`
}

exports.moodspin = function() {
  let mood = rand.choice(musiclib['moods'])
  debug(`picked the mood ${mood}`)
  return `this is still under construction, check back later`
}

exports.melodyspin = function() {
  return `this is still under construction, check back later`
}

exports.chordspin = function() {
  return `this is still under construction, check back later`
}
