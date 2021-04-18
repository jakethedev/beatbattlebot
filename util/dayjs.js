const dayjs = require('dayjs')
const debug = msg => console.log(`dayjs helper: ${msg}`)
// Handy magic values
const digits = '0123456789'
const PST_TZ = "America/Los_Angeles"
const EST_TZ = "America/New_York"
// For human-friendly "time to/from" display
dayjs.extend(require('dayjs/plugin/relativeTime'))
// For dayjs(date).tz('America/Seattle')
dayjs.extend(require('dayjs/plugin/utc'))
dayjs.extend(require('dayjs/plugin/timezone'))

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
  let now = new dayjs()
  // maintainers note: order matters, dont set smaller units first
  let parsedSpanObj = parseTimespanToObject(timespan)
  let daysAdded = from.date() + parsedSpanObj['d'] + (parsedSpanObj['w']*7)
  let hoursAdded = from.hour() + parsedSpanObj['h']
  let minutesAdded = parsedSpanObj['m']
  // If minutes specifed, they're relative to now
  // If no minutes, and the hour = now's hour, round forward 1 hour
  if (minutesAdded) { 
    minutesAdded += from.minute()
  } else if (hoursAdded == now.hour() && daysAdded < 1) {
    hoursAdded += 1 // Round forward to next hour
  }
  return new dayjs().millisecond(0).second(59)
                      .date(daysAdded)
                      .hour(hoursAdded)
                      .minute(minutesAdded)
}

exports.fmtAsPST = function(dayjsobj) {
  return dayjsobj.tz(PST_TZ).format('MMMM D [at] HH:mm [PST]')
}

exports.fmtAsUTC = function(dayjsobj) {
  return dayjsobj.utc().format('MMMM D [at] HH:mm [UTC]')
}

exports.dayjs = dayjs