const fs = require('fs')

const discord = require('discord.js')
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
  //TODO This will just not fucking work, so, use the custom mock implementation that's already half baked
  const mockMessage = jest.createMockFromModule(discord.Message)
  battlecon.newbattle(mockMessage.channel.id)
})
