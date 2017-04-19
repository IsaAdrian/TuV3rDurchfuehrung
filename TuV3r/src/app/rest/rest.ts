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

    return this._http.get("http://vm15.htl-leonding.ac.at:8090/Turnierverwaltung/rs/tournament", options).map(res => res.json() as Tournament[]);
  }

  postMatch(match: PostMatch): Observable<Match>{
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post('http://vm15.htl-leonding.ac.at:8090/Turnierverwaltung/rs/match', match, options).map(res => res.json() as Match);
  }

  putMatch(result: Result, id: number){
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    console.log("URL: " + "http://vm15.htl-leonding.ac.at:8090/Turnierverwaltung/rs/match/" + String(id));

    return this._http.put("http://vm15.htl-leonding.ac.at:8090/Turnierverwaltung/rs/match/" + String(id), result, options).map(res => res.json());;
  }

  postRound(content: String): Observable<String>{
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post('http://vm15.htl-leonding.ac.at:8090/Turnierverwaltung/rs/round', content, options).map(res => res.json() as String);
  }

  upDateTournament(tournamentId: number) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    console.log("http://vm15.htl-leonding.ac.at:8090/Turnierverwaltung/rs/tournament/" + String(tournamentId));
    return this._http.put("http://vm15.htl-leonding.ac.at:8090/Turnierverwaltung/rs/tournament/" + String(tournamentId), { "active" : false }, options);
  }
}
