const { User } = require('discord.js');
const rand = require('../randomUtil')
const debug = (msg) => console.log(`GIFTEX: ${msg}`)

let participants = {}

let runexchange = function(input, message, client) {
  if (message.guild) {
    let goblinsShuffled = false;
    let names = Object.keys(participants)
    let shuffledNames = rand.shuffleArray(names)
    let endIdx = names.length - 1
    while (!goblinsShuffled) {
      for (let i = 0; i <= endIdx; i++){
        if (names[i] == shuffledNames[i]){
          debug(`names matched for ${names[i]}, running again`)
          shuffledNames = rand.shuffleArray(names) 
          break
        }
        if (i == endIdx) {
          goblinsShuffled = true
        }
      }
    }
    for (let i = 0; i <= endIdx; i++){
      let [santa, goblin] = [names[i], shuffledNames[i]]
      console.log(`${santa} is gifting samples to `)
      let safeZipName = goblin.split(' ').join('').split('.').join('').split('_').join('') + ".zip"
      let messageToSend = `Your Sample Goblin is **${goblin}**!\n\nSENDING YOUR SAMPLES: \nWhen you finish your pack of 10+ quality samples, PLEASE NAME IT **'${safeZipName}'**. Upload it to google drive or dropbox, and send the link to **samplegoblin@gmail.com** - santos and jake run it, and will use that address to send samples anonymously to each goblin. \n\nFYI: ${goblin} won't get your pack until they send theirs in, because that's how we're getting emails :)`
      if (input == 'letsgo') {
        debug(`DMing ${santa} that they have ${goblin}...`) 
        new User(client, {id: participants[santa]}).send(messageToSend)
      } else if (santa == 'jakebelowmusic') {
        debug(`test dm to JBM`) 
        new User(client, {id: participants[santa]}).send(messageToSend)
      }
    }
    if (input == 'letsgo') {
      return `${names.length} goblins have been shuffled and DM'd to each other with details on how to do this\n\n@everyone ITS SAMPLE TIME!`
    } else {
      return `${names.length} goblins shuffled, test run complete`
    }
  } else {
    return `run this command on a server`
  }
}

exports.rollthegoblins = runexchange
exports.runexchange = runexchange

exports.joinexchange = function(input, message) {
  if (message.guild) {
    let {username, id} = message.author
    debug(`${username} has asked (id = ${id})`)
    if (! (username in participants)) {
      participants[username] = id
      debug(`${username} joined`)
      return `welcome to the gift exchange!`
    } else {
      return `you're already on the list :)`
    }
  } else {
    return `run this command on a server`
  }
}

exports.leaveexchange = function(input, message) {
  if (message.guild) {
    let {username, id} = message.author
    if (delete(participants[username])) {
      debug(`${username} has left`)
      return `you're out, hope to catch you next time!`
    } else {
      return `you were already out, but props for being thorough`
    }
  } else {
    return `run this command on a server`
  }
}

exports.exchangelist = function(input, message){
  if (message.guild){
    let userlist = Object.keys(participants).join('\n')
    return `all participants are:\n${userlist}`
  } else {
    return `run this command on a server`
  }
}

exports.resetexchange = function(input, message){
  if (message.guild){
    if (input == 'letsgo') {
      participants = {}
      return `current exchange wiped clean, let the gifting begin anew!`
    } else {
      return `are you sure? this will wipe out the current exchange data. run \`!resetexchange letsgo\` to confirm`
    }
  } else {
    return `run this command on a server`
  }
} 