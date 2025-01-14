import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ExperimentsRoutingModule } from './experiments-routing.module';
import { ExperimentsComponent } from './experiments.component';

@NgModule({
  declarations: [ExperimentsComponent],
  imports: [CommonModule, ExperimentsRoutingModule, MatProgressSpinnerModule],
})
export class ExperimentsModule {}
