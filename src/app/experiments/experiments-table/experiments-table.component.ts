import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MinaTableWrapper } from '@app/shared/base-classes/mina-table-wrapper.class';
import { TableColumnList } from '@app/shared/types/shared/table-head-sorting.type';
import {
  SortDirection,
  TableSort,
} from '@app/shared/types/shared/table-sort.type';
import { Experiment } from '@app/shared/types/experiments/experiments.type';
import { ExperimentsSelectRow, ExperimentsSort } from '../experiments.actions';
import { selectExperimentFilter, selectExperimentsData, selectExperimentSort, selectExperimentDetails } from '../experiments.state';
import { ExperimentsFilter } from '@app/shared/types/experiments/experiments-filters.type';
import { Router } from '@angular/router';
import { Routes } from '@app/shared/enums/routes.enum';
import { getMergedRoute } from '@app/shared/router/router-state.selectors';
import { MergedRoute } from '@app/shared/router/merged-route';
import { ExperimentDetails } from '@app/shared/types/experiments/experiments-details.type';
import { filter } from 'rxjs';


@Component({
  selector: 'mina-experiments-table',
  templateUrl: './experiments-table.component.html',
  styleUrls: ['./experiments-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperimentsTableComponent
  extends MinaTableWrapper<Experiment>
  implements OnInit {

  private readonly collapsedHeaders: TableColumnList<Experiment> = [
    { name: 'experiment' },
    { name: 'rounds' },
    { name: 'avg total rate/min' },
    { name: 'avg payment rate/min' },
    { name: 'avg zkApp/min' },
    { name: 'total duration' },
    { name: 'avg latency' },
    { name: 'avg missed rate' },
    { name: 'avg failed rate' },
    { name: 'avg success rate' },
    { name: 'first started' },
    { name: 'total txns (all)' },
    { name: 'total zkApp (all)' },
  ];

  private readonly expandedHeaders: TableColumnList<Experiment> = [
    { name: 'experiment' },
    { name: 'round' },
    { name: 'total rate/min' },
    { name: 'value transfer rate/min' },
    { name: 'zkApp rate/min' },
    { name: 'duration' },
    { name: 'max latency' },
    { name: 'missed rate' },
    { name: 'failed rate' },
    { name: 'successful rate' },
    { name: 'start timestamp' },
    { name: 'total txns' },
    { name: 'zkApp txns' },
  ];

  protected tableHeads: TableColumnList<Experiment> = this.collapsedHeaders;
  
  currentSort: TableSort<Experiment>;
  experiments: Experiment[];
  groupedExperiments: Experiment[] = [];
  activeExperiment: Experiment;
  filter: ExperimentsFilter;
  expandedExperiments: Set<string> = new Set<string>();
  private expFromRoute: string;
  private preselect: boolean;

  constructor(private router: Router) { super(); }

  protected override setupTable(): void {
    this.table.gridTemplateColumns = [
      250, 150, 150, 200, 150, 150, 200, 150, 150, 150, 300, 150, 150,
    ];
    this.table.minWidth = 2300;
    this.table.sortClz = class {
      constructor(public payload: TableSort<Experiment>) {
        this.type = 'SORT';
      }
      type: string;
    };
    this.table.sortSelector = (_): TableSort<Experiment> => {
      return {
        sortBy: 'exp',
        sortDirection: SortDirection.ASC,
      };
    };
    this.table.propertyForActiveCheck = 'exp';
  }


  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.listenToExperimentsChanges();
    this.listenToSortingChanges();
    this.listenToFilterChanges();
    this.listenToActiveExperimentChange();
    this.listenToRouteChange();
  }

  private listenToExperimentsChanges(): void {
    this.select(selectExperimentsData, (experiments: Experiment[]) => {
      this.experiments = experiments;
      this.groupedExperiments = this.createGroupedView();
      this.table.rows = this.groupedExperiments;
      this.table.detect();
      if (this.preselect) {
        this.dispatch(ExperimentsSelectRow, {
          experiment: this.experiments.find(e => e.exp === this.expFromRoute),
          filter: this.filter,
        });
        this.preselect = false;
        this.detect();
        this.scrollToElement();
        return;
      }
      this.detect();
    }, filter(Boolean));
  }

  protected override onRowClick(experiment: Experiment): void {
      if (this.activeExperiment?.exp !== experiment.exp) {
        this.router.navigate([Routes.EXPERIMENTS, experiment.exp], { queryParamsHandling: 'merge' });
        this.dispatch(ExperimentsSelectRow, { experiment, filter: this.filter });
      }
  }
  
    private scrollToElement(): void {
      if (!this.expFromRoute) {
        return;
      }
      this.table.scrollToElement(t => t.exp === this.expFromRoute);
    }

  private listenToRouteChange(): void {
        this.select(getMergedRoute, (route: MergedRoute) => {
          if (route.params['exp'] && this.experiments.length === 0) {
            this.expFromRoute = route.params['exp'];
            this.preselect = true;
          }
        });
  }

  private listenToFilterChanges(): void {
    this.select(selectExperimentFilter, (filter: ExperimentsFilter) => {
      this.filter = filter;
      const filteredExperiments = this.experiments.filter((experiment: Experiment) => {
        if (filter.deployment && filter.deployment !== experiment.deployment_id) {
          return false;
        }
        if (filter.experiment && filter.experiment !== experiment.exp) {
          return false;
        }
        if (filter.round && filter.round !== experiment.round) {
          return false;
        }
        return true;
      });
      this.groupedExperiments = this.createGroupedView(filteredExperiments);
      this.table.rows = this.groupedExperiments;
      this.table.detect();
    });
  }

  private listenToSortingChanges(): void {
    this.select(selectExperimentSort, (sort: TableSort<Experiment>) => {
      this.currentSort = sort;
      this.table.detect();
    });
  }

  private listenToActiveExperimentChange(): void {
    this.select(selectExperimentDetails, (activeExperiment: ExperimentDetails) => {
      this.activeExperiment = activeExperiment as any; // Cast to Experiment for now
      this.table.activeRow = this.activeExperiment;
      this.table.detect();
      this.detect();
    });
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.dispatch(ExperimentsSort, { sortBy: sortBy as keyof Experiment, sortDirection });
  }

  shouldMakeBoldExpName(index: number): boolean {
    if (index === 0) {
      return true;
    }
    return this.table.rows[index].exp !== this.table.rows[index - 1].exp;
  }

  shouldMakeBoldStatusRate(
    index: number,
    statusName: 'missed' | 'failed' | 'successful'
  ): boolean {
    return this.table.rows[index][statusName] !== '0.00';
  }

  getRowSpan(index: number): number {
    const currentExp = this.table.rows[index].exp;
    let count = 0;
    for (let i = index; i < this.table.rows.length; i++) {
      if (this.table.rows[i].exp === currentExp) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }

  private lastGroupedView: Experiment[] | null = null;
  private lastInputData: Experiment[] | null = null;

  private createGroupedView(experimentsToGroup?: Experiment[]): Experiment[] {
    const experiments = experimentsToGroup || this.experiments;

    // Check if input data has changed
    if (this.lastInputData === experiments) {
      return this.lastGroupedView!;
    }

    const grouped: Experiment[] = [];
    const experimentGroups = new Map<string, Experiment[]>();
    
    // Group experiments by name
    for (const exp of experiments) {
      const group = experimentGroups.get(exp.exp) || [];
      group.push(exp);
      experimentGroups.set(exp.exp, group);
    }
    
    // Create grouped view
    for (const [expName, rounds] of experimentGroups) {
      // Sort rounds
      rounds.sort((a, b) => a.round - b.round);
      
      if (this.expandedExperiments.has(expName)) {
        // Add all rounds when expanded
        rounds.forEach((round, index) => {
          grouped.push({ 
            ...round, 
            __isGroupHeader: index === 0, 
            __isChildRow: index > 0,
            __totalRounds: rounds.length 
          } as any);
        });
      } else {
        // Add summary row when collapsed
        const summaryRow = this.createSummaryRow(rounds);
        grouped.push({ 
          ...summaryRow, 
          __isGroupHeader: true, 
          __totalRounds: rounds.length,
          __isSummary: true
        } as any);
      }
    }
    
    return grouped;
  }

  private createSummaryRow(rounds: Experiment[]): Experiment {
    const firstRound = rounds[0];
    const totalRounds = rounds.length;
    
    // Calculate averages
    const avgRateMin = this.calculateAverage(rounds, 'rate_min');
    const avgPaymentRateMin = this.calculateAverage(rounds, 'payment_rate_min');
    const avgZkappRateMin = this.calculateAverage(rounds, 'zkapp_rate_min');
    const avgMissed = this.calculateAverage(rounds, 'missed');
    const avgFailed = this.calculateAverage(rounds, 'failed');
    const avgSuccessful = this.calculateAverage(rounds, 'successful');
    
    // Calculate totals
    const totalTxns = rounds.reduce((sum, r) => sum + parseInt(r.total), 0);
    const totalZkapps = rounds.reduce((sum, r) => sum + parseInt(r.zkapps), 0);
    
    // Calculate total duration
    const totalDurationMs = rounds.reduce((sum, r) => {
      return sum + this.durationToMilliseconds(r.duration);
    }, 0);
    
    // Calculate average latency
    const avgLatencyMs = rounds.reduce((sum, r) => {
      return sum + this.durationToMilliseconds(r.max_latency);
    }, 0) / totalRounds;
    
    return {
      ...firstRound,
      round: totalRounds, // Show total rounds in round column
      rate_min: avgRateMin.toFixed(2),
      payment_rate_min: avgPaymentRateMin.toFixed(2),
      zkapp_rate_min: avgZkappRateMin.toFixed(2),
      duration: this.millisecondsToDataDuration(totalDurationMs),
      max_latency: this.millisecondsToDataDuration(avgLatencyMs),
      missed: avgMissed.toFixed(2),
      failed: avgFailed.toFixed(2),
      successful: avgSuccessful.toFixed(2),
      start: rounds[0].start, // First start time
      total: totalTxns.toString(),
      zkapps: totalZkapps.toString()
    };
  }

  private calculateAverage(rounds: Experiment[], field: keyof Experiment): number {
    const values = rounds.map(r => parseFloat(r[field] as string)).filter(v => !isNaN(v));
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private durationToMilliseconds(duration: any): number {
    if (!duration) return 0;
    
    let ms = 0;
    if (duration.days) ms += duration.days * 24 * 60 * 60 * 1000;
    if (duration.hours) ms += duration.hours * 60 * 60 * 1000;
    if (duration.minutes) ms += duration.minutes * 60 * 1000;
    if (duration.seconds) ms += duration.seconds * 1000;
    if (duration.milliseconds) ms += duration.milliseconds;
    
    return ms;
  }

  private millisecondsToDataDuration(ms: number): any {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    const milliseconds = Math.floor(ms % 1000);
    
    const result: any = {};
    if (days > 0) result.days = days;
    if (hours > 0) result.hours = hours;
    if (minutes > 0) result.minutes = minutes;
    if (seconds > 0) result.seconds = seconds;
    if (milliseconds > 0) result.milliseconds = milliseconds;
    
    return result;
  }

  toggleExperimentExpansion(experiment: Experiment, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    
    if (this.expandedExperiments.has(experiment.exp)) {
      this.expandedExperiments.delete(experiment.exp);
    } else {
      this.expandedExperiments.add(experiment.exp);
    }
    
    // Update headers based on expansion state
    this.updateTableHeaders();
    
    this.groupedExperiments = this.createGroupedView();
    this.table.rows = this.groupedExperiments;
    this.table.detect();
    this.detect();
  }

  private updateTableHeaders(): void {
    const hasExpandedExperiments = this.expandedExperiments.size > 0;
    this.tableHeads = hasExpandedExperiments ? this.expandedHeaders : this.collapsedHeaders;
    this.table.tableHeads = this.tableHeads;
  }

  isExperimentExpanded(experiment: Experiment): boolean {
    return this.expandedExperiments.has(experiment.exp);
  }

  getExpandIcon(experiment: Experiment): string {
    return this.isExperimentExpanded(experiment) ? 'expand_less' : 'expand_more';
  }

  isGroupHeader(experiment: any): boolean {
    return experiment.__isGroupHeader === true;
  }

  isChildRow(experiment: any): boolean {
    return experiment.__isChildRow === true;
  }

  getTotalRounds(experiment: any): number {
    return experiment.__totalRounds || 1;
  }

  isSummaryRow(experiment: any): boolean {
    return experiment.__isSummary === true;
  }
}
