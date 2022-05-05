#!/usr/bin/env node

const cli = require("commander")
const pkg = require("../package.json")
// const { CreateMnemonic, createAddress, txScript} = require("./main")
// const {CreateMnemonic} = require("./main")
// const {createTransaction} = require("./signtx")
const {createTransaction} = require("./tx")
// const {broadcastTransaction} = require("./tx")
const database = require("../db/index")

database()

cli
 .name("refresher-cli")
 .command("refresher-cli")
 .description("An interface to create timelocked p2wsh transactions and refresh the timelock")
 .version(pkg.version)
 .parse(process.argv);
 
// cli.command("createmnemonic")
//    .description("create a mnemonic")
//    .action(CreateMnemonic())

// cli.command("createaddress")
//    .description("create an address for transactions")
//    .action(createAddress())

cli.command("createtx")
   .description("create an address for transactions")
   .action(createTransaction())

// cli.command("createkey")
//    .description("create an address for transactions")
//    .action(broadcastTransaction())

// cli.command("create")
//    .description("create an address for transactions")
//    .action(txScript())

// cli.command("createheir")
//    .description("create an address for transactions")
//    .action(CreateHeir())


