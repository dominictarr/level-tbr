
var tape             = require('tape')
var level            = require('level-test')()
var sublevel         = require('level-sublevel/bytewise')
var pull             = require('pull-stream')
var pl               = require('pull-level')
var cont             = require('cont')
var tp               = require('time-period')
var TimeBucketReduce = require('time-bucket-reduce')

var LTBR = require('../')



var MAX = undefined
tape('simple', function (t) {
  var _db = level('simple-tbr', {encoding: 'json'})
  var db = sublevel(_db)
  var tbr = LTBR(db)

  var start = 1413213123

  for(var i = 0; i < 35 * 24*60*60*1000; i += 10000)
    tbr.add({ts: start + i, value: 1})

  console.log(db.location)

  tbr.on('drain', function () {

//  var TBR = TimeBucketReduce({
//      map: function (data) {
//        throw new Error('never call this')
//      },
//      reduce: function (a, b) {
//        return (a || 0) + b
//      },
//      output: function (value, start, type) {
//        throw new Error('should not happen')
//      }
//    })
//

    _db.close(function (err) {
      if(err) throw err

      var db2 = sublevel(level('simple-tbr', {encoding: 'json', clean: false}))

      var tbr2 = LTBR(db2)

      tbr2.on('ready', function () {
        console.log(tbr.dump())
        console.log(tbr2.dump())
        t.end()
      })

    })
  })

})
