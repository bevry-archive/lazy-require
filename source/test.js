'use strict'

// Import
const assert = require('assert')
const { errorEqual, nullish, undef } = require('assert-helpers')
const kava = require('kava')
const lazyRequire = require('./index.js')
const safeps = require('safeps')

function cleanup(test) {
	test('cleanup', function (complete) {
		safeps.spawn(
			['npm', 'uninstall', 'bevry-echo', '--save'],
			{
				stdio: 'inherit',
				cwd: process.cwd(),
			},
			complete
		)
	})
}

// Tests
kava.suite('lazy-require', function (suite, test) {
	test('fetch existing', function (complete) {
		lazyRequire('safeps', function (err, m) {
			nullish(err)
			assert.ok(m)
			complete()
		})
	})

	cleanup(test)

	test('install missing asynchronously', function (complete) {
		lazyRequire('bevry-echo', { stdio: 'inherit' }, function (err, m) {
			nullish(err)
			assert.ok(m)
			complete()
		})
	})

	cleanup(test)

	test('install missing synchronously', function () {
		// Skip this test if installing synchronously isn't possible
		if (lazyRequire.canSyncInstall() === false) {
			return
		}

		const m = lazyRequire('bevry-echo', { stdio: 'inherit' })
		assert.ok(!m.stack)
		assert.ok(m)
	})

	cleanup(test)

	suite('install unknown', function (suite, test) {
		test('should not work', function (complete) {
			lazyRequire('aksdkasdlakdlakda', function (err, m) {
				errorEqual(err, 'npm ERR!')
				undef(m)
				complete()
			})
		})
	})
})
