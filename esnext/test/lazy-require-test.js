'use strict'

// Import
const assert = require('assert')
const {equal, errorEqual} = require('assert-helpers')
const joe = require('joe')
const rimraf = require('rimraf')
const pathUtil = require('path')
const lazyRequire = require('../../')

// Tests
joe.describe('lazy-require', function (describe) {

	describe('fetch existing', function (describe, it) {
		it('should work', function (complete) {
			lazyRequire('safeps', function (err, m) {
				errorEqual(err, null)
				assert.ok(m)
				complete()
			})
		})
	})


	describe('install missing asynchronously', function (describe, it) {
		it('clean up', function (complete) {
			rimraf(pathUtil.join(process.cwd(), 'node_modules', 'feedr'), complete)
		})

		it('should work', function (complete) {
			lazyRequire('feedr', {output: true}, function (err, m) {
				errorEqual(err, null)
				assert.ok(m)
				complete()
			})
		})

		it('clean up', function (complete) {
			rimraf(pathUtil.join(process.cwd(), 'node_modules', 'feedr'), complete)
		})
	})

	describe('install missing synchronously', function (describe, it) {
		// Skip this test if installing synchronously isn't possible
		if ( lazyRequire.canSyncInstall() === false ) {
			return
		}

		it('clean up', function (complete) {
			rimraf(pathUtil.join(process.cwd(), 'node_modules', 'feedr'), complete)
		})

		it('should work', function () {
			const m = lazyRequire('feedr', {output: true})
			assert.ok(!m.stack)
			assert.ok(m)
		})

		it('clean up', function (complete) {
			rimraf(pathUtil.join(process.cwd(), 'node_modules', 'feedr'), complete)
		})
	})

	describe('install unknown', function (describe, it) {
		it('should not work', function (complete) {
			lazyRequire('aksdkasdlakdlakda', function (err, m) {
				errorEqual(err, 'npm ERR!')
				equal(m, null)
				complete()
			})
		})
	})
})
