import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TemplatePortal } from '@angular/cdk/portal';
import { TracingOverviewCheckpoint } from '@app/shared/types/tracing/overview/tracing-overview-checkpoint.type';
import { selectTracingOverviewCheckpointsFilter, selectTracingOverviewDeployments, selectTracingOverviewNodes } from '../tracing-overview.state';
import { TRACING_OVERVIEW_FILTER, TRACING_OVERVIEW_GET_CHECKPOINTS, TRACING_OVERVIEW_GET_NODES, TracingOverviewGetCheckpoints } from '../tracing-overview.actions';
import { TracingOverviewCheckpointFilter } from '@app/shared/types/tracing/overview/tracing-overview-checkpoint-filter.type';

@UntilDestroy()
@Component({
  selector: 'mina-tracing-overview-filters',
  templateUrl: './tracing-overview-filters.component.html',
  styleUrls: ['./tracing-overview-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'border-bottom h-xl fx-row-vert-cent flex-between' },
  providers: [DatePipe],
})
export class TracingOverviewFiltersComponent extends ManualDetection implements OnInit {

  deployments: number[];
  nodes: TracingOverviewCheckpointFilter[];
  filter: TracingOverviewCheckpointFilter;

  @ViewChild('deploymentDropdown') private deploymentDrTemplate: TemplateRef<void>;
  @ViewChild('deploymentDropdownTrigger') private deploymentDropdownTrigger: ElementRef<HTMLDivElement>;
  private deploymentSelectorOverlay: OverlayRef;

  @ViewChild('nodesDropdown') private nodesDrTemplate: TemplateRef<void>;
  @ViewChild('nodesDropdownTrigger') private nodesDropdownTrigger: ElementRef<HTMLDivElement>;
  private nodesSelectorOverlay: OverlayRef;


  constructor(private router: Router,
              private datePipe: DatePipe,
              private overlay: Overlay,
              private store: Store<MinaState>,
              private viewContainerRef: ViewContainerRef) { super(); }

  ngOnInit(): void {
    this.listenToFiltersChanges();
    this.listenToDeploymentsChanges();
    this.listenToNodesChanges();
  }

  private listenToFiltersChanges(): void {
    this.store.select(selectTracingOverviewCheckpointsFilter)
      .pipe(untilDestroyed(this))
      .subscribe(filter => {
        this.filter = filter;
        this.detect();
      });
  }

  private listenToDeploymentsChanges(): void {
    this.store.select(selectTracingOverviewDeployments)
      .pipe(untilDestroyed(this))
      .subscribe(deployments => {
        this.deployments = deployments;
        this.detect();
      });
  }

  private listenToNodesChanges(): void {
    this.store.select(selectTracingOverviewNodes)
      .pipe(untilDestroyed(this))
      .subscribe(nodes => {
        this.nodes = nodes;
        this.detect();
      });
  }


  detachDeploymentsSelector(): void {
    if (this.deploymentSelectorOverlay?.hasAttached()) {
      this.deploymentSelectorOverlay.detach();
    }
  }

  openDeploymentDropdown(event: MouseEvent): void {
    this.deploymentSelectorOverlay = this.openDropdown(event,this.deploymentDrTemplate, this.deploymentDropdownTrigger, this.deploymentSelectorOverlay)
  }
  
  openDropdown(event: MouseEvent, drTemplate: TemplateRef<void>, dropdownTrigger: ElementRef<HTMLDivElement>, selectorOverlay: OverlayRef): OverlayRef {
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
  
  maxDeploymentId(): number {
    return Math.max(...this.deployments);
  }

  setMaxDeploymentsFilter(): void {
    const maxDeployment = this.maxDeploymentId();
    this.store.dispatch({
      type: TRACING_OVERVIEW_FILTER,
      payload: {
        ...this.filter,
        deployment: maxDeployment,
      } as TracingOverviewCheckpointFilter,
    });
    this.nodes = []; 
    this.deploymentSelectorOverlay.detach();
    this.store.dispatch({
      type: TRACING_OVERVIEW_GET_NODES,
      payload: maxDeployment,
    });
    this.deploymentSelectorOverlay.detach();
  }

  filterDeployments(deploymentId: number): void {
    this.store.dispatch({
      type: TRACING_OVERVIEW_FILTER,
      payload: {
        ...this.filter,
        deployment: deploymentId,
      } as TracingOverviewCheckpointFilter,
    });
    this.store.dispatch({
      type: TRACING_OVERVIEW_GET_NODES,
      payload: deploymentId,
    });
    this.deploymentSelectorOverlay.detach();
  }

  getHistoricalDeployments(): number[] {
    return this.deployments.filter(deployment => deployment !== this.maxDeploymentId());
  }

  detachNodesSelector(): void {
    if (this.nodesSelectorOverlay?.hasAttached()) {
      this.nodesSelectorOverlay.detach();
    }
  }

  openNodesDropdown(event: MouseEvent): void {
    this.nodesSelectorOverlay = this.openDropdown(event, this.nodesDrTemplate, this.nodesDropdownTrigger, this.nodesSelectorOverlay)
  }

  filterNodes(name: string): void {
    this.store.dispatch({
      type: TRACING_OVERVIEW_FILTER,
      payload: {
        ...this.filter,
        name: name,
      } as TracingOverviewCheckpointFilter,
    });

    this.deploymentSelectorOverlay.detach();
    this.nodesSelectorOverlay.detach();
  }

  getNodes(): TracingOverviewCheckpointFilter[] {
     return Array.from(new Set(this.nodes));
  }

}
