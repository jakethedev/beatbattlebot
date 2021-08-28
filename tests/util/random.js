const rand = require('../../util/random')

test('randomizer edge cases', () => {
  expect(rand.randIntMinOne(1)).toBeGreaterThan(0)
})
