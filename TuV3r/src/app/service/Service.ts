/**
 * Created by Adrian on 18.04.17.
 */

import {Injectable, EventEmitter} from "@angular/core";

@Injectable()
export class Service {

  emitter: EventEmitter<any> = new EventEmitter();

  constructor() { }

  getEmitter() {
    return this.emitter;
  }

}
