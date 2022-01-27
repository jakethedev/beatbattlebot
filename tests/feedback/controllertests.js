const con = require('../../commands/feedback/feedbackcontroller.js')

test('feedback/feedbackcontroller:fb no input', () => {
  console.log(Promise.resolve(con.fb()))
})

test('feedback/feedbackcontroller:fb open', () => {
  console.log(Promise.resolve(con.fb('open')))
})

test('feedback/feedbackcontroller:fb https://test', () => {
  console.log(Promise.resolve(con.fb('https://test')))
})

test('feedback/feedbackcontroller:fb https://test these are entry notes', () => {
  console.log(Promise.resolve(con.fb('https://test these are entry notes')))
})

test('feedback/feedbackcontroller:fb notes new entry notes', () => {
// TODO replicate this for jank input
  console.log(Promise.resolve(con.fb('notes new entry notes')))
})

test('feedback/feedbackcontroller:fb cooldown 7', () => {
  console.log(Promise.resolve(con.fb('cooldown 7')))
})

test('feedback/feedbackcontroller:fb start', () => {
  console.log(Promise.resolve(con.fb('https://starttest')))
  console.log(Promise.resolve(con.fb('start')))
})

test('feedback/feedbackcontroller:fb start then done', () => {
  console.log(Promise.resolve(con.fb('https://startdone')))
  console.log(Promise.resolve(con.fb('start')))
  console.log(Promise.resolve(con.fb('done')))
})

test('feedback/feedbackcontroller:fb start then update expect updated', () => {
  console.log(Promise.resolve(con.fb('https://startupdate')))
  console.log(Promise.resolve(con.fb('start')))
  console.log(Promise.resolve(con.fb('https://THEUPDATE')))
  console.log(Promise.resolve(con.fb('done')))
})

test('feedback/feedbackcontroller:fb start then done then update expects cooldown output', () => {
  console.log(Promise.resolve(con.fb('https://startcooldown')))
  console.log(Promise.resolve(con.fb('start')))
  console.log(Promise.resolve(con.fb('done')))
  console.log(Promise.resolve(con.fb('https://expectcooldownerr')))
})

test('feedback/feedbackcontroller:fb submit then reset', () => {
  console.log(Promise.resolve(con.fb('https://reset')))
  console.log(Promise.resolve(con.fb('reset')))
  console.log(Promise.resolve(con.fb('reset letsgo')))
  //TODO verify empty
})

