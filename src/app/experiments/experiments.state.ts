import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { ExperimentsFilter } from '@shared/types/experiments/experiments-filters.type';
import { Experiment } from '@app/shared/types/experiments/experiments.type';

export interface ExperimentsState {
  filter: ExperimentsFilter;
  sort: TableSort<Experiment>;
  data: Experiment[];
  isLoading: boolean;
}

const select = <T>(selector: (state: ExperimentsState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectExperimentsState,
  selector,
);


export const selectExperimentsState = createFeatureSelector<ExperimentsState>('experiments');
export const selectExperimentsData = select((state: ExperimentsState): Experiment[] => state.data);
export const selectExperimentFilter = select(((state: ExperimentsState): ExperimentsFilter => state.filter));
export const selectExperimentSort = select(((state: ExperimentsState): TableSort<Experiment> => state.sort));
export const selectExperimentLoad = select(((state: ExperimentsState): boolean => state.isLoading));