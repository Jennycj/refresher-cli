const RpcAgent = require('bcrpc');
agent = new RpcAgent({port: 18332, user: 'test', pass: 'test'});

const ecc = require('tiny-secp256k1')
const { generateMnemonic, mnemonicToSeedSync } = require('bip39')
const { BIP32Factory } = require('bip32')
const { payments, Psbt, bip32, networks } = require("bitcoinjs-lib");
const {User} = require("../models/user")
const Heir = require("../models/heir")

const { fromSeed } = BIP32Factory(ecc)
const network = networks.testnet
const derivationPath = "m/48'/1'/0'/2'"; // P2WSH(testnet)


const CreateMnemonic = function() {
    try {
    
        async function generatexpub() {
            const findUser = await User.find();

            if(findUser.length < 1){    
                const mnemonic = generateMnemonic(256)
                const seed = mnemonicToSeedSync(mnemonic)

                const privateKey = fromSeed(seed, network)
                const child = privateKey.derivePath(derivationPath).neutered()
                const xpub = child.toBase58();

                const user = new User({
                    mnemonic: mnemonic,
                    xpriv: privateKey,
                    xpub: xpub
                })
               await user.save()
               return;     
            } else {
                console.log("You have already created your mnemonic!")
            }
            return;
        }
        generatexpub()
    } catch (error) {
        console.log(error.message)
    }
}

const createAddress = function() {
  async function generateAddress(xpub) {
      const findUser = await User.find()
      if(findUser.length < 1) {
          console.log("You have to create your mnemonics first!")
      } else {
          xpub = findUser.xpub
          const node = bip32.fromBase58(xpub, network)
          const child = node.derivePath(derivationPath)
        //   var address = payments.p2wsh({ pubkey: child.publicKey, network: bitcoin.networks.bitcoin}).address;
          const address = payments.p2wsh({ pubKey: child.publicKey, network: network})
          console.log(address);
          findUser.addresses = address;
          return;
        }
    }
    generateAddress()
}



module.exports = {CreateMnemonic, createAddress};
