import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CopyComponent } from '@app/shared/components/copy/copy.component';
import { SharedModule } from '@shared/shared.module';
import { ExperimentsRoutingModule } from './experiments-routing.module';
import { ExperimentsComponent } from './experiments.component';

@NgModule({
  declarations: [ExperimentsComponent],
  imports: [
    CommonModule,
    SharedModule,
    CopyComponent,
    ExperimentsRoutingModule,
    MatProgressSpinnerModule,
  ],
})
export class ExperimentsModule {}
