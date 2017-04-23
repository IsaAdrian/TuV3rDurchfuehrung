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

  constructor (private _http: Http){ }

  getTournaments(): Observable<Tournament[]>{
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.get("http://vm15.htl-leonding.ac.at:8090/Turnierverwaltung/rs/tournament", options)
      .map(res => res.json() as Tournament[]);
  }

  postMatch(match: PostMatch): Observable<Match>{
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post('http://vm15.htl-leonding.ac.at:8090/Turnierverwaltung/rs/match', match, options)
      .map(res => res.json() as Match);
  }

  putMatchResult(result: Result, id: number){
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    let resultString = "{ \"result\":" + JSON.stringify(result) + "}";

    console.log(resultString);

    return this._http.put("http://vm15.htl-leonding.ac.at:8090/Turnierverwaltung/rs/match/" + String(id), resultString, options)
      .map(res => res.json());
  }

  putMatchStartTime(id: number){
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    let date = new Date();
    var timeString = "{ \"startTime\": \"" + String(date.getHours())+":";
    if(date.getMinutes() < 10){
      timeString += "0";
    }
    timeString += (String(date.getMinutes()) + "\" }");

    return this._http.put("http://vm15.htl-leonding.ac.at:8090/Turnierverwaltung/rs/match/" + String(id), timeString, options)
      .map(res => res.json());
  }

  postRound(roundContent: String, tournamentId: number): Observable<String>{
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    let roundString = "{\"name\":" + roundContent + ",\"toId\": " + String(tournamentId) + " }";

    return this._http.post('http://vm15.htl-leonding.ac.at:8090/Turnierverwaltung/rs/round', roundString, options)
      .map(res => res.json() as String);
  }

  upDateTournament(tournamentId: number) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.put("http://vm15.htl-leonding.ac.at:8090/Turnierverwaltung/rs/tournament/" + String(tournamentId),
      "false", options)
      .map(res => res.json());
  }
}
