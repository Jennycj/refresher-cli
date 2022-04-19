#!/usr/bin/env node

const cli = require("commander")
const pkg = require("../package.json")
const {list, getMasterPrivateKey, CreateMnemonic} = require("./main")

cli
 .name("refresher-cli")
 .command("refresher-cli")
 .description("An interface to create timelocked p2wsh transactions and refresh the timelock")
 .version(pkg.version)
 .parse(process.argv);
 
cli.command("createmnemonic")
   .description("create a mnemonic")
   .action(CreateMnemonic())


