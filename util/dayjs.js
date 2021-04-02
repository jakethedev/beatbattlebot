const dayjs = require('dayjs')
const digits = '0123456789'
dayjs.extend(require('dayjs/plugin/relativeTime'))

exports.parseTimespanToObject = function(timespan){
  let parsedSpan = {
    'w': 0,
    'd': 0,
    'h': 0
  }
  for (let i = 0, buffer = 0; i < timespan.length; i++){
    if (digits.includes(timespan[i])){
      buffer *= 10
      buffer += parseInt(timespan[i])
    } else {
      if (Object.keys(parsedSpan).includes(timespan[i])) {
        parsedSpan[timespan[i]] = buffer
      }
      buffer = 0
    }
  }
  return parsedSpan
}

exports.roundToNextHour = function(timespan, from = new dayjs()){
  let parsedSpanObj = parseTimespanToObject(timespan)
  let roundedDate = new dayjs(from)
  roundedDate.millisecond(0)
  roundedDate.second(0)
  roundedDate.minute(0)
  // Rounding forward to the next hour, just for a clean deadline
  roundedDate.hour(from.hour() + parsedSpanObj['h'] + 1)
  roundedDate.day(from.day() + parsedSpanObj['d'] + (parsedSpanObj['w']*7))
  return roundedDate
}

exports.dayjs = dayjs