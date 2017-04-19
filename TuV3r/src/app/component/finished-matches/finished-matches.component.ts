import {Component, OnInit, Input} from '@angular/core';
import {Match} from "../../entity/Match";

@Component({
  selector: 'app-finished-matches',
  templateUrl: './finished-matches.component.html',
  styleUrls: ['./finished-matches.component.css']
})
export class FinishedMatchesComponent implements OnInit {

  @Input() finishedMatches: Match[];

  constructor() { }

  ngOnInit() {
  }

}
