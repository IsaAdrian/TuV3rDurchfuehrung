/**
 * Created by Adrian on 09.02.17.
 */

export class Team {
  constructor (public id: number,
               public name: string,
               public rank: number,
               public occupied: boolean,
               public group: string
  ){ }
}
