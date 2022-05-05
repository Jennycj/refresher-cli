const varuint = require('bip174/src/lib/converter/varint');
const { encode } = require('bip68');
const  {
  crypto,
  payments,
  Psbt,
  networks,
  script,
  opcodes,
  ECPair,
  Transaction,
} = require('bitcoinjs-lib');
const  axios = require('axios');
const dotenv = require("dotenv")
dotenv.config()

//create and sign transaction

async function createTransaction() {
    const testNetVersionPrefix = 0xef;
    const sequence = encode({ seconds: 7168 });
    const base_url = process.env.BASE_URL
    //p2wsh address
    const addr =
    //   'tb1qtlfn8sh32asacx6kcvxr5wmsmqf7vzvul8s83cadw2h3rh8dxmqshzyr0j';
      'tb1qe2as82r0wgvaaahngfjtvvh9wr5kgurwpgzhmm2rphe03wkz9xuszru6h3'
    // menomics: offer demand swallow lizard taste connect media cool flame mail pistol resource rebel assault panther shove wink planet flip notable reduce blanket horror aspect
    const alicePubKey =
    //   '038ea27103fb646a2cea9eca9080737e0b23640caaaef2853416c9b286b353313e';
      '0394ea0e2bf5d24a7cd822f4d4f2ce5aeb79a364f69c7c4ab3a1a26b0d94d34abe'
    const bobPubKey =
    //   '038f0248cc0bebc425eb55af1689a59f88119c69430a860c6a05f340e445c417d7';
      '03e2c46b94eefb6f44d9adb90ca128f92c25a2a2cc3b015e78bbcee0132b841b55'
    const alicePrivKey =
    //   '9632f11629d05bbb9a3aef95d330b3fab6630d8133bed3efe0cc8b19191c53a9';
      '636ba931eaeaf2235d21ce752ace10b3620886c73e2af6c94d3d54063434f424'
    // const bobPrivKey =
    //   '0532f8eee64d878e051cb2a330428f193c6650da12a03f302c8eac826388a9a1';
    const txid =
    //   '76901d499b6746cb51c12210eeb813ea4159b19c65bc09485fdf36db029f77e6';
      "993d63b34afeca3dd60404eb3ae8d346260b96cbfa15d86312fd1feeffa190a2"
    // const txid =
    //   '3078783d8e1f7182ed433d8696157f747ac4d708f79b20bcc8e7b335afa5c258';

    const url = `${base_url}/tx/${txid}/hex`;
    const tx = await axios.get(url)
    console.log(tx.data)
    const nonWitnessUtxo = Buffer.from(tx.data, 'hex');

    const alicePubBuffer = Buffer.from(alicePrivKey, 'hex');

    const alice = ECPair.fromPrivateKey(alicePubBuffer, {
      network: networks.testnet,
      compressed: true,
    });

    // const alice = ECPair.fromWIF(aliceWIF, networks.testnet);
    const bobPubBuffer = Buffer.from(bobPubKey, 'hex');

    const bob = ECPair.fromPublicKey(bobPubBuffer, {
      network: networks.testnet,
      compressed: true,
    });

    const witnessScript = redeemScript(alice, bob);

    const psbt = new Psbt({ network: networks.testnet })
      .setVersion(2)
      .addInput({
        hash: txid,
        index: 1,
        sequence,
        witnessUtxo: {
          script: Buffer.from('0020' + crypto.sha256(witnessScript.redeem.output).toString('hex'), 'hex'),
          value: 2573,
        },
        witnessScript: witnessScript.redeem.output,
      })
      .addOutput({
        address: addr,
        value: 2000,
      })
      .signInput(0, alice, [Transaction.SIGHASH_ALL])
      .finalizeInput(0, csvGetFinalScripts)
      .extractTransaction();
    // return psbt.getId();

    console.log(psbt.toHex());
    return psbt.toHex();
}

// P2WSH address:
// tb1qe2as82r0wgvaaahngfjtvvh9wr5kgurwpgzhmm2rphe03wkz9xuszru6h3
// P2WSH script:
// {
//   output: <Buffer 21 03 1f 47 cc 98 46 6d f5 32 9c 96 39 ae 7e f4 72 55 60 b4 9d b3 c6 a9 4c eb 30 14 bc 00 d9 ee 25 fd ac 73 64 21 03 e2 c4 6b 94 ee fb 6f 44 d9 ad b9 ... 28 more bytes>
// }


async function broadcastTransaction(txHex) {
    txHex = "02000000000101a290a1ffee1ffd1263d815facb960b2646d3e83aeb0404d63dcafe4ab3633d9901000000000e00400001d007000000000000220020cabb03a86f7219def6f34264b632e570e964706e0a057ded430df2f8bac229b902483045022100c4446e70611cc201865607b544cc06862b1858d018a71cd640348d0a99b3de7102204facc3f738d972f7f587465e8499a58a6b7a1b6234ea9d97be7cc078c62f91e2014e21031f47cc98466df5329c9639ae7ef4725560b49db3c6a94ceb3014bc00d9ee25fdac73642103e2c46b94eefb6f44d9adb90ca128f92c25a2a2cc3b015e78bbcee0132b841b55ad030e0040b26800000000"
    const base_url = process.env.BASE_URL;
    const url = `${base_url}/tx/`;

    const resp = await axios.post(url, txHex)

    console.log(resp.data);

    return resp.data;
}

