import {Component, OnInit, Input} from '@angular/core';
import {Team} from "../../entity/Team";
import {Tournament} from "../../entity/Tournament";
import {Match} from "../../entity/Match";
import {Result} from "../../entity/Result";
import {PostMatch} from "../../entity/PostMatch";
import {Rest} from "../../rest/rest";
import {Service} from "../../service/Service";
import {isNumeric} from "rxjs/util/isNumeric";

@Component({
  selector: 'app-execution',
  templateUrl: './execution.component.html',
  styleUrls: ['./execution.component.css'],
  providers: [Rest, Service]
})
export class ExecutionComponent implements OnInit {

  teams: Team[];
  @Input() selectedTournament: Tournament;
  matches: Match[];
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

  constructor(private _rest: Rest) {
  }

  ngOnInit() {
    this.getTeamsFromTournament()
  }

  getTeamsFromTournament(){
    this.teams = this.selectedTournament.teams;
    this.newRound();
  }

  getWildcardCount(teamcount: number){
    var i = 1;
    for(; Math.pow(2,i) < teamcount; i++){
    }
    this.wildcardCount = Math.pow(2,i) - teamcount;
  }

  createMatches(){
    this.getWildcardCount(this.teams.length);
    this.matches = [];
    this.postedMatches = [];
    var j = 0;

    for(; j < this.teams.length - this.wildcardCount; j+=2){
      this.matches.push(new Match(this.teams[j], this.teams[j+1], new Result(0, 0), this.selectedTournament));
    }

    for(; j < this.teams.length; j++){
      this.matches.push(new Match(this.teams[j], new Team(1,"Wildcard",0,false,null), new Result(1, 0), this.selectedTournament));
    }
    this.postMatches(this.matches);
    this.matchesCreated = true;
  }

  postMatches(matches: Match[]){
    for (let match of matches) {
      this._rest.postMatch(new PostMatch(match.result, match.team1.id, match.team2.id, this.court, this.roundId))
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

  putMatch(match : Match){
    match.isWrong = false;
    if(match.result.pointsSecondTeam == match.result.pointsFirstTeam
      || !isNumeric(match.result.pointsFirstTeam)
      || !isNumeric(match.result.pointsSecondTeam)){
      match.isWrong = true;
      return;
    }
    match.isDisabled = true;

    this._rest.putMatch(match.result, match.id)
      .subscribe();

    if(this.finishedMatches.indexOf(match) == -1){
      this.finishedMatches.unshift(match);
    }
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
    }
    if(this.teams.length == 0){
      this.createFinaleMatch()
    }
  }

  createFinaleMatch(){
    this.isFinished = true;
    this.isKleinesFinale = false;
    this.teams = this.finaleTeams;
    this.newRound();
    this.isFinale = true;
  }

  newRound(){
    this.roundContent++;
    this._rest.postRound(String(this.roundContent), this.selectedTournament.id)
      .subscribe(
        data => {
          this.roundId = data;
          this.createMatches();
        }
      );
  }

  backToTournaments(){
    this.canBack = false;
    this.matchesCreated = false;
  }

  up(match, whichteam){
    match.isWrong = false;
    if(whichteam == 1){
      match.result.pointsFirstTeam++;
    }
    else{
      match.result.pointsSecondTeam++;
    }
  }

  down(match, whichteam){
    match.isWrong = false;
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
    this._rest.upDateTournament(this.selectedTournament.id).subscribe();
    this.isFinale = false;
    //window.location.href = 'http://vm15.htl-leonding.ac.at:8090/Turnierverwaltung/ng/index.html';
  }
}
