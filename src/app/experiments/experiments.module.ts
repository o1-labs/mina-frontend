import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CopyComponent } from '@app/shared/components/copy/copy.component';
import { SharedModule } from '@shared/shared.module';
import { ExperimentsRouting } from './experiments.routing';
import { ExperimentsComponent } from './experiments.component';
import { ExperimentsTableComponent } from './experiments-table/experiments-table.component';
import { ExperimentsToolbarComponent } from './experiments-toolbar/experiments-toolbar.component';
import { HorizontalMenuComponent } from '@shared/components/horizontal-menu/horizontal-menu.component';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { EffectsModule } from '@ngrx/effects';
import { ExperimentsEffects } from './experiments.effects';
import { ExperimentsSidePanelComponent } from './experiments-side-panel/experiments-side-panel.component';
import { MinaJsonViewerComponent } from '@shared/components/mina-json-viewer/mina-json-viewer.component';

@NgModule({
  declarations: [
    ExperimentsComponent,
    ExperimentsTableComponent,
    ExperimentsToolbarComponent,
    ExperimentsSidePanelComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CopyComponent,
    ExperimentsRouting,
    MatProgressSpinnerModule,
    HorizontalMenuComponent,
    EffectsModule.forFeature([ExperimentsEffects]),
    HorizontalResizableContainerComponent,
    MinaJsonViewerComponent,
  ],
})
export class ExperimentsModule {}
