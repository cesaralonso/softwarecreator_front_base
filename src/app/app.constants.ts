import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
  server: string = 'http://localhost:3000/';
  apiUrl = `${this.server}api/`;
}
