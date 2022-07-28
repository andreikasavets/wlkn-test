const functions = require("firebase-functions");
const { Connection, PublicKey } = require("@solana/web3.js");
const { Metadata } = require("@metaplex-foundation/mpl-token-metadata");

const connection = new Connection("https://api.mainnet-beta.solana.com");
const creatorAddress = '3H1XGgU3XzELBUCLvwNwYG26GNH7qtiXN7VFodzu7akh';

exports.verifyNFT = functions.https.onRequest(async (request, response) => {
  try {
    const startMS = Date.now();
    const {token} = request.query;
    const mintPubKey = new PublicKey(token);
    const tokenMetaPubKey = await Metadata.getPDA(mintPubKey);

    const {
      data: { data: metadata }
    } = await Metadata.load(connection, tokenMetaPubKey);

    const verified = !metadata.creators.find(c => Number(c.verified) === 0 && c.address === creatorAddress)
    functions.logger.info(metadata, {structuredData: true});
    response.json({verified, timesTakenMs: Date.now() - startMS});
  } catch (e) {
    functions.logger.error(e);
    response.send(`Error occurred ${e.message}`);
  }
});