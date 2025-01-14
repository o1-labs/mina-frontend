import { Component, OnInit } from '@angular/core';
import { ExperimentsService } from '../services/experiments.service';

@Component({
  selector: 'mina-experiments',
  templateUrl: './experiments.component.html',
  styleUrls: ['./experiments.component.scss'],
})
export class ExperimentsComponent implements OnInit {
  experiments: any[] = [];
  displayedColumns: string[] = [
    'exp',
    'round',
    'rate_min',
    'payment_rate_min',
    'zkapp_rate_min',
    'duration',
    'max_latency',
    'missed',
    'failed',
    'successful',
    'start',
    'total',
    'zkapps',
  ];
  isLoading = false;

  constructor(private readonly experimentsService: ExperimentsService) {}

  ngOnInit(): void {
    this.fetchExperiments();
  }

  fetchExperiments(): void {
    this.isLoading = true;
    this.experimentsService.getExperiments().subscribe({
      next: (data) => {
        this.experiments = data;
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

  shouldShowExperiment(index: number): boolean {
    if (index === 0) {
      return true;
    }
    return this.experiments[index].exp !== this.experiments[index - 1].exp;
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
