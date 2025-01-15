import { Component, OnInit } from '@angular/core';
import { MinaTableWrapper } from '@app/shared/base-classes/mina-table-wrapper.class';
import { TableColumnList } from '@app/shared/types/shared/table-head-sorting.type';
import {
  SortDirection,
  TableSort,
} from '@app/shared/types/shared/table-sort.type';
import { ExperimentsService } from '../services/experiments.service';

interface Experiment {
  exp: string;
  round: number;
  rate_min: string;
  zkapp_rate_min: string;
  payment_rate_min: string;
  duration: {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
  };
  max_latency: {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
  };
  missed: string;
  failed: string;
  successful: string;
  start: string;
  total: string;
  zkapps: string;
}

@Component({
  selector: 'mina-experiments',
  templateUrl: './experiments.component.html',
  styleUrls: ['./experiments.component.scss'],
})
export class ExperimentsComponent
  extends MinaTableWrapper<Experiment>
  implements OnInit
{
  experiments: Experiment[] = [];
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
  isLoading = false;

  constructor(private readonly experimentsService: ExperimentsService) {
    super();
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.fetchExperiments();
  }

  protected override setupTable(): void {
    this.table.gridTemplateColumns = [
      250,
      150,
      150,
      200,
      150,
      150,
      200,
      150,
      150,
      150,
      'auto',
      150,
      150,
    ];
    this.table.minWidth = 998;
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

  fetchExperiments(): void {
    this.isLoading = true;
    this.experimentsService.getExperiments().subscribe({
      next: (data) => {
        this.experiments = data as Experiment[];
        if (this.table) {
          this.table.rows = this.experiments;
          this.table.init();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching experiments:', error);
        this.isLoading = false;
      },
    });
  }

  refreshData(): void {
    this.fetchExperiments();
  }

  shouldMakeBoldExpName(index: number): boolean {
    if (index === 0) {
      return true;
    }
    return this.experiments[index].exp !== this.experiments[index - 1].exp;
  }

  shouldMakeBoldStatusRate(
    index: number,
    statusName: 'missed' | 'failed' | 'successful'
  ): boolean {
    return this.experiments[index][statusName] !== '0.00';
  }

  getRowSpan(index: number): number {
    const currentExp = this.experiments[index].exp;
    let count = 0;
    for (let i = index; i < this.experiments.length; i++) {
      if (this.experiments[i].exp === currentExp) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }
}
