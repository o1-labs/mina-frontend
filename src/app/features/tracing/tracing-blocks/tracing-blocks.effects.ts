import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { catchErrorAndRepeat } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import { Effect } from '@shared/types/store/effect.type';
import { TracingBlockTrace } from '@shared/types/tracing/blocks/tracing-block-trace.type';
import { TracingTraceGroup } from '@shared/types/tracing/blocks/tracing-trace-group.type';
import {
  TRACING_BLOCKS_CLOSE,
  TRACING_BLOCKS_GET_DEPLOYMENTS,
  TRACING_BLOCKS_GET_DEPLOYMENTS_SUCCESS,
  TRACING_BLOCKS_GET_DETAILS,
  TRACING_BLOCKS_GET_DETAILS_SUCCESS,
  TRACING_BLOCKS_GET_NODES,
  TRACING_BLOCKS_GET_NODES_SUCCESS,
  TRACING_BLOCKS_GET_TRACES,
  TRACING_BLOCKS_GET_TRACES_SUCCESS,
  TRACING_BLOCKS_SELECT_ROW,
  TracingBlocksActions,
  TracingBlocksClose,
  TracingBlocksFilter,
  TracingBlocksGetDeployments,
  TracingBlocksGetNodes,
  TracingBlocksGetTraces,
  TracingBlocksSelectRow,
} from '@tracing/tracing-blocks/tracing-blocks.actions';
import { TracingBlocksService } from '@tracing/tracing-blocks/tracing-blocks.service';
import { EMPTY, filter, map, switchMap } from 'rxjs';
import { TRACING_OVERVIEW_GET_NODES_SUCCESS } from '../tracing-overview/tracing-overview.actions';
import { TracingBlockFilter } from '@app/shared/types/tracing/blocks/tracing-block-filter.type';

@Injectable({
  providedIn: 'root',
})
export class TracingBlocksEffects extends MinaBaseEffect<TracingBlocksActions> {
  readonly getTraces$: Effect;
  readonly selectTrace$: Effect;
  readonly getTraceDetails$: Effect;
  readonly getDeployments$: Effect;
  readonly getNodes$: Effect;

  constructor(
    private actions$: Actions,
    private tracingBlocksService: TracingBlocksService,
    store: Store<MinaState>
  ) {
    super(store, selectMinaState);

    this.getTraces$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TRACING_BLOCKS_GET_TRACES),
        this.latestActionState<TracingBlocksGetTraces>(),
        switchMap(({ action }) =>
          this.tracingBlocksService.getTraces( action.payload )
        ),
        map((payload: TracingBlockTrace[]) => ({
          type: TRACING_BLOCKS_GET_TRACES_SUCCESS,
          payload,
        })),
        catchErrorAndRepeat(
          MinaErrorType.GRAPH_QL,
          TRACING_BLOCKS_GET_TRACES_SUCCESS,
          []
        )
      )
    );

    this.selectTrace$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TRACING_BLOCKS_SELECT_ROW),
        this.latestActionState<TracingBlocksSelectRow>(),
        filter(({ state }) => !!state.tracing.blocks.activeTrace),
        map(() => ({ type: TRACING_BLOCKS_GET_DETAILS }))
      )
    );

    this.getTraceDetails$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TRACING_BLOCKS_SELECT_ROW, TRACING_BLOCKS_CLOSE),
        this.latestActionState<TracingBlocksSelectRow | TracingBlocksClose>(),
        filter(({ state }) => !!state.tracing.blocks.activeTrace),
        switchMap(({ action }) =>
          action.type === TRACING_BLOCKS_CLOSE
            ? EMPTY
            : this.tracingBlocksService.getBlockTraceGroups(action.payload.trace.hash, action.payload.filter)
        ),
        map((payload: TracingTraceGroup[]) => ({
          type: TRACING_BLOCKS_GET_DETAILS_SUCCESS,
          payload,
        })),
        catchErrorAndRepeat(
          MinaErrorType.GRAPH_QL,
          TRACING_BLOCKS_GET_DETAILS_SUCCESS,
          []
        )
      )
    );

      this.getDeployments$ = createEffect(() => this.actions$.pipe(
          ofType(TRACING_BLOCKS_GET_DEPLOYMENTS),
          this.latestActionState<TracingBlocksGetDeployments>(),
          switchMap(() => this.tracingBlocksService.getDeployments(),
          ),
          map((payload: number[]) => ({ type: TRACING_BLOCKS_GET_DEPLOYMENTS_SUCCESS, payload })),
          catchErrorAndRepeat(MinaErrorType.GRAPH_QL, TRACING_BLOCKS_GET_DEPLOYMENTS_SUCCESS, []),
        ));
    
        this.getNodes$ = createEffect(() => this.actions$.pipe(
          ofType(TRACING_BLOCKS_GET_NODES),
          this.latestActionState<TracingBlocksGetNodes>(),
          switchMap(({ action }) => this.tracingBlocksService.getNodes(action.payload)),
          map((payload: TracingBlockFilter[]) => ({ type: TRACING_BLOCKS_GET_NODES_SUCCESS, payload })),
          catchErrorAndRepeat(MinaErrorType.GRAPH_QL, TRACING_OVERVIEW_GET_NODES_SUCCESS, []),
        ));
  }
}
