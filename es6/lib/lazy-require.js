# Import
pathUtil = require('path')
fsUtil = require('fs')
safeps = require('safeps')
extractOptsAndCallback = require('extract-opts')

complete = (error, result, next) ->
	if next
		next(error, result)
		return null
	else
		return error or result

# =====================================
# Define Module

# Require or install a package synchronously or asynchronously
# Also export this function as the default
lazyRequire = module.exports = (name, opts, next) ->
	# Prepare
	[opts,next] = extractOptsAndCallback(opts, next)

	# If we have a callback, then do async
	if next
		return lazyRequire.async(name, opts, next)
	else
		return lazyRequire.sync(name, opts, next)

# Require or install a package synchronously or asynchronously
lazyRequire.auto = (name, opts, next) ->
	# Prepare
	[opts,next] = extractOptsAndCallback(opts, next)

	# If we have no callback, or if we support sync, then do sync
	if !next or lazyRequire.canSyncInstall()
		return lazyRequire.requireOrInstallSync(name, opts, next)
	else
		return lazyRequire.requireOrInstallAsync(name, opts, next)

# Require or install a package synchronously
lazyRequire.sync = (name, opts, next) ->
	# Prepare
	[opts,next] = extractOptsAndCallback(opts, next)

	# Synchronous
	result = lazyRequire.require(name, opts)
	if result instanceof Error
		result = lazyRequire.installSync(name, opts)
		if result instanceof Error
			error = result
			result = null

	# Complete
	return complete(error, result, next)

# Require or install a package asynchronously
lazyRequire.async = (name, opts, next) ->
	# Prepare
	[opts,next] = extractOptsAndCallback(opts, next)

	# Asynchronous
	lazyRequire.require name, opts, (err, result) ->
		return next(err, result)  if result
		lazyRequire.installAsync(name, opts, next)

	# Exit
	return null

# Attempt to require a module
lazyRequire.require = (name, opts, next) ->
	# Prepare
	[opts,next] = extractOptsAndCallback(opts, next)

	# Fetch
	try
		result = require(name)
	catch e1
		error = e1

		if opts.cwd
			path = pathUtil.join(opts.cwd, 'node_modules', name)
			try
				result = require(path)
				error = null
			catch e2
				error = e2

	# Complete
	return complete(error, result, next)

# Can Save
lazyRequire.canSave = (name, opts, next) ->
	[opts,next] = extractOptsAndCallback(opts, next)
	opts.cwd ?= process.cwd()
	opts.packagePath = pathUtil.join(opts.cwd, 'package.json')

	# Fetch
	try
		result = fsUtil.existsSync(packagePath) is true
	catch err
		error = err

	# Complete
	return complete(error, result, next)

# Can install synchronously
lazyRequire.canSyncInstall = (opts, next) ->
	# Prepare
	[opts,next] = extractOptsAndCallback(opts, next)

	# Fetch
	result = safeps.hasSpawnSync()
	if result instanceof Error
		error = result
		result = null

	# Complete
	return complete(error, result, next)

# Attempt to require a module (will install if missing)
# Asynchronous with optional callback
lazyRequire.installAsync = (name, opts, next) ->
	# Prepare
	[opts,next] = extractOptsAndCallback(opts, next)
	opts.save ?= false
	opts.cwd ?= process.cwd()

	# Check that we are not in the browser
	if process.browser is true
		error = new Error("lazy-require: installing in the browser is not possible")

	# Check saving
	else if opts.save is true and lazyRequire.canSave() is false
		error = new Error("lazy-require: cannot save the module as `opts.cwd` did not contain a `package.json` file")

	# Install
	else
		# Arguments
		args = ['npm', 'install', name]
		if opts.save is true
			args.push('--save')
			delete opts.save

		# Install
		safeps.spawn args, opts, (err) ->
			# Check
			return next(err)  if err

			# Try to load the module
			lazyRequire.require(name, opts, next)

		# Exit
		return null

	# Complete
	return complete(error, null, next)

# Attempt to require a module (will install if missing)
# Synchronous with optional callback
lazyRequire.installSync = (name, opts, next) ->
	# Prepare
	[opts,next] = extractOptsAndCallback(opts, next)
	opts.save ?= false
	opts.cwd ?= process.cwd()

	# Check that we are not in the browser
	if process.browser is true
		error = new Error("lazy-require: installing in the browser is not possible")

	# Check that spawnSync exists, check that the project's package.json exists
	else if lazyRequire.canSyncInstall() is false
		error = new Error("lazy-require: installing synchronously is not possible")

	# Check saving
	else if opts.save is true and lazyRequire.canSave() is false
		error = new Error("lazy-require: cannot save the module as `opts.cwd` did not contain a `package.json` file")

	# Install
	else
		# Arguments
		args = ['npm', 'install', name]
		if opts.save is true
			args.push('--save')
			delete opts.save

		# Install
		spawnResult = safeps.spawnSync(args, opts)
		if spawnResult instanceof Error
			error = spawnResult
		else
			# Exit
			return lazyRequire.require(name, opts, next)

	# Complete
	return complete(error, null, next)
