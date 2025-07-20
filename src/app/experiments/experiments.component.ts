import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { APP_CHANGE_SUB_MENUS, AppChangeSubMenus } from '@app/app.actions';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { ExperimentsClose, ExperimentsGet } from './experiments.actions';
import { Routes } from '@app/shared/enums/routes.enum';
import { selectExperimentDetails } from './experiments.state';
import { ExperimentDetails } from '@app/shared/types/experiments/experiments-details.type';

@Component({
  selector: 'mina-experiments',
  templateUrl: './experiments.component.html',
  styleUrls: ['./experiments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 w-100' },
})
export class ExperimentsComponent extends StoreDispatcher implements OnInit, OnDestroy {

  isActiveExperiment: boolean;

  constructor(public el: ElementRef<HTMLElement>) { super(); }

  ngOnInit(): void {
    this.store.dispatch<AppChangeSubMenus>({ type: APP_CHANGE_SUB_MENUS, payload: [Routes.EXPERIMENTS] });
    this.dispatch(ExperimentsGet); 
    this.listenToActiveExperimentChange();
  }

  private listenToActiveExperimentChange(): void {
    this.select(selectExperimentDetails, (experiment: ExperimentDetails) => {
      if (experiment && !this.isActiveExperiment) {
        this.isActiveExperiment = true;
        this.detect();
      } else if (!experiment && this.isActiveExperiment) {
        this.isActiveExperiment = false;
        this.detect();
      }
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(ExperimentsClose);
  }

}
