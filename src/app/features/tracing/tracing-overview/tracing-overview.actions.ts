import { FeatureAction } from '@shared/types/store/feature-action.type';
import { TracingOverviewCheckpoint } from '@shared/types/tracing/overview/tracing-overview-checkpoint.type';
import { SortDirection } from '@shared/types/shared/table-sort.type';
import { TracingOverviewCheckpointFilter } from '@app/shared/types/tracing/overview/tracing-overview-checkpoint-filter.type';

enum TracingOverviewActionTypes {
  TRACING_OVERVIEW_GET_CHECKPOINTS = 'TRACING_OVERVIEW_GET_CHECKPOINTS',
  TRACING_OVERVIEW_GET_CHECKPOINTS_SUCCESS = 'TRACING_OVERVIEW_GET_CHECKPOINTS_SUCCESS',
  TRACING_OVERVIEW_GET_DEPLOYMENTS = 'TRACING_OVERVIEW_GET_DEPLOYMENTS',
  TRACING_OVERVIEW_GET_DEPLOYMENTS_SUCCESS = 'TRACING_OVERVIEW_GET_DEPLOYMENTS_SUCCESS',
  TRACING_OVERVIEW_GET_NODES = 'TRACING_OVERVIEW_GET_NODES',
  TRACING_OVERVIEW_GET_NODES_SUCCESS = 'TRACING_OVERVIEW_GET_NODES_SUCCESS',
  TRACING_OVERVIEW_SORT = 'TRACING_OVERVIEW_SORT',
  TRACING_OVERVIEW_TOGGLE_CONDENSED_VIEW = 'TRACING_OVERVIEW_TOGGLE_CONDENSED_VIEW',
  TRACING_OVERVIEW_CLOSE = 'TRACING_OVERVIEW_CLOSE',
  TRACING_OVERVIEW_FILTER = 'TRACING_OVERVIEW_FILTER',
}

export const TRACING_OVERVIEW_GET_CHECKPOINTS = TracingOverviewActionTypes.TRACING_OVERVIEW_GET_CHECKPOINTS;
export const TRACING_OVERVIEW_GET_CHECKPOINTS_SUCCESS = TracingOverviewActionTypes.TRACING_OVERVIEW_GET_CHECKPOINTS_SUCCESS;
export const TRACING_OVERVIEW_GET_DEPLOYMENTS = TracingOverviewActionTypes.TRACING_OVERVIEW_GET_DEPLOYMENTS;
export const TRACING_OVERVIEW_GET_DEPLOYMENTS_SUCCESS = TracingOverviewActionTypes.TRACING_OVERVIEW_GET_DEPLOYMENTS_SUCCESS;
export const TRACING_OVERVIEW_GET_NODES = TracingOverviewActionTypes.TRACING_OVERVIEW_GET_NODES;
export const TRACING_OVERVIEW_GET_NODES_SUCCESS = TracingOverviewActionTypes.TRACING_OVERVIEW_GET_NODES_SUCCESS;
export const TRACING_OVERVIEW_SORT = TracingOverviewActionTypes.TRACING_OVERVIEW_SORT;
export const TRACING_OVERVIEW_TOGGLE_CONDENSED_VIEW = TracingOverviewActionTypes.TRACING_OVERVIEW_TOGGLE_CONDENSED_VIEW;
export const TRACING_OVERVIEW_CLOSE = TracingOverviewActionTypes.TRACING_OVERVIEW_CLOSE;
export const TRACING_OVERVIEW_FILTER = TracingOverviewActionTypes.TRACING_OVERVIEW_FILTER;


export interface TracingOverviewAction extends FeatureAction<TracingOverviewActionTypes> {
  readonly type: TracingOverviewActionTypes;
}

export class TracingOverviewGetCheckpoints implements TracingOverviewAction {
  readonly type = TRACING_OVERVIEW_GET_CHECKPOINTS;
  
  constructor(public payload: { deployment: number, name: string }) {}
}

export class TracingOverviewGetCheckpointsSuccess implements TracingOverviewAction {
  readonly type = TRACING_OVERVIEW_GET_CHECKPOINTS_SUCCESS;

  constructor(public payload: TracingOverviewCheckpoint[]) {}
}

export class TracingOverviewSort implements TracingOverviewAction {
  readonly type = TRACING_OVERVIEW_SORT;

  constructor(public payload: SortDirection) {}
}

export class TracingOverviewToggleCondensedView implements TracingOverviewAction {
  readonly type = TRACING_OVERVIEW_TOGGLE_CONDENSED_VIEW;
}

export class TracingOverviewClose implements TracingOverviewAction {
  readonly type = TRACING_OVERVIEW_CLOSE;
}

export class TracingOverviewFilter implements TracingOverviewAction {
  readonly type = TRACING_OVERVIEW_FILTER;

  constructor(public payload: TracingOverviewCheckpointFilter) {}
}

export class TracingOverviewGetDeployments implements TracingOverviewAction {
  readonly type = TRACING_OVERVIEW_GET_DEPLOYMENTS;
}
export class TracingOverviewGetDeploymentsSuccess implements TracingOverviewAction {
  readonly type = TRACING_OVERVIEW_GET_DEPLOYMENTS_SUCCESS;
  constructor(public payload: number[]) {}
}

export class TracingOverviewGetNodes implements TracingOverviewAction {
  readonly type = TRACING_OVERVIEW_GET_NODES;
  constructor(public payload: number) {}
}
 export class TracingOverviewGetNodesSuccess implements TracingOverviewAction {
  readonly type = TRACING_OVERVIEW_GET_NODES_SUCCESS;
  constructor(public payload: TracingOverviewCheckpointFilter[]) {}
}

export type TracingOverviewActions =
  | TracingOverviewGetCheckpoints
  | TracingOverviewGetCheckpointsSuccess
  | TracingOverviewSort
  | TracingOverviewToggleCondensedView
  | TracingOverviewClose
  | TracingOverviewFilter
  | TracingOverviewGetDeployments
  | TracingOverviewGetDeploymentsSuccess
  | TracingOverviewGetNodes
  | TracingOverviewGetNodesSuccess
  ;
