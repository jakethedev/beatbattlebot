const fs = require('fs')

exports.default = {
  _cacheFile: 'battlecache.json',
  _entriesMap: {},
  addEntry: function(username, link){
    this._entriesMap[username] = link;
    //TODO require(fs), use writeSync method since we're already async
  },
  emptyCache: function(){
    //TODO close file if necessary
    //TODO mv disk cache to cache.back
    this.entriesMap = {}
    //TODO save NEW empty to disk
  },
  initialize: function(){
    //TODO read from _cacheFile if exists, put data in _entriesMap
  }
}
