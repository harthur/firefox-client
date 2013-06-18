#!/usr/bin/env node
var nomnom = require("nomnom"),
    fxDebug = require("../index");

var opts = {
  replacement: {
    position: 1,
    help: "Replacement string for matches",
    required: true
  },
  preview: {
    abbr: 'p',
    flag: true,
    help: "Preview the replacements, but don't modify files"
  }
}

var options = nomnom.options(opts)
  .script("replace")
  .parse();
