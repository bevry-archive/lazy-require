# Import
assert = require('assert')
{equal, errorEqual, deepEqual} = require('assert-helpers')
joe = require('joe')
rimraf = require('rimraf')
pathUtil = require('path')
lazyRequire = require('../../')


# =====================================
# Tests

joe.describe 'lazy-require', (describe,it) ->

	describe 'fetch existing', (describe,it) ->
		it 'should work', (complete) ->
			lazyRequire 'safeps', (err,m) ->
				errorEqual(err, null)
				assert.ok(m)
				complete()


	describe 'install missing asynchronously', (describe,it) ->
		it 'clean up', (complete) ->
			rimraf(pathUtil.join(process.cwd(), 'node_modules', 'feedr'), complete)

		it 'should work', (complete) ->
			lazyRequire 'feedr', {output:true}, (err,m) ->
				errorEqual(err, null)
				assert.ok(m)
				complete()

		it 'clean up', (complete) ->
			rimraf(pathUtil.join(process.cwd(), 'node_modules', 'feedr'), complete)


	describe 'install missing synchronously', (describe,it) ->
		# Skip this test if installing synchronously isn't possible
		return null  if lazyRequire.canSyncInstall() is false

		it 'clean up', (complete) ->
			rimraf(pathUtil.join(process.cwd(), 'node_modules', 'feedr'), complete)

		it 'should work', ->
			m = lazyRequire('feedr', {output:true})
			assert.ok(!m.stack)
			assert.ok(m)

		it 'clean up', (complete) ->
			rimraf(pathUtil.join(process.cwd(), 'node_modules', 'feedr'), complete)


	describe 'install unknown', (describe,it) ->
		it 'should not work', (complete) ->
			lazyRequire 'aksdkasdlakdlakda', (err,m) ->
				errorEqual(err, 'npm ERR! 404 Not Found')
				equal(m, null)
				complete()
