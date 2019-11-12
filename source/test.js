'use strict'

// Import
const assert = require('assert')
const { equal, errorEqual } = require('assert-helpers')
const kava = require('kava')
const rimraf = require('rimraf')
const pathUtil = require('path')
const lazyRequire = require('./')
const safeps = require('safeps')

function cleanup(test) {
	test('cleanup', function(complete) {
		safeps.spawn(
			['npm', 'uninstall', 'bevry-echo', '--save'],
			{
				stdio: 'inherit',
				cwd: process.cwd()
			},
			complete
		)
	})
}

// Tests
kava.suite('lazy-require', function(suite, test) {
	test('fetch existing', function(complete) {
		lazyRequire('safeps', function(err, m) {
			errorEqual(err, null)
			assert.ok(m)
			complete()
		})
	})

	cleanup(test)

	test('install missing asynchronously', function(complete) {
		lazyRequire('bevry-echo', { stdio: 'inherit' }, function(err, m) {
			errorEqual(err, null)
			assert.ok(m)
			complete()
		})
	})

	cleanup(test)

	test('install missing synchronously', function() {
		// Skip this test if installing synchronously isn't possible
		if (lazyRequire.canSyncInstall() === false) {
			return
		}

		const m = lazyRequire('bevry-echo', { stdio: 'inherit' })
		assert.ok(!m.stack)
		assert.ok(m)
	})

	cleanup(test)

	suite('install unknown', function(suite, test) {
		test('should not work', function(complete) {
			lazyRequire('aksdkasdlakdlakda', function(err, m) {
				errorEqual(err, 'npm ERR!')
				equal(m, null)
				complete()
			})
		})
	})
})
