const fs = require('fs')

const rand = require('./util/random')
const battlecon = require('../commands/battlelib/battlecontroller')

const TEST_USER_KEY = 'admin'
const TEST_CHANNEL_ID = 'test-channel-ID'

// Mock raw data for client, users, and messages
let { client, users, suite_keys, message_suites } = require('./mockdata.json')

test('test data loading and validation should be standard practice', () => {
  expect(users).toHaveProperty(TEST_USER_KEY)
  let testuser = users[TEST_USER_KEY]
})

test('new battle from nothing', () => {
  expect(battlecon.newbattle("help")).toBeTruthy()
  const mockMessage = jest.createMockFromModule('node_modules/discord.js/src/structure/Message.js')
  battlecon.newbattle(mockMessage.channel.id)
  expect(true).toBeTruth()
})
