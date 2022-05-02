//create and sign transaction
async function createTransasction(
    utxos,
    recipientAddress,
    amountInSatoshis,
    changeAddress,
    witnessScriptOutput,
  ) {
    // const feeRate = await getFeeRates();

    const { inputs, outputs, fee } = coinselect(
      utxos,
      [
        {
          address: recipientAddress,
          value: amountInSatoshis,
        },
      ],
      4, //feerate, changing in a min
    );

    if (!inputs || !outputs) throw new Error('Unable to construct transaction');
    if (fee > amountInSatoshis) throw new Error('Fee is too high!');

    const psbt = new Psbt({ network: networks.testnet });
    psbt.setVersion(2);
    psbt.setLocktime(0);

    inputs.forEach((input) => {
      psbt.addInput({
        hash: input.txid,
        index: input.vout,
        witnessUtxo: {
          value: input.value,
          script: Buffer.from(
            '0020' + crypto.sha256(witnessScriptOutput).toString('hex'),
            'hex',
          ),
        },
        witnessScript: Buffer.from(witnessScriptOutput, 'hex'),
      });
    });

    outputs.forEach((output) => {
      // coinselect doesnt apply address to change output, so add it here
      if (!output.address) {
        output.address = changeAddress;
      }

      psbt.addOutput({
        address: output.address,
        value: output.value,
      });
    });

    const signTransaction = this.signTransaction(inputs, witnessScriptOutput);
    psbt.finalizeInput(0, signTransaction);

    return psbt;
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