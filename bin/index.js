#!/usr/bin/env node

const cli = require("commander")
const pkg = require("../package.json")
const run = require("./index-connect")
const {list, wallet} = require("./main")

cli
 .description("An interface to create timelocked p2wsh transactions and refresh the timelock")
 .name("refresher-cli")
 .version(pkg.version)
 .parse(process.argv);
 
cli.command("connect")
   .description("Connect to bitcoin core")
   .action(run())

cli.command("createwallet")
   .description("create a wallet")
   .action(wallet())

cli.command("listwallets")
   .description("list all wallets")
   .action(list())
