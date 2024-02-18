const con = require('../commands/feedback/feedbackcontroller.js')
const djsmock = require('./util/mock-discordjs')
const mockmsg = (txt) => djsmock.mockMsg(txt)

test('feedback/feedbackcontroller:fb no input', () => {
  let m = mockmsg()
  expect(Promise.resolve(con.fb('', m))).toBeTruthy()
})

test('feedback/feedbackcontroller:fb open', () => {
  let m = mockmsg()
  expect(Promise.resolve(con.fb('open', m))).toBeTruthy()
})

test('feedback/feedbackcontroller:fb https://test', () => {
  let m = mockmsg()
  expect(Promise.resolve(con.fb('https://test', m))).toBeTruthy()
})

test('feedback/feedbackcontroller:fb https://test these are entry notes', () => {
  let m = mockmsg()
  expect(Promise.resolve(con.fb('https://test these are entry notes', m))).toBeTruthy()
})

test('feedback/feedbackcontroller:fb notes new entry notes', () => {
// TODO replicate this for jank input
  let m = mockmsg()
  expect(Promise.resolve(con.fb('notes new entry notes', m))).toBeTruthy()
})

test('feedback/feedbackcontroller:fb cooldown 7', () => {
  let m = mockmsg()
  expect(Promise.resolve(con.fb('cooldown 7', m))).toBeTruthy()
})

test('feedback/feedbackcontroller:fb start', () => {
  let m = mockmsg()
  expect(Promise.resolve(con.fb('https://starttest', m))).toBeTruthy()
  expect(Promise.resolve(con.fb('start', m))).toBeTruthy()
})

test('feedback/feedbackcontroller:fb start then done', () => {
  let m = mockmsg()
  expect(Promise.resolve(con.fb('https://startdone', m))).toBeTruthy()
  expect(Promise.resolve(con.fb('start', m))).toBeTruthy()
  expect(Promise.resolve(con.fb('done', m))).toBeTruthy()
})

test('feedback/feedbackcontroller:fb start then update expect updated', () => {
  let m = mockmsg()
  expect(Promise.resolve(con.fb('https://startupdate', m))).toBeTruthy()
  expect(Promise.resolve(con.fb('start', m))).toBeTruthy()
  expect(Promise.resolve(con.fb('https://THEUPDATE', m))).toBeTruthy()
  expect(Promise.resolve(con.fb('done', m))).toBeTruthy()
})

test('feedback/feedbackcontroller:fb start then done then update expects cooldown output', () => {
  let m = mockmsg()
  expect(Promise.resolve(con.fb('https://startcooldown', m))).toBeTruthy()
  expect(Promise.resolve(con.fb('start', m))).toBeTruthy()
  expect(Promise.resolve(con.fb('done', m))).toBeTruthy()
  expect(Promise.resolve(con.fb('https://expectcooldownerr', m))).toBeTruthy()
})

test('feedback/feedbackcontroller:fb submit then reset', () => {
  let m = mockmsg()
  expect(Promise.resolve(con.fb('https://reset', m))).toBeTruthy()
  expect(Promise.resolve(con.fb('reset', m))).toBeTruthy()
  expect(Promise.resolve(con.fb('reset letsgo', m))).toBeTruthy()
  //TODO verify empty
})
