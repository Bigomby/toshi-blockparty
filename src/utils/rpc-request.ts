const JSON_RPC_VER = '2.0';

export class RPCRequest {
  private static readonly version = JSON_RPC_VER;
  private static reqId = 0;

  private constructor(
    private readonly _id: number,
    private readonly method: string,
    private readonly params: { [key: string]: string },
  ) {}

  public stringify(): string {
    return JSON.stringify({
      jsonrpc: RPCRequest.version,
      id: this.id,
      method: this.method,
      params: this.params,
    });
  }

  public static Create(method: string, params: { [key: string]: string }) {
    return new RPCRequest(this.reqId++, method, params);
  }

  get id() {
    return this._id;
  }
}
