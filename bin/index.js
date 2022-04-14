#!/usr/bin/env node

const cli = require("commander")
const pkg = require("../package.json")
const run = require("./index-connect")

cli
 .description("An interface to create timelocked p2wsh transactions and refresh the timelock")
 .name("refresher-cli")
 .version(pkg.version)
 .parse(process.argv);
 
cli.command("connect")
   .description("Connect to bitcoin core")
   .action(run())
