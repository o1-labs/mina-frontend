import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { FeatureGuard } from '@core/guards/feature.guard';
import { getFirstFeature } from '@shared/constants/config';

const APP_TITLE: string = 'Open Mina';

export const RESOURCES_TITLE: string = APP_TITLE + ' - Resources';
export const NETWORK_TITLE: string = APP_TITLE + ' - Network';
export const TRACING_TITLE: string = APP_TITLE + ' - Tracing';
export const WEB_NODE_TITLE: string = APP_TITLE + ' - Web Node';
export const BENCHMARKS_TITLE: string = APP_TITLE + ' - Benchmarks';
export const DASHBOARD_TITLE: string = APP_TITLE + ' - Dashboard';
export const EXPLORER_TITLE: string = APP_TITLE + ' - Explorer';
export const LOGS_TITLE: string = APP_TITLE + ' - Logs';
export const STORAGE_TITLE: string = APP_TITLE + ' - Storage';
export const DSW_TITLE: string = APP_TITLE + ' - Snark Worker';
export const EXPERIMENTS_TITLE: string = APP_TITLE + ' - Experiments';

const routes: Routes = [
  {
    path: 'resources',
    loadChildren: () =>
      import('@resources/resources.module').then((m) => m.ResourcesModule),
    title: RESOURCES_TITLE,
    canActivate: [FeatureGuard],
  },
  {
    path: 'network',
    loadChildren: () =>
      import('@network/network.module').then((m) => m.NetworkModule),
    title: NETWORK_TITLE,
    canActivate: [FeatureGuard],
  },
  {
    path: 'tracing',
    loadChildren: () =>
      import('@tracing/tracing.module').then((m) => m.TracingModule),
    title: TRACING_TITLE,
    canActivate: [FeatureGuard],
  },
  {
    path: 'web-node',
    loadChildren: () =>
      import('@web-node/web-node.module').then((m) => m.WebNodeModule),
    title: WEB_NODE_TITLE,
    canActivate: [FeatureGuard],
  },
  {
    path: 'benchmarks',
    loadChildren: () =>
      import('@benchmarks/benchmarks.module').then((m) => m.BenchmarksModule),
    title: BENCHMARKS_TITLE,
    // canActivate: [FeatureGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('@dashboard/dashboard.module').then((m) => m.DashboardModule),
    title: DASHBOARD_TITLE,
    canActivate: [FeatureGuard],
  },
  {
    path: 'explorer',
    loadChildren: () =>
      import('@explorer/explorer.module').then((m) => m.ExplorerModule),
    title: EXPLORER_TITLE,
    canActivate: [FeatureGuard],
  },
  {
    path: 'storage',
    loadChildren: () =>
      import('@storage/storage.module').then((m) => m.StorageModule),
    title: STORAGE_TITLE,
    canActivate: [FeatureGuard],
  },
  {
    path: 'snark-worker',
    loadChildren: () => import('@dsw/dsw.module').then((m) => m.DswModule),
    title: DSW_TITLE,
    canActivate: [FeatureGuard],
  },
  {
    path: 'experiments',
    loadChildren: () =>
      import('./experiments/experiments.module').then(
        (m) => m.ExperimentsModule
      ),
    title: EXPERIMENTS_TITLE,
  },
  {
    path: '**',
    redirectTo: getFirstFeature(),
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // enableTracing: true,
      preloadingStrategy: PreloadAllModules,
      onSameUrlNavigation: 'ignore',
      initialNavigation: 'enabledNonBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRouting {}
