const RpcAgent = require('bcrpc');
agent = new RpcAgent({port: 18332, user: 'test', pass: 'test'});

const ecc = require('tiny-secp256k1')
const { generateMnemonic, mnemonicToSeedSync } = require('bip39')
const { BIP32Factory } = require('bip32')
const { payments, Psbt, bip32, networks, script, opcodes } = require("bitcoinjs-lib");
const {User} = require("../models/user")
const {Heir} = require("../models/heir")

const { fromSeed} = BIP32Factory(ecc)
const network = networks.testnet;

// const CreateMnemonic = function() {
//     try {
    
//         async function generatexpub() {
//             const findUser = await User.find();
//             const derivationPath = "m/48'/1'/0'/2'"; // P2WSH(testnet)

//             if(findUser.length < 1){    
//                 const mnemonic = generateMnemonic(256)
//                 const seed = mnemonicToSeedSync(mnemonic)

//                 const privateKey = fromSeed(seed, network)
//                 const masterFingerprint = privateKey.fingerprint;
//                 const child = privateKey.derivePath(derivationPath).neutered()
//                 const xpub = child.toBase58();

//                 const user = new User({
//                     mnemonic: mnemonic,
//                     xpriv: privateKey,
//                     masterFingerprint: masterFingerprint,
//                     xpub: xpub
//                 })
//                await user.save()
//                return;     
//             } else {
//                 console.log("You have already created your mnemonic!")
//             }
//             return;
//         }
//         generatexpub()
//     } catch (error) {
//         console.log(error.message)
//     }
// }

// const CreateHeir = function() {
//     try {
    
//         async function generatexpub() {
//             const findUser = await Heir.find();
//             const derivationPath = "m/48'/1'/0'/2'"; // P2WSH(testnet)

//             if(findUser.length < 1){    
//                 const mnemonic = generateMnemonic(256)
//                 const seed = mnemonicToSeedSync(mnemonic)

//                 const privateKey = fromSeed(seed, network)
//                 const masterFingerprint = privateKey.fingerprint;
//                 const child = privateKey.derivePath(derivationPath).neutered()
//                 const xpub = child.toBase58();

//                 const heir = new Heir({
//                     mnemonic: mnemonic,
//                     xpriv: privateKey,
//                     masterFingerprint: masterFingerprint,
//                     xpub: xpub
//                 })
//                await heir.save()
//                return;     
//             } else {
//                 console.log("You have already created your mnemonic!")
//             }
//             return;
//         }
//         generatexpub()
//     } catch (error) {
//         console.log(error.message)
//     }
// }


function generateScript(childPubkey, heirChildPubkey) {
    const witnessScript = script.compile([
        opcodes.OP_PUSHDATA1,
        33,
        childPubkey,
        opcodes.OP_CHECKSIG,
        opcodes.OP_IFDUP,
        opcodes.OP_NOTIF,
        opcodes.OP_PUSHDATA1,
        33,
        heirChildPubkey,
        opcodes.OP_CHECKSIGVERIFY,
        opcodes.OP_PUSHDATA1,
        3,
        "9af040",
        opcodes.OP_CSV,
        opcodes.OP_ENDIF
    ]);
    console.log(witnessScript)
    return witnessScript;
}


const createAddress = function() {

    try {
        const heirXpub = String(process.argv[3])
        console.log(heirXpub)
        if(heirXpub === undefined) {
            console.log("Error! please enter your heir's extended public key after the 'createaddress' command")
            throw Errorr
        } else{

            async function generateAddress() {
                const findUser = await User.find()
                const addresses = findUser[0].addresses
                console.log(addresses.length)
                const num = addresses.length >1? addresses.length-=1 : 1
                console.log(num)
                const derivationPath = `0/${num}`
                console.log(findUser)
                if(findUser.length < 1) {
                    console.log("You have to create your mnemonics first! Use the 'createmnemonic' command to do this.")
                    return;
                  } else {
                    xpub = findUser[0].xpub;
                    console.log(xpub)
                    const node = bip32.fromBase58(xpub, network)
                    const childPubkey = node.derivePath(derivationPath).publicKey
                    const heirNode = bip32.fromBase58(heirXpub, network)
                    const heirChildPubkey = heirNode.derivePath(derivationPath).publicKey

                    let witnessScript = generateScript(childPubkey, heirChildPubkey);


                    const address = payments.p2wsh({
                        pubkeys: [childPubkey, heirChildPubkey],
                        redeem: { output: witnessScript, network: networks.testnet },
                        network: networks.testnet,
                    });

                    witnessScript = witnessScript.toString('hex')
                    console.log(address, witnessScript);
                    findUser[0].addresses = {address, witnessScript};
                    findUser[0].save()
                    return;
                }
            }
            generateAddress()
        }
    }catch (error) {
        console.log(error.message)
    }
}

// function generateChilPubKey(user) {
//     const addresses = user[0].addresses
//     const num = addresses.length -=1
//     const derivationPath = `0/${num}`
//     console.log(user)
//     if(user.length < 1) {
//         console.log("You have to create your mnemonics first! Use the 'createmnemonic' command to do this.")
//         return;
//       } else {
//         xpub = user[0].xpub;
//         console.log(xpub)
//         const node = bip32.fromBase58(xpub, network)
//         const child = node.derivePath(derivationPath)
//         const childPublickey = child.publicKey;
//         console.log(childPublickey);
//         return childPublickey;
// }



// const txScript = function() {
//     async function csvCheckSigOutput(xpub, heirXpub, lockTime) {
//         const findUser = await User.find()
//         xpub = findUser[0].xpub
    
//         const derivationPath = "0/0"
//         const findHeir = await Heir.find()
//         heirXpub = findHeir[0].xpub
//         const node = bip32.fromBase58(xpub, network)
//         const child = node.derivePath(derivationPath)
//         const heirNode = bip32.fromBase58(heirXpub, network)
//         const heirChild = heirNode.derivePath(derivationPath)

//         lockTime = 365; 
//         const address = payments.p2wsh({
//             pubkeys: [child.publicKey, bobKey],
//             redeem: { output: witnessScript, network: networks.testnet },
//             network: networks.testnet
//           });
//         console.log(add)
//         return
//     }
//     csvCheckSigOutput()
    
// }




// module.exports = {CreateMnemonic, createAddress, CreateHeir};
module.exports = {createAddress};
