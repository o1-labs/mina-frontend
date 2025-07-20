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

  protected readonly tableHeads: TableColumnList<Experiment> = [
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
  
  currentSort: TableSort<Experiment>;
  experiments: Experiment[];
  activeExperiment: Experiment;
  filter: ExperimentsFilter;
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
    this.listenToRouteChange();
    this.listenToActiveExperimentChange();
  }

  private listenToExperimentsChanges(): void {
    this.select(selectExperimentsData, (experiments: Experiment[]) => {
      this.experiments = experiments;
      this.table.rows = this.experiments;
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
      this.table.rows = this.experiments.filter((experiment: Experiment) => {
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
}
