const dayjs = require('dayjs')
const digits = '0123456789'
const debug = msg => console.log(`dayjs helper: ${msg}`)
// For human-friendly "time to/from" display
dayjs.extend(require('dayjs/plugin/relativeTime'))
// For dayjs(date).tz('America/Seattle')
dayjs.extend(require('dayjs/plugin/utc'))
dayjs.extend(require('dayjs/plugin/timezone'))
// Set default to PST/PDT
const PST_TZ = "America/Los_Angeles"
dayjs.tz.setDefault(PST_TZ)

let parseTimespanToObject = function(timespan){
  let parsedSpan = { 
    'w': 0,
    'd': 0,
    'h': 0,
    'm': 0
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

exports.addTimespan = function(timespan, from = new dayjs()){
  let parsedSpanObj = parseTimespanToObject(timespan)
  // Rounding forward to the next hour, just for a clean deadline
  // Also order matters a lot with this, dont set smaller units first
  let result = new dayjs().millisecond(0).second(0)
                      .date(from.date() + parsedSpanObj['d'] + (parsedSpanObj['w']*7))
                      .hour(from.hour() + parsedSpanObj['h'] + 1)
                      .minute(0 + parsedSpanObj['m'])
                      .tz(PST_TZ)
  return result
}

exports.fmtAsPST = function(dayjsobj) {
  return dayjsobj.format('D MMM [at] HH:mm [PST]', { timeZone: PST_TZ })
}

exports.dayjs = dayjs