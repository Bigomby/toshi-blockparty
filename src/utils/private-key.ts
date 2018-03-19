import { keccak256 as k } from 'js-sha3';
import * as h from 'hash.js';
import * as bip39 from 'bip39';
import * as Elliptic from 'elliptic';

const CURVE = 'secp256k1';
const SEED = 'Bitcoin seed';

const hash = h as any;
const keccak256 = k as any;
const secp256k1 = new Elliptic.ec(CURVE);

function bnToBuffer(bn, len: number) {
  const buff = bn.toBuffer();

  if (buff.length > len) {
    throw Error('BN is too large to fit into requested length');
  }

  if (buff.length === len) {
    return buff;
  }

  const filledBuff = new Buffer(len).fill(0);
  buff.copy(filledBuff, 32 - buff.length);

  return filledBuff;
}

function getPriv(keypair, digest) {
  const priv = secp256k1.keyFromPrivate(digest.slice(0, 32)).getPrivate();

  return priv.add(keypair.getPrivate()).mod(secp256k1.curve.n);
}

function getDigest(element: string, keypair, chaincode) {
  const hmac = hash.hmac(hash.sha512, chaincode);

  if (element.endsWith("'") || element.endsWith('h')) {
    const n = parseInt(element.split("'")[0]);

    hmac.update([0]);
    hmac.update(bnToBuffer(keypair.getPrivate(), 32));
    hmac.update(hash.utils.split32([n + (1 << 31)], 'big'));
  } else {
    const n = parseInt(element);
    const pubkey = keypair.getPublic().encode('', true);

    hmac.update(pubkey);
    hmac.update(hash.utils.split32([n], 'big'));
  }

  return hmac.digest();
}

function nextKeypair(previous, { element }) {
  const digest = getDigest(element, previous.keypair, previous.chaincode);
  const priv = getPriv(previous.keypair, digest);

  return {
    keypair: secp256k1.keyFromPrivate(bnToBuffer(priv, 32)),
    chaincode: digest.slice(32),
  };
}

export class PrivateKey {
  private constructor(private readonly keypair, private readonly chaincode) {}

  public static FromMnemonic(mnemonic: string): PrivateKey {
    const seed = bip39.mnemonicToSeedHex(mnemonic);
    const hmac = hash.hmac(hash.sha512, SEED);

    hmac.update(seed, 'hex');
    const digest = hmac.digest();

    const keypair = secp256k1.keyFromPrivate(digest.slice(0, 32));
    const chaincode = digest.slice(32);

    return new PrivateKey(keypair, chaincode);
  }

  public deriveFromPath(path: string): PrivateKey {
    const { keypair, chaincode } = path
      .split('/')
      .filter(element => element !== 'm')
      .map(element => ({ element }))
      .reduce(nextKeypair, {
        keypair: this.keypair,
        chaincode: this.chaincode,
      });

    return new PrivateKey(keypair, chaincode);
  }

  public sign(data): string {
    const datahash = keccak256(data);
    const sig = this.keypair.sign(datahash, { canonical: true });

    const r = hash.utils.toHex(bnToBuffer(sig.r, 32));
    const s = hash.utils.toHex(bnToBuffer(sig.s, 32));
    const rp = hash.utils.toHex([sig.recoveryParam]);

    return `0x${r}${s}${rp}`;
  }

  get address(): string {
    const pub = this.keypair.getPublic().encode('', false);
    const address = keccak256.array(pub.slice(1)).slice(12, 32);

    return `0x${hash.utils.toHex(address)}`;
  }
}
