import {Team} from "./Team";
/**
 * Created by Adrian on 20.03.17.
 */

export class Tournament {
  public isToggled: boolean;

  constructor (public id: number,
               public name: string,
               public date: string,
               public pointsWin: string,
               public pointsDraw: string,
               public groupSize: string,
               public groupPhase: string,
               public system: string,
               public teams: Team[],
               public active: boolean
  ){ }
}
