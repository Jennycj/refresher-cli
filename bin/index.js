#!/usr/bin/env node

const cli = require("commander");
const pkg = require("../package.json")

cli
 .description("An interface to create timelocked pswsh transactions and refresh the timelock")
 .name("refresher-cli")
 .usage("<command>")
 .version(pkg.version)
 .parse(process.argv);

console.log("Hello fron here!");
