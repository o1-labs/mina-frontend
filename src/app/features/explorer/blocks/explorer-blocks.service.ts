import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BlockZkappCommand } from '@o1-labs/mina-sdk';
import { ExplorerBlock } from '@shared/types/explorer/blocks/explorer-block.type';
import { MinaSdkService } from '@core/services/mina-sdk.service';
import { toReadableDate } from '@shared/helpers/date.helper';
import { ExplorerBlockTx } from '@shared/types/explorer/blocks/explorer-block-tx.type';
import { ExplorerBlockZkApp } from '@shared/types/explorer/blocks/explorer-block-zk-app-type';
import { ONE_BILLION } from '@shared/constants/unit-measurements';

@Injectable({
  providedIn: 'root',
})
export class ExplorerBlocksService {

  constructor(private sdk: MinaSdkService) { }

  getBlocks(): Observable<ExplorerBlock[]> {
    return this.sdk.call(client => client.getBestChain())
      .pipe(
        map(blocks => blocks.map(block => {
          const userCommands = block.userCommands ?? [];
          const feeTransfers = block.feeTransfers ?? [];
          const zkappCommands = block.zkappCommands ?? [];
          return {
            height: block.height,
            globalSlot: block.globalSlotSinceGenesis,
            hash: block.stateHash,
            txCount: userCommands.length,
            totalTxCount: userCommands.length + feeTransfers.length + zkappCommands.length + 1,
            snarkCount: (block.snarkJobs ?? []).length,
            zkAppsCount: zkappCommands.length,
            date: toReadableDate(block.date),
            timestamp: Number(block.date),
            snarkedLedgerHash: block.snarkedLedgerHash,
            stagedLedgerHash: block.stagedLedgerHash,
          } as ExplorerBlock;
        })),
      );
  }

  getTxs(height: number): Observable<ExplorerBlockTx[]> {
    return this.sdk.call(client => client.getBlock({ height }))
      .pipe(
        // The table shows amounts in MINA; the type's strings come from the
        // old raw response, the values have always been numbers here.
        map(block => block.userCommands.map(tx => ({
          to: tx.receiver,
          from: tx.source,
          amount: Number(tx.amount) / ONE_BILLION,
          fee: Number(tx.fee) / ONE_BILLION,
          id: tx.id,
          hash: tx.hash,
          memo: tx.memo,
          nonce: Number(tx.nonce),
        } as unknown as ExplorerBlockTx))),
      );
  }

  getZkApps(height: number): Observable<ExplorerBlockZkApp[]> {
    return this.sdk.call(client => client.getBlock({ height }))
      .pipe(
        map(block => (block.zkappCommands ?? []).map((zk: BlockZkappCommand) => ({
          id: zk.id,
          hash: zk.hash,
          updates: zk.zkappCommand.accountUpdates.length,
          failures: (zk.failureReason ?? []).length,
          // The full data is shown as JSON; the SDK's shape replaces the old
          // raw response's.
          zkAppFullData: {
            ...zk,
            id: zk.id.slice(0, 6) + '...' + zk.id.slice(zk.id.length - 6),
          },
        } as unknown as ExplorerBlockZkApp))),
      );
  }
}
