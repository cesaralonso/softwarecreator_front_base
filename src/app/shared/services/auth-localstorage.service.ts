import { LocalStorageService } from 'angular-2-local-storage';
import { Injectable } from '@angular/core';


@Injectable()
export class AuthLocalstorage {

    constructor(private localStorageService: LocalStorageService) {
    }

    toInt(tochange: any): number {
        return +tochange;
    }

    clearAll(): void {
        this.localStorageService.clearAll();
    }

}