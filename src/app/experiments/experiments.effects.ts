import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { filter, map, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { EXPERIMENTS_GET, EXPERIMENTS_GET_DETAILS, EXPERIMENTS_GET_DETAILS_SUCCESS, EXPERIMENTS_GET_SUCCESS, EXPERIMENTS_SELECT_ROW, ExperimentsActions, ExperimentsGetDetails, ExperimentsSelectRow } from './experiments.actions';
import { ExperimentsService } from '@app/services/experiments.service';
import { Experiment } from '@app/shared/types/experiments/experiments.type';
import { ExperimentDetails } from '@app/shared/types/experiments/experiments-details.type';

@Injectable({
  providedIn: 'root',
})
export class ExperimentsEffects extends MinaBaseEffect<ExperimentsActions> {

  readonly getExps$: Effect;
  readonly selectExperiment$: Effect;
  readonly getExperimentDetails$: Effect;

  constructor(private actions$: Actions,
              private experimentsService: ExperimentsService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.selectExperiment$ = createEffect(() =>
      this.actions$.pipe(
        ofType(EXPERIMENTS_SELECT_ROW),
        this.latestActionState<ExperimentsSelectRow>(),
        filter(({ action, state }) => !!action.payload?.experiment),
        map(({ action }) => ({ 
          type: EXPERIMENTS_GET_DETAILS, 
          payload: { experiment: action.payload.experiment } 
        }))
      )
    );

    this.getExperimentDetails$ = createEffect(() =>
      this.actions$.pipe(
        ofType(EXPERIMENTS_GET_DETAILS),
        this.latestActionState<ExperimentsGetDetails>(),
        switchMap(({ action }) =>
          this.experimentsService.getExperimentDetails(action.payload.experiment.exp)
        ),
        map((payload: ExperimentDetails[]) => ({ 
          type: EXPERIMENTS_GET_DETAILS_SUCCESS, 
          payload: payload[0] || null 
        }))
      )
    );

    this.getExps$ = createEffect(() => this.actions$.pipe(
      ofType(EXPERIMENTS_GET),
      switchMap(() => 
        this.experimentsService.getExperiments()),
      map((payload: Experiment[]) => ({ type: EXPERIMENTS_GET_SUCCESS, payload })),
    ));
  }
}
