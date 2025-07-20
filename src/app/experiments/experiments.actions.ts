import { FeatureAction } from '@shared/types/store/feature-action.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { Experiment } from '@app/shared/types/experiments/experiments.type';
import { ExperimentsFilter } from '@app/shared/types/experiments/experiments-filters.type';

enum ExperimentsActionTypes {
  EXPERIMENTS_INIT = 'EXPERIMENTS_INIT',
  EXPERIMENTS_GET_SUCCESS = 'EXPERIMENTS_GET_SUCCESS',
  EXPERIMENTS_SORT = 'EXPERIMENTS_SORT',
  EXPERIMENTS_CLOSE = 'EXPERIMENTS_CLOSE',
  EXPERIMENTS_GET = 'EXPERIMENTS_GET',
  EXPERIMENTS_FILTER = 'EXPERIMENTS_FILTER',
  EXPERIMENTS_SELECT_ROW = 'EXPERIMENTS_SELECT_ROW',
  EXPERIMENTS_GET_DETAILS = 'EXPERIMENTS_GET_DETAILS',
  EXPERIMENTS_GET_DETAILS_SUCCESS = 'EXPERIMENTS_GET_DETAILS_SUCCESS',
}

export const EXPERIMENTS_INIT = ExperimentsActionTypes.EXPERIMENTS_INIT;
export const EXPERIMENTS_GET_SUCCESS = ExperimentsActionTypes.EXPERIMENTS_GET_SUCCESS;
export const EXPERIMENTS_SORT = ExperimentsActionTypes.EXPERIMENTS_SORT;
export const EXPERIMENTS_CLOSE = ExperimentsActionTypes.EXPERIMENTS_CLOSE;
export const EXPERIMENTS_GET = ExperimentsActionTypes.EXPERIMENTS_GET;
export const EXPERIMENTS_FILTER = ExperimentsActionTypes.EXPERIMENTS_FILTER;
export const EXPERIMENTS_SELECT_ROW = ExperimentsActionTypes.EXPERIMENTS_SELECT_ROW;
export const EXPERIMENTS_GET_DETAILS = ExperimentsActionTypes.EXPERIMENTS_GET_DETAILS;
export const EXPERIMENTS_GET_DETAILS_SUCCESS = ExperimentsActionTypes.EXPERIMENTS_GET_DETAILS_SUCCESS;

export interface ExperimentsAction extends FeatureAction<ExperimentsActionTypes> {
  readonly type: ExperimentsActionTypes;
}

export class ExperimentsInit implements ExperimentsAction {
  readonly type = EXPERIMENTS_INIT;
}

export class ExperimentsGetSuccess implements ExperimentsAction {
  readonly type = EXPERIMENTS_GET_SUCCESS;
  constructor(public payload: Experiment[]) {}
}

export class ExperimentsSort implements ExperimentsAction {
  readonly type = EXPERIMENTS_SORT;
  constructor(public payload: TableSort<Experiment>) {}
}
export class ExperimentsClose implements ExperimentsAction {
  readonly type = EXPERIMENTS_CLOSE;
}

export class ExperimentsGet implements ExperimentsAction {
  readonly type = EXPERIMENTS_GET;
}

export class ExperimentsDataFilter implements ExperimentsAction {
  readonly type = ExperimentsActionTypes.EXPERIMENTS_FILTER;
  constructor(public payload: ExperimentsFilter) {}
}

export class ExperimentsSelectRow implements ExperimentsAction {
  readonly type = ExperimentsActionTypes.EXPERIMENTS_SELECT_ROW;
  constructor(public payload: { experiment: Experiment; filter: ExperimentsFilter } | null) {}
}
export class ExperimentsGetDetails implements ExperimentsAction {
  readonly type = ExperimentsActionTypes.EXPERIMENTS_GET_DETAILS;
  constructor(public payload: { experiment: Experiment }) {}
}

export class ExperimentsGetDetailsSuccess implements ExperimentsAction {
  readonly type = ExperimentsActionTypes.EXPERIMENTS_GET_DETAILS_SUCCESS;
  constructor(public payload: Experiment) {}
}

export type ExperimentsActions =
  | ExperimentsInit
  | ExperimentsGetSuccess
  | ExperimentsGet
  | ExperimentsSort
  | ExperimentsClose
  | ExperimentsDataFilter
  | ExperimentsSelectRow
  | ExperimentsGetDetails
  | ExperimentsGetDetailsSuccess
  ;
