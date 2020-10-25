const os = require('os')
require('../randomUtil')

exports.newbattle = function(input, msg, client) {
  // TODO name with input, or give neat codename
  return `NEW BATTLE TIME (wip)`
}

exports.submit = function(input, msg, client) {
  // TODO delete msg, if msg.attach print Not supported yet, try bribing jake else save link
  return `thanks for submitting`
}

exports.submissions = function(input, msg, client) {
  if (input === 'channel'){
    return `channel output`
  } else {
    return `dm output`
  }
}

exports.stopsubs = function(){
  return `submissions are CLOSED! (jk this is not )`
}

exports.battlevote = function(){
  return `here's a form with all entrants and emojis to vote on them with`
}
