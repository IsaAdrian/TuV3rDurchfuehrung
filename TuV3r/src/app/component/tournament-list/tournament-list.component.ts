import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {Tournament} from "../../entity/Tournament";
import {Team} from "../../entity/Team";
import {Rest} from "../../rest/rest";
import {Service} from "../../service/Service";

@Component({
  selector: 'app-tournament-list',
  templateUrl: './tournament-list.component.html',
  styleUrls: ['./tournament-list.component.css'],
  providers: [Rest, Service]
})

export class TournamentListComponent implements OnInit {
  tournaments: Tournament[];
  selectedTournament: Tournament;
  tournamentChosen: boolean = false;

  constructor(private _rest: Rest, private service: Service) { }

  ngOnInit() {
    this.tournaments = [];
    this._rest.getTournaments()
      .subscribe(
        data => {
          this.tournaments = data;
          this.tournaments = this.tournaments.filter(t => t.active == true);
        }
      );
  }

  getTeamsByTournamentId(tournamentIndex: number){
    this.selectedTournament = this.tournaments[tournamentIndex];
    for(var i = 0; i < this.tournaments.length; i++){
      this.tournaments[i].isToggled = false;
    }
    this.tournaments[tournamentIndex].isToggled = true;
  }

  startTournament(){
    //this.service.getEmitter().emit(this.selectedTournament);
    this.tournamentChosen = true;
  }
}
