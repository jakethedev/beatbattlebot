//TODO Switch this to require(fs).listDir() or something
// const MODULES = ['./battlelib', './syslib', './discordlib', './giftex', './musiclib']
const MODULES = ['./battlelib', './syslib', './discordlib', './giftex']
const debug = (msg) => console.log(`cmdidx: ${msg}`)

// Dynamically load all operations we care about into a single commander object
let allOps = {}, meta = {}
// Get each lib by name
for (lib of MODULES) {
  meta[lib] = []
  let libOps = require(lib);
  for (op in libOps) {
    // Stash all op names at meta[libname] for help reference
    allOps[op] = libOps[op]
    meta[lib].push(op)
  }
  // These will clobber eachother, this keeps them split up
  meta[lib].helptext = libOps['helptext']()
}

exports.ops = allOps
exports.meta = meta