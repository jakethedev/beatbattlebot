const dao = require('../database/feedbackdao')

test('feedback/feedbackdao:basic operation tests', () => {
  let todo = 'these should respect the new data-or-false approach'
  expect(todo).toBeTruthy()
})
