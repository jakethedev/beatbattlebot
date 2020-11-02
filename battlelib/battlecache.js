const fs = require('fs')

//TODO initialize code, read from _cacheFile if exists, put data in _entriesMap

//TODO This needs to work for multiple servers from the start

exports.default = {
  _cacheFile: 'battlecache.json',
  battleMap: {},
  addEntry: function(username, link, server){
    let entryExists = false // For smarter output
    if (!this.battleMap[server]){
      this.battleMap[server] = {}
    }
    if (this.battleMap[server][username]) {
      entryExists = true
    }
    this.battleMap[server][username] = link;
    //TODO use fs.writeSync method since we're already async
    if (entryExists){
      return `thanks for the update, saved your new entry!`
    } else {
      return `welcome to the battle! >:D`
    }
  },
  emptyCache: function(server){
    //TODO mv disk cache to cache.back
    if (this.battleMap[server]){
      this.battleMap[server] = {}
    }
    //TODO save modified battlemap to disk
  },
  getCacheForServer: function(server){
    if (!this.battleMap[server]){
      this.battleMap[server] = {}
    } 
    return this.battleMap[server]
  }
}
