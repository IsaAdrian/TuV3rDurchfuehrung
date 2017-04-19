import { Component, OnInit } from '@angular/core';
import { Rest } from "../../rest/rest";
import { Match } from "../../entity/Match";
import { Team } from "../../entity/Team";
import {Result} from "../../entity/Result";
import { Tournament } from "../../entity/Tournament";
import {PostMatch} from "../../entity/PostMatch";
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.css'],
  providers: [Rest]
})
export class TournamentComponent implements OnInit{
  data: String = "";
  teams: Team[];
  matches: Match[];
  tournaments: Tournament[];
  selectTournament: Tournament;
  selectedTournamentId : number = 0;
  wildcardCount: number;
  matchesCreated: boolean = false;
  isFinished: boolean = false;
  canBack: boolean = false;
  roundId: String = "";
  roundContent: number = 0;
  isKleinesFinale: boolean = false;
  isFinale: boolean = false;
  finaleTeams: Team[] = [];
  postedMatches: Match[] = [];
  finishedMatches: Match[] = [];
  court: String = "Platz 1";
  postMatch: Match;

  constructor(private _rest: Rest){
  }

  ngOnInit(){
    this.tournaments = [];
    this._rest.getTournaments()
      .subscribe(
        data => {
          this.tournaments = data;
          this.tournaments = this.tournaments.filter(t => t.active == true);
          this.data = String(this.tournaments.length);
        }
      );
  }

  getWildcardCount(teamcount: number){
    var i = 1;
    for(; Math.pow(2,i) < teamcount; i++){
    }
    this.wildcardCount = Math.pow(2,i) - teamcount;
  }

  startTournament(){
    this.matchesCreated = true;
    this.canBack = true;
    this.newRound();
    this.createMatches();
  }

  getTeamsByTournamentId(tournamentIndex: number){
    this.selectedTournamentId = this.tournaments[tournamentIndex].id;
    this.selectTournament = this.tournaments[tournamentIndex];
    this.teams = [];
    this.teams = this.tournaments[tournamentIndex].teams;

    for(var i = 0; i < this.tournaments.length; i++){
      this.tournaments[i].isToggled = false;
    }
    this.tournaments[tournamentIndex].isToggled = true;
  }

  createMatches(){
    this.getWildcardCount(this.teams.length);
    this.matches = [];
    this.postedMatches = [];
    var j = 0;

    for(; j < this.teams.length - this.wildcardCount; j+=2){
      this.matches.push(new Match(this.teams[j], this.teams[j+1], new Result(0, 0), this.selectTournament));
    }

    for(; j < this.teams.length; j++){
      this.matches.push(new Match(this.teams[j], new Team(1,"Wildcard",0,false,null), new Result(1, 0), this.selectTournament));
    }
    this.postMatches(this.matches);
  }

  postMatches(matches: Match[]){

    for (let match of matches) {
      this._rest.postMatch(new PostMatch(match.result, match.team1.id, match.team2.id, this.court,this.roundId))
        .subscribe(
          data => {
            this.postMatch = new Match(data.team1, data.team2, new Result(data.result[0], data.result[2]), data.tournament);
            this.postMatch.id = data.id;
            this.postedMatches.push(this.postMatch);
            this.matches = this.postedMatches;
          }
        );

      if(this.court == "Platz 1"){
        this.court = "Platz 2"
      }
      else{
        this.court = "Platz 1"
      }
    }
  }

  finishMatch(match: Match){
    this.finishedMatches.unshift(match);
    match.isWrong = false;
    if(match.result.pointsSecondTeam == match.result.pointsFirstTeam){
      match.isWrong = true;
      return;
    }
    this.canBack = false;

    this._rest.postMatch(new PostMatch(match.result, match.team1.id, match.team2.id,"A",this.roundId))
      .subscribe();
  }

  putMatch(match : Match){
    match.isWrong = false;
    if(match.result.pointsSecondTeam == match.result.pointsFirstTeam){
      match.isWrong = true;
      return;
    }

    console.log("MatchId: " + String(match.id));
    console.log("PointsFirstTeam: " + String(match.result.pointsFirstTeam));
    console.log("PointsSecondTeam: " + String(match.result.pointsSecondTeam));

    this._rest.putMatch(match.result, match.id);
  }

  nextRound(){
    this.canBack = false;
    this.teams = [];
    if(!this.isKleinesFinale){
      for(var i = 0; i < this.matches.length; i++){
        if(this.matches[i].result.pointsFirstTeam > this.matches[i].result.pointsSecondTeam){
          if(this.matches.length == 2){
            this.teams.push(this.matches[i].team2);
            this.finaleTeams.push(this.matches[i].team1);
          }
          else{
            this.teams.push(this.matches[i].team1);
          }
        }
        else{
          if(this.matches.length == 2){
            this.teams.push(this.matches[i].team1);
            this.finaleTeams.push(this.matches[i].team2);
          }
          else{
            this.teams.push(this.matches[i].team2);
          }
        }
        if(this.matches.length == 2){
          this.isKleinesFinale = true;
        }
      }
      this.newRound();
      this.createMatches();
    }
    if(this.teams.length == 0){
      this.createFinaleMatch()
    }
  }

  createFinaleMatch(){
    this.newRound();
    this.isFinished = true;
    this.isKleinesFinale = false;
    this.teams = this.finaleTeams;
    this.createMatches();
    this.isFinale = true;
  }

  newRound(){
    this.roundContent++;
    this._rest.postRound(String(this.roundContent))
      .subscribe(
        data => {this.roundId = data}
      );
  }

  backToTournaments(){
    this.canBack = false;
    this.matchesCreated = false;
  }

  up(match, whichteam){
    if(whichteam == 1){
      match.result.pointsFirstTeam++;
    }
    else{
      match.result.pointsSecondTeam++;
    }
  }

  down(match, whichteam){
    if(whichteam == 1){
      if(match.result.pointsFirstTeam > 0){
        match.result.pointsFirstTeam--;
      }
      else {
        match.isWrong = true;
      }
    }
    else{
      if(match.result.pointsSecondTeam > 0){
        match.result.pointsSecondTeam--;
      }
      else {
        match.isWrong = true;
      }
    }
  }

  finishTournament(){
    this._rest.upDateTournament(this.selectedTournamentId);
    this.isFinale = false;
    //window.location.href = 'http://vm15.htl-leonding.ac.at:8090/Turnierverwaltung/ng/index.html';
  }
}
