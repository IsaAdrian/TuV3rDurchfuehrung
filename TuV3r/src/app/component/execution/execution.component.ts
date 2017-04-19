import {Component, OnInit, Input, EventEmitter} from '@angular/core';
import {Team} from "../../entity/Team";
import {Tournament} from "../../entity/Tournament";
import {Match} from "../../entity/Match";
import {Result} from "../../entity/Result";
import {PostMatch} from "../../entity/PostMatch";
import {Rest} from "../../rest/rest";
import {Service} from "../../service/Service";

@Component({
  selector: 'app-execution',
  templateUrl: './execution.component.html',
  styleUrls: ['./execution.component.css'],
  providers: [Rest, Service]
})
export class ExecutionComponent implements OnInit {

  teams: Team[];
  @Input() selectedTournament: Tournament;
  selectedTournamentId: number;
  wildcardCount: number;
  matches: Match[];
  roundId: String = "";
  roundContent: number = 1;
  isFinale: boolean = false;
  isKleinesFinale: boolean = false;

  constructor(private _rest: Rest, private service: Service) {
  }

  ngOnInit() {
    this.getTeamsFromTournament()
  }

  getTeamsFromTournament(){
    this.teams = this.selectedTournament.teams;
    this.createMatches();
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
    var j = 0;

    for(; j < this.teams.length - this.wildcardCount; j+=2){
      this.matches.push(new Match(this.teams[j], this.teams[j+1], new Result(0, 0), this.selectedTournament));
    }

    for(; j < this.teams.length; j++){
      this.matches.push(new Match(this.teams[j], new Team(null,"Wildcard",null,false,null), new Result(1, 0), this.selectedTournament));
    }
  }

  finishMatch(match: Match){
    match.isWrong = false;

    if(match.result.pointsSecondTeam == match.result.pointsFirstTeam){
      match.isWrong = true;
      return;
    }

    match.isDisabled = true;
    this._rest.postMatch(new PostMatch(match.result, match.team1.id, match.team2.id,"A",this.roundId))
      .subscribe();
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
}
