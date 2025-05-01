import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { TracingOverviewClose, TracingOverviewGetCheckpoints, TracingOverviewGetDeployments, TracingOverviewGetNodes } from '@tracing/tracing-overview/tracing-overview.actions';
import { TracingOverviewCheckpoint } from '@shared/types/tracing/overview/tracing-overview-checkpoint.type';
import { selectActiveNode } from '@app/app.state';
import { filter } from 'rxjs';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@Component({
  selector: 'mina-tracing-overview',
  templateUrl: './tracing-overview.component.html',
  styleUrls: ['./tracing-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class TracingOverviewComponent extends StoreDispatcher implements OnInit, OnDestroy {

  checkpoints: TracingOverviewCheckpoint[];

  ngOnInit(): void {
    this.dispatch(TracingOverviewGetDeployments);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(TracingOverviewClose);
  }
}
