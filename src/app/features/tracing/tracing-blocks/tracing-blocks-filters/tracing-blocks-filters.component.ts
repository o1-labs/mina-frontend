import { ChangeDetectionStrategy, Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TemplatePortal } from '@angular/cdk/portal';
import { TRACING_BLOCKS_FILTER, TRACING_BLOCKS_GET_TRACES, TracingBlocksFilter } from '../tracing-blocks.actions';
import { selectTracingBlocksDeployments, selectTracingBlocksFilter } from '../tracing-blocks.state';
import { TracingBlockFilter } from '@app/shared/types/tracing/blocks/tracing-block-filter.type';

@UntilDestroy()
@Component({
  selector: 'mina-tracing-blocks-filters',
  templateUrl: './tracing-blocks-filters.component.html',
  styleUrls: ['./tracing-blocks-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'border-bottom h-xl fx-row-vert-cent flex-between' },
  providers: [DatePipe],
})
export class TracingBlocksFiltersComponent extends ManualDetection implements OnInit {

  deployments: number[];
  filter: TracingBlockFilter;

  @ViewChild('deploymentDropdown') private deploymentDrTemplate: TemplateRef<void>;
  @ViewChild('deploymentDropdownTrigger') private deploymentDropdownTrigger: ElementRef<HTMLDivElement>;
  private deploymentSelectorOverlay: OverlayRef;

  constructor(private router: Router,
              private datePipe: DatePipe,
              private overlay: Overlay,
              private store: Store<MinaState>,
              private viewContainerRef: ViewContainerRef) { super(); }

  ngOnInit(): void {
    this.listenToFiltersChanges();
    this.listenToDeploymentsChanges();
  }

  private listenToFiltersChanges(): void {
    this.store.select(selectTracingBlocksFilter)
      .pipe(untilDestroyed(this))
      .subscribe(filter => {
        this.filter = filter;
        this.detect();
      });
  }

  private listenToDeploymentsChanges(): void {
    this.store.select(selectTracingBlocksDeployments)
      .pipe(untilDestroyed(this))
      .subscribe(deployments => {
        this.deployments = deployments;
        this.detect();
      });
  }

  detachDeploymentsSelector(): void {
    if (this.deploymentSelectorOverlay?.hasAttached()) {
      this.deploymentSelectorOverlay.detach();
    }
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
      type: TRACING_BLOCKS_FILTER,
      payload: {
        ...this.filter,
        deployment: undefined,
      } as TracingBlockFilter,
    });
    this.deploymentSelectorOverlay.detach();
    this.store.dispatch({
      type: TRACING_BLOCKS_GET_TRACES,
      payload: {
        deployment: undefined,
      },
    });
    this.deploymentSelectorOverlay.detach();
  }

  filterDeployments(deploymentId: number): void {
    this.store.dispatch({
      type: TRACING_BLOCKS_FILTER,
      payload: {
        ...this.filter,
        deployment: deploymentId,
      } as TracingBlockFilter,
    });
    this.store.dispatch({
      type: TRACING_BLOCKS_GET_TRACES,
      payload: {
        deployment: deploymentId,
      },
    });
    this.deploymentSelectorOverlay.detach();
  }

  getDeployments(): number[] {
     return Array.from(new Set(this.deployments));
  }

}
