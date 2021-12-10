const fs = require('fs')
const day = require('../../util/dayjs')
const _cacheFile = 'serverdao.json'
const log = msg => console.log(`serverdao: ${msg}`)

let serverData = {}

// Load old server data on import
try {
  serverData = JSON.parse(fs.readFileSync(_cacheFile))
} catch (error) {
  log(`if ENOENT this is totally ok - could not load JSON from old cache: ${error}`)
}

// Simple persistence layer
function _saveServerData(){
  try {
    fs.writeFileSync(_cacheFile, JSON.stringify(serverData, null, 2))
  } catch(error) {
    log(`error saving server data: ${error}`)
  }
}

