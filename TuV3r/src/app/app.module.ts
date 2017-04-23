import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { FinishedMatchesComponent } from './component/finished-matches/finished-matches.component';
import { TournamentListComponent } from './component/tournament-list/tournament-list.component';
import { ExecutionComponent } from './component/execution/execution.component';
import { CreationframeComponent } from './component/creationframe/creationframe.component';
import { RouterModule } from "@angular/router";
import { EvalframeComponent } from './component/evalframe/evalframe.component';
import { IndexframeComponent } from './component/indexframe/indexframe.component';

@NgModule({
  declarations: [
    AppComponent,
    FinishedMatchesComponent,
    TournamentListComponent,
    ExecutionComponent,
    CreationframeComponent,
    EvalframeComponent,
    IndexframeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      {path:'',redirectTo:'index',pathMatch:'full'},
      {path:'index',component:IndexframeComponent},
      {path:'create',component:CreationframeComponent},
      {path:'exe',component:TournamentListComponent},
      {path:'eval',component:EvalframeComponent}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
