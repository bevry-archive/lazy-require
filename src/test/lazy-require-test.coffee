# Import
{expect,assert} = require('chai')
joe = require('joe')
rimraf = require('rimraf')
pathUtil = require('path')
{lazyRequire} = require('../../')


# =====================================
# Tests

joe.describe 'lazy-require', (describe,it) ->

	describe 'fetch existing', (describe,it) ->
		it 'should work', (complete) ->
			lazyRequire 'safeps', (err,m) ->
				expect(err).to.not.exist
				expect(m).to.exist
				complete()

	describe 'install missing', (describe,it) ->
		it 'clean up', (complete) ->
			rimraf(pathUtil.join(process.cwd(), 'node_modules', 'feedr'), complete)

		it 'should work', (complete) ->
			lazyRequire 'feedr', {output:true}, (err,m) ->
				expect(err).to.not.exist
				expect(m).to.exist
				complete()

		it 'clean up', (complete) ->
			rimraf(pathUtil.join(process.cwd(), 'node_modules', 'feedr'), complete)


	describe 'install unknown', (describe,it) ->
		it 'should not work', (complete) ->
			lazyRequire '!@#$%^&*()', (err,m) ->
				expect(err).to.exist
				expect(m).to.not.exist
				complete()
