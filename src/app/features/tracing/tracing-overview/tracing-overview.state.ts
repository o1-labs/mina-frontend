import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectTracingOverviewState } from '@tracing/tracing.state';
import { TracingOverviewCheckpoint } from '@shared/types/tracing/overview/tracing-overview-checkpoint.type';
import { SortDirection } from '@shared/types/shared/table-sort.type';
import { TracingOverviewCheckpointFilter } from '@app/shared/types/tracing/overview/tracing-overview-checkpoint-filter.type';

export interface TracingOverviewState {
  checkpoints: TracingOverviewCheckpoint[];
  deployments: number[];
  nodes: TracingOverviewCheckpointFilter[];
  sortDirection: SortDirection;
  condensedView: boolean;
  filter: TracingOverviewCheckpointFilter;
}

const select = <T>(selector: (state: TracingOverviewState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectTracingOverviewState,
  selector,
);
export const selectTracingOverviewCheckpoints = select((state: TracingOverviewState): TracingOverviewCheckpoint[] => state.checkpoints);
export const selectTracingOverviewSortDirection = select((state: TracingOverviewState): SortDirection => state.sortDirection);
export const selectTracingOverviewCondensedView = select((state: TracingOverviewState): boolean => state.condensedView);
export const selectTracingOverviewCheckpointsFilter = select((state: TracingOverviewState): TracingOverviewCheckpointFilter => state.filter);
export const selectTracingOverviewDeployments = select((state: TracingOverviewState): number[] => state.deployments);
export const selectTracingOverviewNodes = select((state: TracingOverviewState): TracingOverviewCheckpointFilter[] => state.nodes);
