import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { APP_CHANGE_SUB_MENUS, AppChangeSubMenus } from '@app/app.actions';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { ExperimentsClose, ExperimentsGet } from './experiments.actions';
import { Routes } from '@app/shared/enums/routes.enum';

@Component({
  selector: 'mina-experiments',
  templateUrl: './experiments.component.html',
  styleUrls: ['./experiments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100' },
})
export class ExperimentsComponent extends StoreDispatcher implements OnInit, OnDestroy {

  ngOnInit(): void {
    this.store.dispatch<AppChangeSubMenus>({ type: APP_CHANGE_SUB_MENUS, payload: [Routes.EXPERIMENTS] });
    this.dispatch(ExperimentsGet); 
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(ExperimentsClose);
  }

}
