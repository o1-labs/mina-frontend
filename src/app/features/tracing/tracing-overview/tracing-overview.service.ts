import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TracingOverviewCheckpoint } from '@shared/types/tracing/overview/tracing-overview-checkpoint.type';
import { TracingOverviewCheckpointColumn } from '@shared/types/tracing/overview/tracing-overview-checkpoint-column.type';
import { TracingGraphQlService } from '@core/services/tracing-graph-ql.service';
import { TracingOverviewCheckpointFilter } from '@app/shared/types/tracing/overview/tracing-overview-checkpoint-filter.type';

@Injectable({
  providedIn: 'root',
})
export class TracingOverviewService {

  constructor(private tracingGQL: TracingGraphQlService) { }

  getDeployments(): Observable<number[]> {
    return this.tracingGQL.query<any>('deployments', '{ deployments }').pipe(
      map(response => response.deployments.map((d: any) => d)),
    );
  }

  getNodes(deploymentId: number): Observable<TracingOverviewCheckpointFilter[]> {
    const query = `{ nodes(deployment_id: ${deploymentId}) }`
    return this.tracingGQL.query<any>('nodes', query).pipe(
      map(response => response.nodes.map((n: any) => n)),
    );
  }

   getStatistics(filter: TracingOverviewCheckpointFilter): Observable<TracingOverviewCheckpoint[]> {
    if (!filter) {
      return new Observable<TracingOverviewCheckpoint[]>(subscriber => {
        subscriber.next([]);
        subscriber.complete();
      });
    }
    
    const query = `{ blockTracesDistribution(deploymentId: ${filter.deployment}, node_name: "${filter.name}") }`;

    return this.tracingGQL.query<any>('blockTracesDistribution', query).pipe(
      map(response => 
        this.mapStatisticsResponse(response.blockTracesDistribution)),
    );
  }

  private mapStatisticsResponse(response: any[]): TracingOverviewCheckpoint[] {
    return response.reverse().map(r => ({
      title: r.identity.split('_').join(' '),
      totalTime: r.totalTime,
      totalCount: r.count,
      columns: this.getColumns(r),
    }));
  }

  private getColumns(response: any): TracingOverviewCheckpointColumn[] {
    delete response.identity;
    delete response.totalTime;
    delete response.count;
    return Object.keys(response).map((key: string) => ({
      totalTime: response[key].totalTime,
      meanTime: response[key].meanTime,
      maxTime: response[key].maxTime,
      count: response[key].count,
      squareCount: this.getSquareCount(response[key].totalTime),
    } as TracingOverviewCheckpointColumn));
  }

  private getSquareCount(totalTimeInSeconds: number): number {
    const TEN_MICROSECONDS_FACTOR = 100000;
    let squareCount = 0;
    let timeInTenMicroseconds = totalTimeInSeconds * TEN_MICROSECONDS_FACTOR;
    while (timeInTenMicroseconds > 1) {
      timeInTenMicroseconds /= 10;
      squareCount++;
    }
    return Math.min(squareCount, 9);
  }
}
