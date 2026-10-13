import { Injectable } from '@angular/core';
import { MinaSdkService } from '@core/services/mina-sdk.service';
import { map, Observable, of } from 'rxjs';
import { NodeStatus } from '@shared/types/app/node-status.type';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@core/services/config.service';
import { CONFIG } from '@shared/constants/config';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';

@Injectable({
  providedIn: 'root',
})
export class BlockService {

  constructor(private sdk: MinaSdkService,
              private http: HttpClient,
              private config: ConfigService) { }

  getNodeStatus(): Observable<NodeStatus> {
    if (CONFIG.nodeLister) {
      return of({
        blockLevel: 1,
        status: AppNodeStatusTypes.SYNCED,
        timestamp: Date.now(),
      })
    }
    return this.sdk.call(client => client.getDaemonStatus())
      .pipe(
        map(status => ({
          blockLevel: status.blockchainLength ?? 0,
          status: status.syncStatus as AppNodeStatusTypes,
          timestamp: Number(status.consensusTimeNow?.startTime ?? 0),
        } as NodeStatus)),
      );
  }

  getDebuggerStatus(): Observable<boolean> {
    return this.http.get<string>(`${this.config.DEBUGGER}/version`).pipe(map(r => !!r));
  }
}
