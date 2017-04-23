/**
 * Created by Adrian on 27.03.17.
 */
import {Team} from "./Team";
import {} from "./Result";

import {Tournament} from "./Tournament";
import {Result} from "./Result";
/**
 * Created by Adrian on 13.02.17.
 */

export class PostMatch {
  constructor (
    public result: Result,
    public team1Id: number,
    public team2Id: number,
    public court: String,
    public roundId: String,
    public startTime: String
  ){ }
}2
