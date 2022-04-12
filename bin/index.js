#!/usr/bin/env node

import cli from "commander";

cli.description("An interface to create timelocked pswsh transactions and refresh the timelock");
cli.name("refresher-cli");
cli.usage("<command>");

cli.parse(process.argv);
