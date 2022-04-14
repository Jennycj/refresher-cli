const run = function() {
  const RpcClient = require('bitcoind-rpc');

  const config = {
    protocol: 'http',
    user: 'test',
    pass: 'test',
    host: '127.0.0.1',
    port: '38332',
  };

  const rpc = new RpcClient(config);

  function showNewTransactions() {
    rpc.getRawMemPool(function (err, ret) {
      if (err) {
        console.error(err);
        return setTimeout(showNewTransactions, 10000);
      }
      console.log("connecting to bitcoin core...");
      console.log("New transactions: ", ret);

    });
  }

  showNewTransactions();
};

module.exports = run;