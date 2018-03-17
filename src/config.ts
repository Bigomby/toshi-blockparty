import * as joi from 'joi';

const envVarsSchema = joi
  .object({
    REDIS_URL: joi.string().default('redis://localhost:6379'),
    TOKEN_ID_ADDRESS: joi.string().required(),
  })
  .unknown()
  .required();

const { error, value } = joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export class Config {
  public static REDIS = {
    URI: value.REDIS_URL,
  };

  public static TOKEN = {
    ID_ADDRESS: value.TOKEN_ID_ADDRESS,
  };
}
