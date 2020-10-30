const fs = require('fs')

//TODO initialize code, read from _cacheFile if exists, put data in _entriesMap

//TODO This needs to work for multiple servers from the start

exports.default = {
  _cacheFile: 'battlecache.json',
  entryMap: {},
  addEntry: function(username, link, server){
    this.entryMap[username] = link;
    //TODO require(fs), use writeSync method since we're already async
  },
  emptyCache: function(server){
    //TODO close file if necessary
    //TODO mv disk cache to cache.back
    this.entryMap = {}
    //TODO save NEW empty to disk
  }
}
