const con = require('../commands/feedback/feedbackcontroller.js')
const djsmock = require('./util/mock-discordjs')
const mockmsg = (txt) => djsmock.mockMsg(txt)

test('feedback/feedbackcontroller:fb no input', () => {
  let m = mockmsg('')
  console.log(Promise.resolve(con.fb('', m)))
})

test('feedback/feedbackcontroller:fb open', () => {
  let m = mockmsg('')
  console.log(Promise.resolve(con.fb('open', m)))
})

test('feedback/feedbackcontroller:fb https://test', () => {
  let m = mockmsg('')
  console.log(Promise.resolve(con.fb('https://test', m)))
})

test('feedback/feedbackcontroller:fb https://test these are entry notes', () => {
  let m = mockmsg('')
  console.log(Promise.resolve(con.fb('https://test these are entry notes', m)))
})

test('feedback/feedbackcontroller:fb notes new entry notes', () => {
// TODO replicate this for jank input
  let m = mockmsg('')
  console.log(Promise.resolve(con.fb('notes new entry notes', m)))
})

test('feedback/feedbackcontroller:fb cooldown 7', () => {
  let m = mockmsg('')
  console.log(Promise.resolve(con.fb('cooldown 7', m)))
})

test('feedback/feedbackcontroller:fb start', () => {
  let m = mockmsg('')
  console.log(Promise.resolve(con.fb('https://starttest', m)))
  console.log(Promise.resolve(con.fb('start', m)))
})

test('feedback/feedbackcontroller:fb start then done', () => {
  let m = mockmsg('')
  console.log(Promise.resolve(con.fb('https://startdone', m)))
  console.log(Promise.resolve(con.fb('start', m)))
  console.log(Promise.resolve(con.fb('done', m)))
})

test('feedback/feedbackcontroller:fb start then update expect updated', () => {
  let m = mockmsg('')
  console.log(Promise.resolve(con.fb('https://startupdate', m)))
  console.log(Promise.resolve(con.fb('start', m)))
  console.log(Promise.resolve(con.fb('https://THEUPDATE', m)))
  console.log(Promise.resolve(con.fb('done', m)))
})

test('feedback/feedbackcontroller:fb start then done then update expects cooldown output', () => {
  let m = mockmsg('')
  console.log(Promise.resolve(con.fb('https://startcooldown', m)))
  console.log(Promise.resolve(con.fb('start', m)))
  console.log(Promise.resolve(con.fb('done', m)))
  console.log(Promise.resolve(con.fb('https://expectcooldownerr', m)))
})

test('feedback/feedbackcontroller:fb submit then reset', () => {
  let m = mockmsg('')
  console.log(Promise.resolve(con.fb('https://reset', m)))
  console.log(Promise.resolve(con.fb('reset', m)))
  console.log(Promise.resolve(con.fb('reset letsgo', m)))
  //TODO verify empty
})

