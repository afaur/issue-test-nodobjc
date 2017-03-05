// Allows us to inspect at runtime
// use eval(pry.it) to set a breakpoint
pry = require('pryjs')

// Log segfaults
require('segfault-handler').registerHandler("debug/crash.log")

// require nodobjc
let $ = require('nodobjc')

// Include frameworks
$.framework('Foundation')
$.framework('CoreServices')

// Initialize pool
let pool = $.NSAutoreleasePool('alloc')('init')

// works
console.log( $.NSString("stringWithCString", 'time').ref() )

// works
console.log( $.CFRangeMake(0, 8) )

// works
let nsTerm = $.NSString("stringWithCString", 'time').ref()

// works
let cfRange = $.CFRangeMake(0, 8)

console.log('Right before we segfault')

// Fails
console.log(
  $.DCSCopyTextDefinition(
    null,
    nsTerm,
    cfRange
  )
)

// Drain pool
pool('drain')
