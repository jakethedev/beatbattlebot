const dao = require('../commands/battle/battlecachedao.js')
const con = require('../commands/battle/battlecontroller.js')

test('battle/battlecachedao:podiumsize operations', () => {
  // // Check some handy setters and getters
  expect(dao.getPodiumSize()).toBe(15)
  // dao.setPodiumSize(10)
  // expect(dao.getPodiumSize()).toBe(10)
})

test('battle/battlecachedao:TODO tests', () => {
})
