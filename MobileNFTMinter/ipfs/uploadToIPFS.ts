import RNFetchBlob from 'rn-fetch-blob';
import getCid from './getCid';
import {NFT_STORAGE_API_KEY} from '@env';

const UPLOAD_ENDPOINT = 'https://api.nft.storage/upload';

export default async function uploadToIPFS(
  imagePath: string,
  name: string,
  description: string,
) {
  // Convert image into raw bytes
  const imageBytesInBase64: string = await RNFetchBlob.fs.readFile(
    imagePath,
    'base64',
  );
  const bytes = Buffer.from(imageBytesInBase64, 'base64');
  const cid = await getCid(bytes);

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${NFT_STORAGE_API_KEY}`,
  };

  // Upload the image to IPFS
  const imageUpload = fetch(UPLOAD_ENDPOINT, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'image/jpg',
    },
    body: bytes,
  });

  // Upload the NFT metadata according the Metaplex Metadata specification,
  // including pre-computed cid of the image
  const metadataUpload = fetch(UPLOAD_ENDPOINT, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
      image: `https://ipfs.io/ipfs/${cid}`,
    }),
  });

  // Fire off both uploads aysnc
  return Promise.all([
    imageUpload.then(response => response.json()),
    metadataUpload.then(response => response.json()),
  ]);
}
