const RpcAgent = require('bcrpc');
const { create } = require('./index-createtx');
agent = new RpcAgent({port: 38332, user: 'test', pass: 'test'});

// agent.getBlockCount(function (err, blockCount) {
//   if (err)
//     throw Error(JSON.stringify(err));
//   console.log(blockCount.result);
//   agent.getBlockHash(blockCount.result, function (err, hash) {
//     if (err)
//       throw Error(JSON.stringify(err));
//     console.log(hash.result);
//   })
// });
// agent.createWallet("sam")

const list = function() {
  const listWallet  = () => {
    agent.listWallets(function(err, listWallets) {
        if (err){
            console.log(err.message)
        }
        console.log(listWallets)
    })
  } 
    listWallet()
}

const info = function() {
  const walletInfo  = () => {
    agent.getWalletInfo(function(err, getWalletInfo) {
        if (err){
            console.log(err.message)
        }
        console.log(getWalletInfo)
    })
  } 
    walletInfo()
}

const get = function() {
  const gettxout  = () => {
    agent.getTxOut(function(err, getTxOut) {
        if (err){
            console.log(err.message)
        }
        console.log(getTxOut)
    })
  } 
  gettxout ()
}

const wallet = function() {

    function createwallet(name) {
        try {
            name = process.argv[3];
            console.log(name.toString());
            agent.createWallet(name.toString())
            return;
        } catch (error) {
            console.log(error.message)
        }
    }
    createwallet();    
}

module.exports = {list, wallet, info, get}
