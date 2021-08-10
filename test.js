#!/usr/bin/env node

// Core bot setup
const rand = require('./util/random')
const fs = require('fs')
const { ops, meta } = require('./commands')

// Set up commands
console.dir(ops)

// Mock client and messages: todo load from file
let { client , msgs } = require('./test.json')

for (let msg of msgs) {
  console.log(msg)
  let parts = msg.content.toLowerCase().split(/\s+/)
  let cmd = parts[0]
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
