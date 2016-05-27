/* eslint no-sync:0 */

// Import
const pathUtil = require('path')
const fsUtil = require('fs')
const safeps = require('safeps')
const extractOptsAndCallback = require('extract-opts')

// Prepare
function complete (error, result, next) {
	if ( next ) {
		next(error, result)
		return null
	}
	else {
		return error || result
	}
}

// =====================================
// Define Module

// Require or install a package synchronously or asynchronously
// Also export this function as the default
function lazyRequire (name, opts, next) {
	// Prepare
	[opts, next] = extractOptsAndCallback(opts, next)

	// If we have a callback, then do async
	return next ? lazyRequire.async(name, opts, next) : lazyRequire.sync(name, opts)
}

// Require or install a package synchronously or asynchronously
lazyRequire.auto = function auto (name, opts, next) {
	// Prepare
	[opts, next] = extractOptsAndCallback(opts, next)

	// If we have no callback, or if we support sync, then do sync
	if ( !next || lazyRequire.canSyncInstall() ) {
		return lazyRequire.requireOrInstallSync(name, opts, next)
	}
	else {
		return lazyRequire.requireOrInstallAsync(name, opts, next)
	}
}

// Require or install a package synchronously
lazyRequire.sync = function sync (name, opts, next) {
	// Prepare
	[opts, next] = extractOptsAndCallback(opts, next)
	let result = lazyRequire.require(name, opts)
	let error = null

	// Synchronous
	if ( result instanceof Error ) {
		result = lazyRequire.installSync(name, opts)
		if ( result instanceof Error ) {
			error = result
			result = null
		}
	}

	// Complete
	return complete(error, result, next)
}

// Require or install a package asynchronously
lazyRequire.async = function async (name, opts, next) {
	// Prepare
	[opts, next] = extractOptsAndCallback(opts, next)

	// Asynchronous
	lazyRequire.require(name, opts, function (error, result) {
		if ( result )  return next(error, result)
		lazyRequire.installAsync(name, opts, next)
	})

	// Exit
	return null
}

// Attempt to require a module
lazyRequire.require = function _require (name, opts, next) {
	// Prepare
	[opts, next] = extractOptsAndCallback(opts, next)
	let result = null
	let error = null

	// Fetch
	try {
		result = require(name)
	}
	catch ( e1 ) {
		error = e1

		if ( opts.cwd ) {
			const path = pathUtil.join(opts.cwd, 'node_modules', name)
			try {
				result = require(path)
				error = null
			}
			catch ( e2 ) {
				error = e2
			}
		}
	}

	// Complete
	return complete(error, result, next)
}

// Can Save
lazyRequire.canSave = function canSave (name, opts, next) {
	// Prepare
	[opts, next] = extractOptsAndCallback(opts, next)
	let result = null
	let error = null

	// Options
	if ( opts.cwd == null ) {
		opts.cwd = process.cwd()
	}
	opts.packagePath = pathUtil.join(opts.cwd, 'package.json')

	// Fetch
	try {
		result = fsUtil.existsSync(opts.packagePath) === true
	}
	catch ( err ) {
		error = err
	}

	// Complete
	return complete(error, result, next)
}

// Can install synchronously
lazyRequire.canSyncInstall = function canSyncInstall (opts, next) {
	// Prepare
	[opts, next] = extractOptsAndCallback(opts, next)
	let result = safeps.hasSpawnSync()
	let error = null

	// Fetch
	if ( result instanceof Error ) {
		error = result
		result = null
	}

	// Complete
	return complete(error, result, next)
}

// Attempt to require a module (will install if missing)
// Asynchronous with optional callback
lazyRequire.installAsync = function installAsync (name, opts, next) {
	// Prepare
	[opts, next] = extractOptsAndCallback(opts, next)
	let error = null

	// Defaults
	if ( opts.save == null ) {
		opts.save = false
	}
	if ( opts.cwd == null ) {
		opts.cwd = process.cwd()
	}

	// Check that we are not in the browser
	if ( process.browser === true ) {
		error = new Error('lazy-require: installing in the browser is not possible')
	}

	// Check saving
	else if ( opts.save === true && lazyRequire.canSave() === false ) {
		error = new Error('lazy-require: cannot save the module as `opts.cwd` did not contain a `package.json` file')
	}

	// Install
	else {
		// Arguments
		const args = ['npm', 'install', name]
		if ( opts.save === true ) {
			args.push('--save')
			opts.save = null  // {delete opts.save} is very slow
		}

		// Install
		safeps.spawn(args, opts, function (err) {
			// Check
			if ( err )  return next(err)

			// Try to load the module
			lazyRequire.require(name, opts, next)
		})

		// Exit
		return null
	}

	// Complete
	return complete(error, null, next)
}

// Attempt to require a module (will install if missing)
// Synchronous with optional callback
lazyRequire.installSync = function installSync (name, opts, next) {
	// Prepare
	[opts, next] = extractOptsAndCallback(opts, next)
	let error = null

	// Defaults
	if ( opts.save == null ) {
		opts.save = false
	}
	if ( opts.cwd == null ) {
		opts.cwd = process.cwd()
	}

	// Check that we are not in the browser
	if ( process.browser === true ) {
		error = new Error('lazy-require: installing in the browser is not possible')
	}

	// Check that spawnSync exists, check that the project's package.json exists
	else if ( lazyRequire.canSyncInstall() === false ) {
		error = new Error('lazy-require: installing synchronously is not possible')
	}

	// Check saving
	else if ( opts.save === true && lazyRequire.canSave() === false ) {
		error = new Error('lazy-require: cannot save the module as `opts.cwd` did not contain a `package.json` file')
	}

	// Install
	else {
		// Arguments
		const args = ['npm', 'install', name]
		if ( opts.save === true ) {
			args.push('--save')
			opts.save = null  // {delete opts.save} is very slow
		}

		// Install
		const spawnResult = safeps.spawnSync(args, opts)
		if ( spawnResult instanceof Error ) {
			error = spawnResult
		}
		else {
			// Exit
			return lazyRequire.require(name, opts, next)
		}
	}

	// Complete
	return complete(error, null, next)
}

// Export
module.exports = lazyRequire
