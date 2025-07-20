import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { filter } from 'rxjs';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { ExpandTracking } from '@shared/components/mina-json-viewer/mina-json-viewer.component';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { ExperimentDetails } from '@app/shared/types/experiments/experiments-details.type';
import { ExperimentsSelectRow } from '../experiments.actions';
import { selectExperimentDetails } from '../experiments.state';

interface ExpandedSections {
  errors: boolean;
  warnings: boolean;
  logs: boolean;
}

@Component({
  selector: 'mina-experiments-side-panel',
  templateUrl: './experiments-side-panel.component.html',
  styleUrls: ['./experiments-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class ExperimentsSidePanelComponent extends StoreDispatcher implements OnInit {

  parametersExpandTracking: ExpandTracking = {};
  selectedTabIndex: number = 0;
  activeExperiment: ExperimentDetails;
  
  expandedSections: ExpandedSections = {
    errors: true,
    warnings: false,
    logs: false
  };

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToActiveExperimentChange();
  }

  get hasErrors(): boolean {
    return !!(this.activeExperiment?.errors?.length);
  }

  get hasWarnings(): boolean {
    return !!(this.activeExperiment?.warnings?.length);
  }

  getStatusIcon(status: string): string {
    if (!status) return 'help_outline';
    
    switch (status.toLowerCase()) {
      case 'running':
      case 'in_progress':
        return 'play_circle';
      case 'completed':
      case 'success':
      case 'finished':
        return 'check_circle';
      case 'failed':
      case 'error':
        return 'error';
      case 'pending':
      case 'waiting':
        return 'schedule';
      case 'cancelled':
      case 'stopped':
        return 'cancel';
      case 'paused':
        return 'pause_circle';
      default:
        return 'help_outline';
    }
  }

  toggleSection(section: keyof ExpandedSections): void {
    this.expandedSections[section] = !this.expandedSections[section];
    this.detect();
  }

  private listenToActiveExperimentChange(): void {
    this.select(selectExperimentDetails, (experiment: ExperimentDetails) => {
      this.activeExperiment = experiment;
      this.detect();
    }, filter(t => !!t));
  }

  closeSidePanel(): void {
    this.router.navigate([Routes.EXPERIMENTS], { queryParamsHandling: 'merge' });
    this.dispatch(ExperimentsSelectRow, null);
  }

  selectTab(num: number): void {
    this.selectedTabIndex = num;
    this.detect();
  }
}
