# Import
safeps = require('safeps')
{extractOpts} = require('extract-opts')


# =====================================
# Define Module

lazyRequire =

	# Lazy Require
	# next(err, m)
	lazyRequire: (name,opts,next) ->
		# Prepare
		[opts,next] = extractOpts(opts, next)

		# Try to include the module
		try
			m = require(name)
		catch err
			m = null

		# Success
		return next(null, m)  if m

		# Install
		safeps.spawn ['npm', 'install', name], opts, (err) ->
			# Check
			return next(err, m)  if err

			# Try to include the module
			try
				m = require(name)
			catch _err
				return next(err, m)

			# Forward
			return next(err, m)


# =====================================
# Export

module.exports = lazyRequire