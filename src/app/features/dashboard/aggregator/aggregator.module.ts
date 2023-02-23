import { NgModule } from '@angular/core';

import { AggregatorComponent } from './aggregator.component';
import { DashboardTableComponent } from './dashboard-table/dashboard-table.component';
import { AggregatorRouting } from '@dashboard/aggregator/aggregator.routing';
import { SharedModule } from '@shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { AggregatorEffects } from '@dashboard/aggregator/aggregator.effects';
import { DashboardToolbarComponent } from './dashboard-toolbar/dashboard-toolbar.component';
import { DashboardSidePanelComponent } from './dashboard-side-panel/dashboard-side-panel.component';


@NgModule({
  declarations: [
    AggregatorComponent,
    DashboardTableComponent,
    DashboardToolbarComponent,
    DashboardSidePanelComponent,
  ],
  imports: [
    SharedModule,
    AggregatorRouting,
    EffectsModule.forFeature([AggregatorEffects]),
  ],
})
export class AggregatorModule {}