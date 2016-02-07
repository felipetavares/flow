/*
  Simplisting unit testing.

  So you don't have to learn another framework.

  Create a file in the lines of vec2.js for your test,
  then add a loadTest statement here.
*/
var tests = [];
var executed = 0;
var passed = 0;
var failed = 0;

exports.verifyTest = function (got, expected) {
  executed ++;

  if (expected === got) {
    passed ++;
    console.log('[PASS]');
  } else {
    failed ++;

    console.log('[FAIL]');
  }
}

function doTest (name, test) {
  console.log('Testing '+name);
  test();
}

function loadTest (file) {
  var o = require(file);
  doTest(o.name, o.test);
}

exports.test = function () {
  loadTest('./vec2.js');

  console.log (executed+' tests executed');
  console.log (passed+' tests passed');
  console.log (failed+' tests failed');
}
