const fun = require('../commands/discord/fun.js')

test('discord/fun:help output exists', () => {
  // All help should be a string from controllers
  expect(fun.coin('help')).toBeTruthy()
  expect(fun.pick('help')).toBeTruthy()
  expect(fun.roll('help')).toBeTruthy()
})

test('discord/fun:coin output and boundaries', () => {
  // Simple output and boundary checks
  expect(fun.coin()).toContain('flip')
  expect(fun.coin(9001)).toContain('paid')
  // Should report x heads and y tails
  expect(fun.coin(3)).toContain('heads')
  expect(fun.coin(3)).toContain('tails')
})

test('discord/fun:pick litmus tests', () => {
  expect(fun.pick('a,b,c')).toBeTruthy()
  expect(fun.pick('halo')).toContain('halo')
})

test('discord/fun:roll litmus tests', () => {
  expect(fun.roll('20')).toContain('die')
  // Handles negative positively
  expect(fun.roll('-20')).toContain(' 20-sided')
})
