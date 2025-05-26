import { ChangeDetectionStrategy, Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TemplatePortal } from '@angular/cdk/portal';
import { TRACING_BLOCKS_FILTER, TRACING_BLOCKS_GET_NODES, TRACING_BLOCKS_GET_TRACES, TracingBlocksFilter } from '../tracing-blocks.actions';
import { selectTracingBlocksDeployments, selectTracingBlocksFilter, selectTracingBlocksNodes } from '../tracing-blocks.state';
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
  nodes: TracingBlockFilter[];
  filter: TracingBlockFilter;

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
              private viewContainerRef: ViewContainerRef) { super();
                this.filter = {
                  deployment: undefined,
                  name: undefined,
               }
              }

  ngOnInit(): void {
    this.listenToFiltersChanges();
    this.listenToDeploymentsChanges();
    this.listenToNodesChanges();
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
         if (this.deployments.length > 0) {
                  this.store.dispatch({
                    type: TRACING_BLOCKS_FILTER,
                    payload: {
                      ...this.filter,
                      deployment: this.maxDeploymentId(),
                    } as TracingBlockFilter,
                  });
                  this.store.dispatch({
                    type: TRACING_BLOCKS_GET_NODES,
                    payload: this.maxDeploymentId(),
                  });
                }
        this.detect();
      });

  }

  private listenToNodesChanges(): void {
    this.store.select(selectTracingBlocksNodes)
      .pipe(untilDestroyed(this))
      .subscribe(nodes => {
        this.nodes = nodes;
          if (!this.filter?.name && this.nodes.length > 0) {
                  this.store.dispatch({
                    type: TRACING_BLOCKS_FILTER,
                    payload: {
                      ...this.filter,
                      name: this.nodes[0].name,
                    } as TracingBlockFilter,
                  });
          this.detect();
          }
          
      });
  }

  maxDeploymentId(): number {
    return Math.max(...this.deployments);
  }


  detachDeploymentsSelector(): void {
    if (this.deploymentSelectorOverlay?.hasAttached()) {
      this.deploymentSelectorOverlay.detach();
    }
  }

  detachNodesSelector(): void {
    if (this.nodesSelectorOverlay?.hasAttached()) {
      this.nodesSelectorOverlay.detach();
    }
  }

  openNodesDropdown(event: MouseEvent): void {
    this.nodesSelectorOverlay = this.openDropdown(event, this.nodesDrTemplate, this.nodesDropdownTrigger, this.nodesSelectorOverlay)
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
    const maxDeployment = Math.max(...this.deployments);
    this.store.dispatch({
      type: TRACING_BLOCKS_FILTER,
      payload: {
      ...this.filter,
      deployment: maxDeployment,
      } as TracingBlockFilter,
    });
    this.nodes = [];
    this.store.dispatch({
      type: TRACING_BLOCKS_GET_NODES,
      payload: maxDeployment,
    });
    this.deploymentSelectorOverlay.detach();
    this.store.dispatch({
      type: TRACING_BLOCKS_GET_TRACES,
      payload: {
        deployment: maxDeployment,
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
      type: TRACING_BLOCKS_GET_NODES,
      payload: deploymentId,
    });
    this.deploymentSelectorOverlay.detach();
  }

  filterNodes(name: string): void {
    this.store.dispatch({
      type: TRACING_BLOCKS_FILTER,
      payload: {
        ...this.filter,
        name: name,
      } as TracingBlockFilter,
    });
    this.store.dispatch({
      type: TRACING_BLOCKS_GET_TRACES,
      payload: {
        ...this.filter,
        name: name,
      } as TracingBlockFilter,
    });
    this.nodesSelectorOverlay.detach();
  }

  maxDeployment(): number {
    return Math.max(...this.deployments);
  }

  // Filter out the max deployment from the list of deployments
  // to avoid showing it in the dropdown as we have special entry 'Current' for this
  getDeployments(): number[] {
    return Array.from(this.deployments).filter(deployment => deployment !== this.maxDeployment());
  }

  getNodes(): TracingBlockFilter[] {
    return Array.from(new Set(this.nodes));
  }
}
