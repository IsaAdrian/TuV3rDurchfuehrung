/**
 * Created by Adrian on 06.02.17.
 */

import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Tournament} from "../entity/Tournament";
import {Observable} from "rxjs";
import {Match} from "../entity/Match";
import {PostMatch} from "../entity/PostMatch";
import {Result} from "../entity/Result";

@Injectable()
export class Rest {
  URL = "http://" + window.location.host + "/Turnierverwaltung/rs/";

  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });

  constructor (private _http: Http){ }

  getTournaments(): Observable<Tournament[]>{
    return this._http.get(this.URL + "tournament", this.options).map(res => res.json() as Tournament[]);
  }

  postMatch(match: PostMatch): Observable<Match>{
    return this._http.post(this.URL + "match", match, this.options).map(res => res.json() as Match);
  }

  putMatchResult(result: Result, id: number){
    let resultString = "{ \"result\":" + JSON.stringify(result) + ", \"active\":false }";

    console.log(resultString);

    return this._http.put(this.URL + "match/" + String(id), resultString, this.options).map(res => res.json());
  }

  postRound(roundContent: String, tournamentId: number): Observable<String>{
    let roundString = "{\"name\":" + roundContent + ",\"toId\": " + String(tournamentId) + " }";

    return this._http.post(this.URL+ "round", roundString, this.options).map(res => res.json() as String);
  }

  upDateTournament(tournamentId: number) {
    return this._http.put(this.URL + "tournament/" + String(tournamentId), "false", this.options).map(res => res.json());
  }
}
