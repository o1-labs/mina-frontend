import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExperimentsComponent } from './experiments.component';
import { EXPERIMENTS_TITLE } from '@app/app.routing';

const routes: Routes = [
  {
    path: '',
    component: ExperimentsComponent,
    children: [
      {
        path: ':exp',
        component: ExperimentsComponent,
        title: EXPERIMENTS_TITLE,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExperimentsRouting {}
