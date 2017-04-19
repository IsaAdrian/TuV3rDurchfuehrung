import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { FinishedMatchesComponent } from './component/finished-matches/finished-matches.component';
import { TournamentListComponent } from './component/tournament-list/tournament-list.component';
import { ExecutionComponent } from './component/execution/execution.component';

@NgModule({
  declarations: [
    AppComponent,
    FinishedMatchesComponent,
    TournamentListComponent,
    ExecutionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
