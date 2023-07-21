import {CID, hasher} from 'multiformats';
const crypto = require('crypto-browserify');

const SHA_256_CODE = 0x12;
const IPLD_RAW_BINARY_CODE = 0x55;

const getCid = async (bytes: Buffer) => {
  const sha256 = hasher.from({
    // As per multiformats table
    // https://github.com/multiformats/multicodec/blob/master/table.csv#L9
    name: 'sha2-256',
    code: SHA_256_CODE,
    encode: input =>
      new Uint8Array(crypto.createHash('sha256').update(input).digest()),
  });
  const hash = await sha256.digest(bytes);
  const cid = await CID.create(1, IPLD_RAW_BINARY_CODE, hash);

  return cid;
};

export default getCid;
