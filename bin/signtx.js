const { BIP32Interface, fromSeed, default: BIP32Factory } = require('bip32');
const { encode } = require('bip68');
const wif = require("wif")
const {
  payments,
  Psbt,
  networks,
  script,
  opcodes,
  Payment,
  ECPair,
  bip32,
} = require('bitcoinjs-lib');

aliceKey = "tpubDECZ14XEMYxMgF8BXmyJzcpX4AVmRiq4WSNaqgkArM6o5KhudPqNRYEyvRnyvdv1zKb9oq1V8fcQJpN4JVdGEaS5iLDKdp9fuk8B8Gh7Jmr";
// aliceKey = "tprv8ZgxMBicQKsPfGA6KhKTv3wrhf4TVj8P6aP1NgNB4hREWSpNmm1XetAT4ScVBMdMNpa5dysWyJCA8EW3aXJtAfg37kbS7duU7b6QwkqB2st";
// alicePubKey = String("tpubDECZ14XEMYxMgF8BXmyJzcpX4AVmRiq4WSNaqgkArM6o5KhudPqNRYEyvRnyvdv1zKb9oq1V8fcQJpN4JVdGEaS5iLDKdp9fuk8B8Gh7Jmr")
bobKey = "tpubDFYixx7sUg6yzmWuEsXVubgtvNMpAH9VWDyPkqfcyYF2LfpgjHz182wJn2CsFtwyMyaDdNaByp71ukf8dJ7yd45jrvNeD5aDdQ7Z2P4EHki"
transaction_id = "993d63b34afeca3dd60404eb3ae8d346260b96cbfa15d86312fd1feeffa190a2:1"

function createRefreshOutputScript(aliceKey, bobKey) {
    alice = Buffer.from(aliceBuf, 'hex')
  aliceKey = "tpubDECZ14XEMYxMgF8BXmyJzcpX4AVmRiq4WSNaqgkArM6o5KhudPqNRYEyvRnyvdv1zKb9oq1V8fcQJpN4JVdGEaS5iLDKdp9fuk8B8Gh7Jmr";
  aliceBuf = Buffer ('03 d3 dd 37 df 76 41 57 f6 48 30 8d da c4 64 c5 95 64 59 75 48 4d a4 8b 7d c9 32 2c 5d f1 e2 cb 71')
  aliceKey = aliceKey.toString('hex')
  console.log(aliceKey);
  bobKey = "tpubDFYixx7sUg6yzmWuEsXVubgtvNMpAH9VWDyPkqfcyYF2LfpgjHz182wJn2CsFtwyMyaDdNaByp71ukf8dJ7yd45jrvNeD5aDdQ7Z2P4EHki"
  const sequence = encode({ seconds: 7168 });

  return script.fromASM(
    `
    ${aliceKey}
    OP_CHECKSIG
    OP_IFDUP
    OP_NOTIF
        ${bobKey}
        OP_CHECKSIGVERIFY
        ${script.number.encode(sequence).toString('hex')}
        OP_CHECKSEQUENCEVERIFY
    OP_ENDIF
  `
      .trim()
      .replace(/\s+/g, ' '),
  );
}
const redeemScripts = (alice, bob)=> {
  alice = Buffer.from(aliceBuf, 'hex')
  // alice = aliceBuf.toString('hex')
  const redeemScript = payments.p2sh({
    redeem: {
      output: createRefreshOutputScript(alice, bob),
    },
    network: networks.testnet,
  });

  return redeemScript;
}

//create and sign transaction
async function createTransaction(
  // recipientAddress,
  // amountInSatoshis,
  // transaction_id,
  // output_index,
  // alicePubKey,
  // heirPubKey,
) {

  // alicePubKey = "tpubDECZ14XEMYxMgF8BXmyJzcpX4AVmRiq4WSNaqgkArM6o5KhudPqNRYEyvRnyvdv1zKb9oq1V8fcQJpN4JVdGEaS5iLDKdp9fuk8B8Gh7Jmr"
  console.log("what")
  aliceBuf = Buffer ('03 d3 dd 37 df 76 41 57 f6 48 30 8d da c4 64 c5 95 64 59 75 48 4d a4 8b 7d c9 32 2c 5d f1 e2 cb 71')
  // bobBuf = Buffer ('03 1d 68 ac 17 41 b8 9c b8 2d 3f 74 07 42 5d 8b cb d8 c6 dc 32 a1 73 5f 86 f4 fb 2a bf 87 65 d3 3c')
  alicePubKey = "tprv8ZgxMBicQKsPfGA6KhKTv3wrhf4TVj8P6aP1NgNB4hREWSpNmm1XetAT4ScVBMdMNpa5dysWyJCA8EW3aXJtAfg37kbS7duU7b6QwkqB2st";
  // alicePubKey.toBase58()
  // alicePubKey = bip32.fromBase58(alicePubKey)
  console.log(alicePubKey)
  
  const sequence = encode({ seconds: 7168 });
  console.log("see me")
  console.log(typeof(alicePubKey))
  // const nonWitnessUtxo = Buffer.from(utx.txHex, 'hex');
  // ECPair.fromPrivateKey()
  const alice = wif.encode(239, aliceBuf, false)
  // const alice = ECPair.fromWIF(alicePubKey, networks.testnet);
  console.log(alice)
  console.log("here")
  const redeemScript = redeemScripts(alicePubKey, heirPubKey);

  const psbt = new Psbt({ network: networks.testnet })
    .setVersion(2)
    .addInput({
      hash: transaction_id,
      index: output_index,
      sequence,
      redeemScript: redeemScript.redeem.output,
      // nonWitnessUtxo,
    })
    .addOutput({
      address: recipientAddress,
      value: amountInSatoshis,
    })
    .signInput(0, alice)
    .finalizeInput(0, csvGetFinalScripts()) // See csvGetFinalScripts below
    .extractTransaction();
  console.log('Created transaction: ' + tx.toHex());
  console.log('Transaction has ID: ' + tx.getId());

  return psbt;
}

function csvGetFinalScripts(
    inputIndex,
    input,
    scriptHash,
    isSegwit,
    isP2SH,
    isP2WSH,
  ) {
    finalScriptSig;
    finalScriptWitness;
  } {
    // Step 1: Check to make sure the meaningful script matches what you expect.
    const decompiled = script.decompile(scriptHash);
    // Checking if first OP is OP_IF... should do better check in production!
    // You may even want to check the public keys in the script against a
    // whitelist depending on the circumstances!!!
    // You also want to check the contents of the input to see if you have enough
    // info to actually construct the scriptSig and Witnesses.
    if (!decompiled || decompiled[0] !== opcodes.OP_IF) {
      throw new Error(`Can not finalize input #${inputIndex}`);
    }
}
function signTransaction(inputIndex, script) {
    const decompiled = script.decompile(script);
    if (!decompiled || decompiled[0] !== opcodes.OP_ADD) {
      throw new Error(`Can not finalize input #${inputIndex}`);
    }

    // Step 2: Create final scripts
    const payment = payments.p2wsh({
      redeem: {
        output: script,
        input: script.compile([opcodes.OP_2, opcodes.OP_3]),
      },
    });

    return {
      finalScriptWitness:
        payment.witness && payment.witness.length > 0
          ? witnessStackToScriptWitness(payment.witness)
          : undefined,
    };
}

module.exports = {createTransaction};