function createRefreshOutputScript(alice, bob) {
    const sequence = encode({ seconds: 7168 });

    return script.fromASM(
      `
      ${alice.publicKey.toString('hex')}
      OP_CHECKSIG
      OP_IFDUP
      OP_NOTIF
      ${bob.publicKey.toString('hex')}
          OP_CHECKSIGVERIFY
          ${script.number.encode(sequence).toString('hex')}
          OP_CHECKSEQUENCEVERIFY
      OP_ENDIF
    `
        .trim()
        .replace(/\s+/g, ' '),
    );
}

function redeemScript(alice, bob) {
    const redeemScript = payments.p2wsh({
      redeem: {
        output: createRefreshOutputScript(alice, bob),
      },
      network: networks.testnet,
    });
    console.log('P2WSH address:');
    console.log(redeemScript.address);

    console.log('P2WSH script:');
    console.log(redeemScript.redeem);

    return redeemScript;
}

  //refresh transaction
  //mnenomic of alice, pubkey of bob, this should be saved
  //use fix derivationpath
  //abstract the fn that keeps count of the derivation path prob an in-memory db
  //

function witnessStackToScriptWitness(witness) {
    let buffer = Buffer.allocUnsafe(0);

    function writeSlice(slice) {
      buffer = Buffer.concat([buffer, Buffer.from(slice)]);
    }

    function writeVarInt(i) {
      const currentLen = buffer.length;
      const varintLen = varuint.encodingLength(i);

      buffer = Buffer.concat([buffer, Buffer.allocUnsafe(varintLen)]);
      varuint.encode(i, buffer, currentLen);
    }

    function writeVarSlice(slice) {
      writeVarInt(slice.length);
      writeSlice(slice);
    }

    function writeVector(vector) {
      writeVarInt(vector.length);
      vector.forEach(writeVarSlice);
    }

    writeVector(witness);

    return buffer;
}

async function getTransactionsOnAnAddress(address) {
    const base_url = process.env.BASE_URL

    const url = `${base_url}/address/${address}/txs`;
    const resp = await axios.get(url)

    return resp.data;
}

async function getUTXOfromAddress(address) {
    const base_url = process.env.BASE_URL

    const url = `${base_url}/address/${address}/utxo`;
    // console.log(url);
    const resp = await axios.get(url)

    return resp.data;
}

  // This function is used to finalize a CSV transaction using PSBT.
  // See first test above.
function csvGetFinalScripts(
    inputIndex,
    input,
    scriptHash,
    isSegwit,
    isP2SH,
    isP2WSH,
  ) {
    // Step 1: Check to make sure the meaningful script matches what you expect.
    const decompiled = script.decompile(scriptHash);
    // Checking if first OP is OP_IF... should do better check in production!
    // You may even want to check the public keys in the script against a
    // whitelist depending on the circumstances!!!
    // You also want to check the contents of the input to see if you have enough
    // info to actually construct the scriptSig and Witnesses.
    console.log(decompiled);
    console.log(
      'compiled above -----------------------------------------------',
    );
    console.log('decompile :  ' + decompiled[0]);
    console.log('OP IF: ' + opcodes.OP_IF);

    // if (!decompiled || decompiled[0] !== opcodes.OP_IF) {
    //   throw new Error(`Can not finalize input #${inputIndex}`);
    // }

    // Step 2: Create final scripts
    let payment = {
      network: networks.testnet,
      output: scriptHash,
      // This logic should be more strict and make sure the pubkeys in the
      // meaningful script are the ones signing in the PSBT etc.
      input: script.compile([input.partialSig[0].signature]),
    };
    if (isP2WSH && isSegwit)
      payment = payments.p2wsh({
        network: networks.testnet,
        redeem: payment,
      });
    if (isP2SH)
      payment = payments.p2wsh({
        network: networks.testnet,
        redeem: payment,
      });

      function witnessStackToScriptWitness(witness) {
      let buffer = Buffer.allocUnsafe(0);

      function writeSlice(slice) {
        buffer = Buffer.concat([buffer, Buffer.from(slice)]);
      }

      function writeVarInt(i) {
        const currentLen = buffer.length;
        const varintLen = varuint.encodingLength(i);

        buffer = Buffer.concat([buffer, Buffer.allocUnsafe(varintLen)]);
        varuint.encode(i, buffer, currentLen);
      }

      function writeVarSlice(slice) {
        writeVarInt(slice.length);
        writeSlice(slice);
      }

      function writeVector(vector) {
        writeVarInt(vector.length);
        vector.forEach(writeVarSlice);
      }

      writeVector(witness);

      return buffer;
    }
    console.log('finalScriptSig', (payment.input).toString('hex'))
    console.log('finalScriptWitness', (payment.witness && payment.witness.length > 0
    ? witnessStackToScriptWitness(payment.witness)
    : undefined).toString('hex'))
    return {
      finalScriptSig: payment.input,
      finalScriptWitness:
        payment.witness && payment.witness.length > 0
          ? witnessStackToScriptWitness(payment.witness)
          : undefined,
    };
}

// finalScriptWitness = "02483045022100fa8faf22566f7c66c51f703848809f824488c2fc5ab2442b6c4400bfb15b3ecf022070b1fedddd8f56acb89fef533b62c8c46fb6334a066af51f5a26529c111cafbd014e21031f47cc98466df5329c9639ae7ef4725560b49db3c6a94ceb3014bc00d9ee25fdac73642103e2c46b94eefb6f44d9adb90ca128f92c25a2a2cc3b015e78bbcee0132b841b55ad030e0040b268"
module.exports = {createTransaction};
// module.exports = {broadcastTransaction};