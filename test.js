#!/usr/bin/env node

// Core bot setup
const rand = require('./util/random')
const fs = require('fs')
const { ops, meta } = require('./commands')
const log = (msg) => console.log(`>>>>> ${msg}`)

// Mock raw data for client, users, and messages
let { client, users, suite_keys, message_suites } = require('./test.json')

// Adjust this to suite: available options in test.json
const TEST_USER_KEY = 'admin'
let testuser = users[TEST_USER_KEY]

// TODO: let msgs; for each suite_keys: msg.append(message_text, author=users[suitekey];

let message_texts = message_suites[TEST_USER_KEY]

// Generating mock objects "similar" to discord.js API
let msgs = []
for (content of message_texts) {
  let msg_obj = {
    "content": content,
    "author": testuser
  }
  msgs[msgs.length] = msg_obj
}
log(`Testing with ${msgs.length} messages`)

for (let msg of msgs) {
  console.log(`>> Testing msg: ${msg.content}`)
  let parts = msg.content.trim().substring(1).split(/\s+/)
  let cmd = parts[0].toLowerCase()
  let input = parts[1] ? parts.slice(1).join(' ') : '' //Some cmds have no input, this lets us use if(input)
  if (cmd in ops) {
    let execTime = new Date(Date.now()).toLocaleString() + ': ';
    console.log(execTime + 'running battlelib.' + cmd + '(' + input + ') for ' + msg.author.username)
    Promise.resolve( ops[cmd](input, msg, client) )
      .then(function(result) {
        console.log(result)
      })
      .catch(function(err) {
        console.log(`your command met with a terrible fate and I nearly died. Have an admin check the logs plz`)
        console.log(`ERR: ${err}`)
      })
  } else if (cmd == 'help') {
    console.log("This is a test suite you doofus")
  } else {
    console.log(`ERR: can't find operation ${cmd} for input (${input})`)
  }
}

/////////////////
// Helper Funcs
/////////////////

function mockDiscordMessage(text, author, channel) {
  return {
    "content": text,
    "author": author,
    "channel": channel
  }
}

function mockDiscordUser(rawUserObj) {
  let {name, id, admin, roles} = rawUserObj
  return {}
}
