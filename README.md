
<!-- TITLE/ -->

# Lazy Require

<!-- /TITLE -->


<!-- BADGES/ -->

[![Build Status](https://img.shields.io/travis/bevry/lazy-require/master.svg)](http://travis-ci.org/bevry/lazy-require "Check this project's build status on TravisCI")
[![NPM version](https://img.shields.io/npm/v/lazy-require.svg)](https://npmjs.org/package/lazy-require "View this project on NPM")
[![NPM downloads](https://img.shields.io/npm/dm/lazy-require.svg)](https://npmjs.org/package/lazy-require "View this project on NPM")
[![Dependency Status](https://img.shields.io/david/bevry/lazy-require.svg)](https://david-dm.org/bevry/lazy-require)
[![Dev Dependency Status](https://img.shields.io/david/dev/bevry/lazy-require.svg)](https://david-dm.org/bevry/lazy-require#info=devDependencies)<br/>
[![Gratipay donate button](https://img.shields.io/gratipay/bevry.svg)](https://www.gratipay.com/bevry/ "Donate weekly to this project using Gratipay")
[![Flattr donate button](https://img.shields.io/badge/flattr-donate-yellow.svg)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")
[![BitCoin donate button](https://img.shields.io/badge/bitcoin-donate-yellow.svg)](https://coinbase.com/checkouts/9ef59f5479eec1d97d63382c9ebcb93a "Donate once-off to this project using BitCoin")
[![Wishlist browse button](https://img.shields.io/badge/wishlist-donate-yellow.svg)](http://amzn.com/w/2F8TXKSNAFG4V "Buy an item on our wishlist for us")

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

Lazy require allows you to require modules lazily, meaning that when you lazy require a module that is missing, lazy require will automatically install it for you.

<!-- /DESCRIPTION -->


<!-- INSTALL/ -->

## Install

### [NPM](http://npmjs.org/)
- Use: `require('lazy-require')`
- Install: `npm install --save lazy-require`

<!-- /INSTALL -->


## Usage

``` javascript
// Import
var lazyRequire = require('lazy-require')

// Attempt to load the module `ambi`, if it doesn't exist, then try to install it and load it again
// Do this synchronously, only available in Node 0.12 and above
var ambi = lazyRequire('ambi', {/* options */})
if ( ambi instanceof Error ) {
	// Error ....
	console.log('ambi failed to load because of:', ambi.stack)
} else {
	// Success ...
}

// Attempt to load the module `ambi`, if it doesn't exist, then try to install it and load it again
// Do this synchronously but with a callback, only available in Node 0.12 and above
lazyRequire.sync('ambi', {/* options */}, function(err, ambi){
	// Error ...
	if (err)  return console.log('ambi failed to load because of:', err.stack)

	// Success ...
})

// Attempt to load the module `ambi`, if it doesn't exist, then try to install it and load it again
// Do this asynchronously, available in all node versions
lazyRequire('ambi', {/* options */}, function(err, ambi){
	// Error ...
	if (err)  return console.log('ambi failed to load because of:', err.stack)

	// Success ...
})

// Attempt to load the module `ambi`, if it doesn't exist, then try to install it and load it again
// Do this synchronously if supported (Node 0.12 and above), otherwise do it asynchronously
lazyRequire.auto('ambi', {/* options */}, function(err, ambi){
	// Error ...
	if (err)  return console.log('ambi failed to load because of:', err.stack)

	// Success ...
})
```

The following options are supported:

- `cwd` the module path that you would like the requested package to be installed to if it doesn't exist, always recommended
- `save` if the requested package doesn't exist, would you like to do a `npm --save` for it to add it to your `cwd`'s `package.json` dependencies?

There's some other methods also available to you, for now, read the source to discover them.


<!-- HISTORY/ -->

## History
[Discover the change history by heading on over to the `HISTORY.md` file.](https://github.com/bevry/lazy-require/blob/master/HISTORY.md#files)

<!-- /HISTORY -->


<!-- CONTRIBUTE/ -->

## Contribute

[Discover how you can contribute by heading on over to the `CONTRIBUTING.md` file.](https://github.com/bevry/lazy-require/blob/master/CONTRIBUTING.md#files)

<!-- /CONTRIBUTE -->


<!-- BACKERS/ -->

## Backers

### Maintainers

These amazing people are maintaining this project:

- Benjamin Lupton <b@lupton.cc> (https://github.com/balupton)

### Sponsors

No sponsors yet! Will you be the first?

[![Gratipay donate button](https://img.shields.io/gratipay/bevry.svg)](https://www.gratipay.com/bevry/ "Donate weekly to this project using Gratipay")
[![Flattr donate button](https://img.shields.io/badge/flattr-donate-yellow.svg)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")
[![BitCoin donate button](https://img.shields.io/badge/bitcoin-donate-yellow.svg)](https://coinbase.com/checkouts/9ef59f5479eec1d97d63382c9ebcb93a "Donate once-off to this project using BitCoin")
[![Wishlist browse button](https://img.shields.io/badge/wishlist-donate-yellow.svg)](http://amzn.com/w/2F8TXKSNAFG4V "Buy an item on our wishlist for us")

### Contributors

These amazing people have contributed code to this project:

- [Benjamin Lupton](https://github.com/balupton) <b@lupton.cc> — [view contributions](https://github.com/bevry/lazy-require/commits?author=balupton)

[Become a contributor!](https://github.com/bevry/lazy-require/blob/master/CONTRIBUTING.md#files)

<!-- /BACKERS -->


<!-- LICENSE/ -->

## License

Unless stated otherwise all works are:

- Copyright &copy; 2013+ Bevry Pty Ltd <us@bevry.me> (http://bevry.me)

and licensed under:

- The incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence) [MIT License](http://opensource.org/licenses/mit-license.php)

<!-- /LICENSE -->


