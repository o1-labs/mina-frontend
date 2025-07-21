import { NgModule } from '@angular/core';
import { TracingOverviewComponent } from './tracing-overview.component';
import { TracingOverviewRouting } from '@tracing/tracing-overview/tracing-overview.routing';
import { SharedModule } from '@shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { TracingOverviewEffects } from '@tracing/tracing-overview/tracing-overview.effects';
import { TracingOverviewGraphListComponent } from './tracing-overview-graph-list/tracing-overview-graph-list.component';
import { TracingOverviewToolbarComponent } from './tracing-overview-toolbar/tracing-overview-toolbar.component';
import { FlameTimeGraphComponent } from '@shared/components/flame-time-graph/flame-time-graph/flame-time-graph.component';
import { TracingOverviewFiltersComponent } from './tracing-overview-filters/tracing-overview-filters.component';
import { HorizontalMenuComponent } from '@app/shared/components/horizontal-menu/horizontal-menu.component';


@NgModule({
  declarations: [
    TracingOverviewComponent,
    TracingOverviewGraphListComponent,
    TracingOverviewToolbarComponent,
    TracingOverviewFiltersComponent,
  ],
  imports: [
    SharedModule,
    TracingOverviewRouting,
    EffectsModule.forFeature([TracingOverviewEffects]),
    FlameTimeGraphComponent,
    HorizontalMenuComponent,
  ],
})
export class TracingOverviewModule {}

