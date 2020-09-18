import { Injector } from '@angular/core';

export class MyInjector {
    static injector: Injector;

    static init(injector: Injector): void {
        MyInjector.injector = injector;
    }

    // tslint:disable: no-any
    static get(token: any): any {
        // tslint:disable-next-line: deprecation
        return MyInjector.injector.get(token);
    }
}
