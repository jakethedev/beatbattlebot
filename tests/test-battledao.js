const dao = require('../commands/battle/battledao.js')
const con = require('../commands/battle/battlecontroller.js')

test('battle/battledao:podiumsize operations', () => {
  // // Check some handy setters and getters
  expect(dao.getPodiumSize()).toBe(15)
  // dao.setPodiumSize(10)
  // expect(dao.getPodiumSize()).toBe(10)
})

test('battle/battledao:TODO tests', () => {
})
