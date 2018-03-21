// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by opzio-theme.js.
import { name as packageName } from "meteor/opzio-theme";

// Write your tests here!
// Here is an example.
Tinytest.add('opzio-theme - example', function (test) {
  test.equal(packageName, "opzio-theme");
});
