import { Injectable } from '@angular/core';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaState, selectMinaState } from '@app/app.setup';
import { TracingOverviewService } from '@tracing/tracing-overview/tracing-overview.service';
import {
  TRACING_OVERVIEW_CLOSE,
  TRACING_OVERVIEW_FILTER,
  TRACING_OVERVIEW_GET_CHECKPOINTS,
  TRACING_OVERVIEW_GET_CHECKPOINTS_SUCCESS,
  TRACING_OVERVIEW_GET_DEPLOYMENTS,
  TRACING_OVERVIEW_GET_DEPLOYMENTS_SUCCESS,
  TRACING_OVERVIEW_GET_NODES,
  TRACING_OVERVIEW_GET_NODES_SUCCESS,
  TracingOverviewActions,
  TracingOverviewClose,
  TracingOverviewFilter,
  TracingOverviewGetCheckpoints,
  TracingOverviewGetDeployments,
  TracingOverviewGetNodes,
} from '@tracing/tracing-overview/tracing-overview.actions';
import { EMPTY, map, switchMap } from 'rxjs';
import { TracingOverviewCheckpoint } from '@shared/types/tracing/overview/tracing-overview-checkpoint.type';
import { catchErrorAndRepeat } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import { TracingOverviewCheckpointFilter } from '@app/shared/types/tracing/overview/tracing-overview-checkpoint-filter.type';

@Injectable({
  providedIn: 'root',
})
export class TracingOverviewEffects extends MinaBaseEffect<TracingOverviewActions> {

  readonly getCheckpoints$: Effect;
  readonly getDeployments$: Effect;
  readonly getNodes$: Effect;

  constructor(private actions$: Actions,
              private tracingOverviewService: TracingOverviewService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.getCheckpoints$ = createEffect(() => this.actions$.pipe(
      ofType(TRACING_OVERVIEW_FILTER),
      this.latestActionState<TracingOverviewFilter>(),
      switchMap(({ action }) =>
        this.tracingOverviewService.getStatistics(
          {
            deployment: action.payload.deployment,
            name: action.payload.name,
          }
        ),
      ),
      map((payload: TracingOverviewCheckpoint[]) => ({ type: TRACING_OVERVIEW_GET_CHECKPOINTS_SUCCESS, payload })),
      catchErrorAndRepeat(MinaErrorType.GRAPH_QL, TRACING_OVERVIEW_GET_CHECKPOINTS_SUCCESS, []),
    ));

    this.getDeployments$ = createEffect(() => this.actions$.pipe(
      ofType(TRACING_OVERVIEW_GET_DEPLOYMENTS, TRACING_OVERVIEW_CLOSE),
      this.latestActionState<TracingOverviewGetDeployments | TracingOverviewClose>(),
      switchMap(({ action }) =>
        action.type === TRACING_OVERVIEW_CLOSE
          ? EMPTY
          : this.tracingOverviewService.getDeployments(),
      ),
      map((payload: number[]) => ({ type: TRACING_OVERVIEW_GET_DEPLOYMENTS_SUCCESS, payload })),
      catchErrorAndRepeat(MinaErrorType.GRAPH_QL, TRACING_OVERVIEW_GET_DEPLOYMENTS_SUCCESS, []),
    ));

    this.getNodes$ = createEffect(() => this.actions$.pipe(
      ofType(TRACING_OVERVIEW_GET_NODES),
      this.latestActionState<TracingOverviewGetNodes>(),
      switchMap(({ action }) => this.tracingOverviewService.getNodes(action.payload)),
      map((payload: TracingOverviewCheckpointFilter[]) => ({ type: TRACING_OVERVIEW_GET_NODES_SUCCESS, payload })),
      catchErrorAndRepeat(MinaErrorType.GRAPH_QL, TRACING_OVERVIEW_GET_NODES_SUCCESS, []),
    ));
  }
}
