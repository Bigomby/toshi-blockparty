import * as joi from 'joi';

import { PrivateKey } from './utils/private-key';

const envVarsSchema = joi
  .object({
    REDIS_URL: joi.string().default('redis://localhost:6379'),
    TOSHI_APP_SEED: joi.string().required(),
  })
  .unknown()
  .required();

const { error, value } = joi.validate(process.env, envVarsSchema);
if (error) {
  throw Error(`Config validation error: ${error.message}`);
}

const rootKey = PrivateKey.FromMnemonic(value.TOSHI_APP_SEED);
if (!rootKey) {
  throw Error('Error generating keys from mnemonic');
}

export class Config {
  public static REDIS = {
    URI: value.REDIS_URL,
  };

  public static TOKEN = {
    IDENTITY_KEY: rootKey.deriveFromPath("m/0'/1/0"),
    PAYMENT_KEY: rootKey.deriveFromPath("m/44'/60'/0'/0/0"),
  };
}
