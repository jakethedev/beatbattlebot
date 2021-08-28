const fun = require('../../commands/discordlib/fun.js')

test('discordlib/fun:help output', () => {
  // All help should be a string, primal litmus tests
  expect(fun.coin("help")).toBeTruthy()
  expect(fun.pick("help")).toBeTruthy()
  expect(fun.roll("help")).toBeTruthy()
})

test('discordlib/fun:coin tests', () => {
  // Simple output checks
  expect(fun.coin()).toContain('flip')
  expect(fun.coin(9001)).toContain('paid')
  // Should report x heads and y tails
  expect(fun.coin(3)).toContain('heads')
  expect(fun.coin(3)).toContain('tails')
})

test('discordlib/fun:pick tests', () => {
  expect(fun.pick("a,b,c")).toBeTruthy()
})

test('discordlib/fun:roll tests', () => {
  expect(fun.roll("20")).toContain("die")
  // Handles negative positively
  expect(fun.roll("-20")).toContain(" 20-sided")
})
