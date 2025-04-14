import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ExperimentsFilter } from '@shared/types/experiments/experiments-filters.type';
import { selectExperimentFilter, selectExperimentLoad, selectExperimentsData } from '../experiments.state';
import { Experiment } from '@app/shared/types/experiments/experiments.type';
import { TemplatePortal } from '@angular/cdk/portal';
import { EXPERIMENTS_FILTER, EXPERIMENTS_GET, ExperimentsGet } from '../experiments.actions';

@UntilDestroy()
@Component({
  selector: 'mina-experiments-toolbar',
  templateUrl: './experiments-toolbar.component.html',
  styleUrls: ['./experiments-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'border-bottom h-xl fx-row-vert-cent flex-between' },
  providers: [DatePipe],
})
export class ExperimentsToolbarComponent extends ManualDetection implements OnInit {


  @Input() experiments: Experiment[];
  filter: ExperimentsFilter;
  isLoading = false;

  @ViewChild('deploymentDropdown') private deploymentDrTemplate: TemplateRef<void>;
  @ViewChild('deploymentDropdownTrigger') private deploymentDropdownTrigger: ElementRef<HTMLDivElement>;
  private deploymentSelectorOverlay: OverlayRef;
  
  @ViewChild('experimentsDropdown') private experimentsDropdown: TemplateRef<void>;
  @ViewChild('experimentsDropdownTrigger') private experimentsDropdownTrigger: ElementRef<HTMLDivElement>;
  private experimentsSelectorOverlay: OverlayRef;
  

  @ViewChild('roundsDropdown') private roundsDrTemplate: TemplateRef<void>;
  @ViewChild('roundsDropdownTrigger') private roundsDropdownTrigger: ElementRef<HTMLDivElement>;
  private roundsSelectorOverlay: OverlayRef;
  

  constructor(private router: Router,
              private datePipe: DatePipe,
              private overlay: Overlay,
              private store: Store<MinaState>,
              private viewContainerRef: ViewContainerRef) { super(); }

  ngOnInit(): void {
    this.listenToFiltersChanges();
    this.listenToExperimentsChanges();
    this.listenOnLoadingChanges();
  }

  private listenToFiltersChanges(): void {
    this.store.select(selectExperimentFilter)
      .pipe(untilDestroyed(this))
      .subscribe(filter => {
        this.filter = filter;
        this.detect();
      });
  }

  private listenToExperimentsChanges(): void {
    this.store.select(selectExperimentsData)
      .pipe(untilDestroyed(this))
      .subscribe((experiments: Experiment[]) => {
        this.experiments = experiments;
        this.detect();
      });
  }


  detachDeploymentsSelector(): void {
    if (this.deploymentSelectorOverlay?.hasAttached()) {
      this.deploymentSelectorOverlay.detach();
    }
  }

  detachExperimentsSelector(): void {
    if (this.experimentsSelectorOverlay?.hasAttached()) {
      this.experimentsSelectorOverlay.detach();
    }
  }

  detachRoundsSelector(): void {
    if (this.roundsSelectorOverlay?.hasAttached()) {
      this.roundsSelectorOverlay.detach();
    }
  }

  openExperimentsDropdown(event: MouseEvent): void {
    this.experimentsSelectorOverlay = this.openDropdown(event, this.experimentsDropdown, this.experimentsDropdownTrigger,this.experimentsSelectorOverlay)
  }

  openRoundsDropdown(event: MouseEvent): void {
    this.roundsSelectorOverlay = this.openDropdown(event, this.roundsDrTemplate, this.roundsDropdownTrigger, this.roundsSelectorOverlay)
  }

  openDeploymentDropdown(event: MouseEvent): void {
    this.deploymentSelectorOverlay = this.openDropdown(event, this.deploymentDrTemplate, this.deploymentDropdownTrigger, this.deploymentSelectorOverlay)
  }
  
  openDropdown(event: MouseEvent,drTemplate: TemplateRef<void>, dropdownTrigger: ElementRef<HTMLDivElement>, selectorOverlay: OverlayRef): OverlayRef {
    if (selectorOverlay?.hasAttached()) {
      selectorOverlay.detach();
      return selectorOverlay;
    }

    selectorOverlay = this.overlay.create({
      hasBackdrop: false,
      width: 650,
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(dropdownTrigger.nativeElement)
        .withPositions([{
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 35,
        }]),
    });
    event.stopPropagation();

    const portal = new TemplatePortal(drTemplate, this.viewContainerRef);
    selectorOverlay.attach(portal);
    return selectorOverlay;
  }
  
  resetDeploymentsFilter(): void {
    this.store.dispatch({
      type: EXPERIMENTS_FILTER,
      payload: {
        ...this.filter,
        deployment: undefined,
      } as ExperimentsFilter,
    });
    this.deploymentSelectorOverlay.detach();
  }

  resetExperimentsFilter(): void {
    this.store.dispatch({
      type: EXPERIMENTS_FILTER,
      payload: {
        ...this.filter,
        experiment: undefined,
      } as ExperimentsFilter,
    });
    this.experimentsSelectorOverlay.detach();
  }

  resetRoundsFilter(): void {
    this.store.dispatch({
      type: EXPERIMENTS_FILTER,
      payload: {
        ...this.filter,
        round: undefined,
      } as ExperimentsFilter,
    });
    this.roundsSelectorOverlay.detach();
  }

  filterDeployments(deploymentId: number): void {
    this.store.dispatch({
      type: EXPERIMENTS_FILTER,
      payload: {
        ...this.filter,
        deployment: deploymentId,
      } as ExperimentsFilter,
    });
    this.deploymentSelectorOverlay.detach();
  }

  filterExperiments(experiment: string): void {
    this.store.dispatch({
      type: EXPERIMENTS_FILTER,
      payload: {
        ...this.filter,
        experiment: experiment,
      } as ExperimentsFilter,
    });
    this.experimentsSelectorOverlay.detach();
  }

  filterRounds(round: number): void {
    this.store.dispatch({
      type: EXPERIMENTS_FILTER,
      payload: {
        ...this.filter,
        round: round,
      } as ExperimentsFilter,
    });
    this.roundsSelectorOverlay.detach();
  }

  getDeployments(): number[] {
    return Array.from(new Set(this.experiments.map(experiment => experiment.deployment_id)));
  }

  getExperimentsNames(): string[] {
    return Array.from(new Set(this.experiments.map(experiment => experiment.exp)));
  }

  getRounds(): number[] {
    return Array.from(new Set(this.experiments.map(experiment => experiment.round)));
  }

  private listenOnLoadingChanges(): void {
    this.store.select(selectExperimentLoad)
      .pipe(untilDestroyed(this))
      .subscribe((isLoading: boolean) => {
        this.isLoading = isLoading;
        this.detect();
      });
  }
  
  refreshData(): void {
    this.store.dispatch({
      type: EXPERIMENTS_FILTER,
      payload: {
        ...this.filter,
        deployment: undefined,
        experiment: undefined,
        round: undefined,
      } as ExperimentsFilter,
    });
    this.store.dispatch({
      type: EXPERIMENTS_GET,
      } as ExperimentsGet,
    );
  }
}
