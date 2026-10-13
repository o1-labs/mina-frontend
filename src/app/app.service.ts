import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MinaSdkService } from '@core/services/mina-sdk.service';
import { CONFIG } from '@shared/constants/config';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';
import {
  catchError,
  concatAll,
  defaultIfEmpty,
  EMPTY,
  from,
  map,
  Observable,
  of,
  switchMap,
  take,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private sdk: MinaSdkService, private http: HttpClient) {}

  getActiveNode(nodes: MinaNode[]): Observable<MinaNode | null> {
    if (CONFIG.nodeLister) {
      return of(nodes[0]);
    }
    const nodeName = new URL(location.href).searchParams.get('node');
    const configs = nodes;
    const nodeFromURL = configs.find((c) => c.name === nodeName) || configs[0];
    const nodeNameWasFound = configs.some((c) => c.name === nodeName);

    configs.splice(configs.indexOf(nodeFromURL), 1);
    configs.unshift(nodeFromURL);

    let onlineNode: MinaNode = nodeFromURL;

    return from(
      configs.map((node) =>
        // A node is online when it answers a best-chain query.
        this.sdk
          .callOn(node.graphql + '/graphql', (client) => client.getBestChain(1))
          .pipe(
            map(() => node),
            switchMap(() => {
              if (nodeNameWasFound) {
                return of(node);
              } else {
                onlineNode = node;
                return this.getDebuggerStatus(node);
              }
            }),
            catchError(() => EMPTY)
          )
      )
    ).pipe(
      concatAll(),
      defaultIfEmpty(null),
      take(1),
      map(() => onlineNode)
    );
  }

  private getDebuggerStatus(node: MinaNode): Observable<MinaNode> {
    return this.http
      .get<string>(`${node.debugger}/version`)
      .pipe(map(() => node));
  }

  getNodes(): Observable<MinaNode[]> {
    if (CONFIG.nodeLister) {
      return this.http
        .get<MinaNode[]>(
          CONFIG.nodeLister.domain + ':' + CONFIG.nodeLister.port + '/nodes'
        )
        .pipe(
          map((response: any[]) => {
            return response.map((node: any) => ({
              name: node.ip,
              graphql:
                CONFIG.nodeLister.domain +
                ':' +
                node.graphql_port +
                '/' +
                node.ip,
              'tracing-graphql':
                CONFIG.nodeLister.domain + ':' + node.internal_trace_port,
            }));
          })
        );
    }
    return of(CONFIG.configs);
  }
}
