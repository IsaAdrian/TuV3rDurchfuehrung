import {Team} from "./Team";
import {} from "./Result";

import {Tournament} from "./Tournament";
import {Result} from "./Result";
/**
 * Created by Adrian on 13.02.17.
 */

export class Match {
  public isDisabled: boolean = false;
  public isWrong: boolean = false;
  public id: number = 0;
  constructor (public team1: Team,
               public team2: Team,
               public result: Result,
               public tournament: Tournament
  ){ }
}
