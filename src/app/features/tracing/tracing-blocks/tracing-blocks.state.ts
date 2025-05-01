import { MinaState } from '@app/app.setup';
import { TracingBlockTrace } from '@shared/types/tracing/blocks/tracing-block-trace.type';
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { TracingTraceGroup } from '@shared/types/tracing/blocks/tracing-trace-group.type';
import { selectTracingBlocksState } from '@tracing/tracing.state';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { TracingBlocksFilter } from './tracing-blocks.actions';
import { TracingBlockFilter } from '@app/shared/types/tracing/blocks/tracing-block-filter.type';

export interface TracingBlocksState {
  traces: TracingBlockTrace[];
  deployments: number[];
  nodes: TracingBlockFilter[];
  activeTrace: TracingBlockTrace;
  activeTraceGroups: TracingTraceGroup[];
  sort: TableSort<TracingBlockTrace>;
  filter: TracingBlockFilter;
}

const select = <T>(selector: (state: TracingBlocksState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectTracingBlocksState,
  selector,
);

export const selectTracingTraces = select((state: TracingBlocksState): TracingBlockTrace[] => state.traces);
export const selectTracingActiveTrace = select((state: TracingBlocksState): TracingBlockTrace => state.activeTrace);
export const selectTracingActiveTraceDetails = select((state: TracingBlocksState): { activeTrace: TracingBlockTrace, activeTraceGroups: TracingTraceGroup[] } => ({
  activeTrace: state.activeTrace,
  activeTraceGroups: state.activeTraceGroups,
}));
export const selectTracingActiveTraceGroups = select((state: TracingBlocksState): TracingTraceGroup[] => state.activeTraceGroups);
export const selectTracingBlocksSorting = select((state: TracingBlocksState): TableSort<TracingBlockTrace> => state.sort);
export const selectTracingBlocksFilter = select((state: TracingBlocksState): TracingBlockFilter => state.filter);
export const selectTracingBlocksDeployments = select((state: TracingBlocksState): number[] => state.deployments);
export const selectTracingBlocksNodes = select((state: TracingBlocksState): TracingBlockFilter[] => state.nodes);
