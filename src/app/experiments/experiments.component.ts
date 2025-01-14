import { Component, OnInit } from '@angular/core';
import { ExperimentsService } from '../services/experiments.service';

@Component({
  selector: 'mina-experiments',
  templateUrl: './experiments.component.html',
  styleUrls: ['./experiments.component.scss'],
})
export class ExperimentsComponent implements OnInit {
  experiments: any[] = [];
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
}
