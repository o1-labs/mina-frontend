import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { MinaSdkService } from '@core/services/mina-sdk.service';
import { ExplorerScanStateTree } from '@shared/types/explorer/scan-state/explorer-scan-state-tree.type';
import { ExplorerScanStateResponse } from '@shared/types/explorer/scan-state/explorer-scan-state-response.type';

@Injectable({
  providedIn: 'root',
})
export class ExplorerScanStateService {

  constructor(private sdk: MinaSdkService) { }

  getScanState(height: number): Observable<ExplorerScanStateResponse> {
    const client = this.sdk.client;
    return from(Promise.all([
      // blockScanState is not part of the daemon's public schema (it exists
      // on instrumented builds only), so it stays a raw query.
      client.executeQuery<{ blockScanState: any }>(
        'query BlockScanState($height: Int!) { blockScanState(height: $height) }',
        { height },
        'block_scan_state',
      ),
      client.getBlock({ height }),
      client.getBestChain(1),
    ]))
      .pipe(map(([scanStateResponse, block, bestChain]) => {
        const scanState = scanStateResponse.blockScanState.scan_state.map((leafs: any) => ({
          leafs: leafs.map((leaf: any[]) => [leaf[0], leaf[1], (leaf[2] && Array.isArray(leaf[2])) ? leaf[2] : [leaf[2]], leaf[3], leaf[4]]),
          done: leafs.filter((l: any[]) => l[4] === 'Done').length,
          todo: leafs.filter((l: any[]) => l[4] === 'Todo').length,
          empty: leafs.filter((l: any[]) => !l[4]).length,
        } as ExplorerScanStateTree));
        const txCount = scanStateResponse.blockScanState.transactions.length;
        const snarksCount = (block.snarkJobs ?? []).length;
        const firstBlock = bestChain[0].height;
        const userCommandsCount = block.userCommands.length;
        const feeTransferCount = block.feeTransfers.length;
        const zkappCommandsCount = (block.zkappCommands ?? []).length;
        return { scanState, txCount, snarksCount, firstBlock, userCommandsCount, feeTransferCount, zkappCommandsCount };
      }));
  }
}
