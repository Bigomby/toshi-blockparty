import { Component } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

const BASE_URL = 'https://identity.development.service.toshi.org';
const USER_URL = '/v1/user';
const SEARCH_USER_URL = '/v1/search/user';

@Component()
export class IdentityService {
  private readonly http = axios.create({ baseURL: BASE_URL });

  public async getUser(id: string) {
    const res = await this.http.get(`${USER_URL}/${id}`);
    return res.data;
  }

  public async paymentAddressReverseLookup(address: string): Promise<any> {
    const res = await this.http.get(SEARCH_USER_URL, {
      params: { payment_address: address },
    });

    return res.data.results.pop();
  }
}
