const RpcAgent = require('bcrpc');
agent = new RpcAgent({port: 18332, user: 'test', pass: 'test'});

const ecc = require('tiny-secp256k1')
const { generateMnemonic, mnemonicToSeedSync } = require('bip39')
const { BIP32Factory } = require('bip32')
const { payments, Psbt, bip32, networks } = require("bitcoinjs-lib");
const coinselect = require("coinselect");

const { fromSeed } = BIP32Factory(ecc)


const CreateMnemonic = function() {
    async function generatexpub() {
        const mnemonic = generateMnemonic(256)
        console.log(mnemonic)
        const seed = mnemonicToSeedSync(mnemonic)
        const privateKey = fromSeed(seed, networks.testnet)
        console.log(privateKey) 

        const derivationPath = "m/84'/0'/0'"; // P2WPKH
        const child = privateKey.derivePath(derivationPath).neutered()
            const xpub = child.toBase58();
            console.log(xpub)
            return xpub;     
    }
    generatexpub()
}


// const wallet = function() {

//     function createwallet(name) {
//         try {
//             name = process.argv[3];
            // console.log(name.toString());
//             if(!name) {
//                 return "error: Enter a wallet name to proceed"
//             }
//             agent.createWallet(name.toString())
//             return;
//         } catch (error) {
//             console.log(error.message)
//         }
//     }
//     createwallet();    
// }

module.exports = {CreateMnemonic};
