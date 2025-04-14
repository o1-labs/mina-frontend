import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { map, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { EXPERIMENTS_GET, EXPERIMENTS_GET_SUCCESS, ExperimentsActions } from './experiments.actions';
import { ExperimentsService } from '@app/services/experiments.service';
import { Experiment } from '@app/shared/types/experiments/experiments.type';

@Injectable({
  providedIn: 'root',
})
export class ExperimentsEffects extends MinaBaseEffect<ExperimentsActions> {

  readonly getExps$: Effect;

  constructor(private actions$: Actions,
              private experimentsService: ExperimentsService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.getExps$ = createEffect(() => this.actions$.pipe(
      ofType(EXPERIMENTS_GET),
      switchMap(() => 
        this.experimentsService.getExperiments()),
      map((payload: Experiment[]) => ({ type: EXPERIMENTS_GET_SUCCESS, payload })),
    ));
  }
}
