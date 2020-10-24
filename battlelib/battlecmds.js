const os = require('os')
require('../randomUtil')

exports.newbattle = function(input) {
  return `got feedback, ideas, or bugs? Awesome! Let me know on github at ${process.env.npm_package_bugs_url}`
}

exports.submit = function(input) {
  return `got feedback, ideas, or bugs? Awesome! Let me know on github at ${process.env.npm_package_bugs_url}`
}

exports.submissions = function(input) {
  if (input === 'channel'){
    return `got feedback, ideas, or bugs? Awesome! Let me know on github at ${process.env.npm_package_bugs_url}`
  } else {
    return `got feedback, ideas, or bugs? Awesome! Let me know on github at ${process.env.npm_package_bugs_url}`
  }
}

exports.newbattle = function(input) {
  return `got feedback, ideas, or bugs? Awesome! Let me know on github at ${process.env.npm_package_bugs_url}`
}
