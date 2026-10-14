import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Currency } from '@o1-labs/mina-sdk';
import { MinaSdkService } from '@core/services/mina-sdk.service';
import { ExplorerTransaction } from '@shared/types/explorer/transactions/explorer-transaction.type';
import { ExplorerSignedTransaction } from '@shared/types/explorer/transactions/explorer-signed-transaction.type';
import { ExplorerZkAppTransaction } from '@shared/types/explorer/transactions/explorer-zk-app-transaction.type';

@Injectable({
  providedIn: 'root',
})
export class ExplorerTransactionsService {

  constructor(private sdk: MinaSdkService) { }

  getTransactions(): Observable<ExplorerTransaction[]> {
    return this.sdk.call(client => client.getPooledUserCommands())
      .pipe(
        map(commands => commands
          .map(tx => ({
            id: tx.id,
            hash: tx.hash,
            fee: tx.fee,
            amount: Number(tx.amount),
            kind: tx.kind,
            nonce: tx.nonce,
            to: tx.to,
            from: tx.from,
            memo: tx.memo,
            status: 'pending',
          } as ExplorerTransaction)),
        ),
      );
  }

  /** Sends a payment that was signed outside the daemon (mina-signer). */
  sendSignedTx(tx: ExplorerSignedTransaction): Observable<any> {
    const input = tx.input;
    return this.sdk.call(client => client.sendPayment({
      sender: input.from,
      receiver: input.to,
      amount: Currency.fromNanomina(BigInt(input.amount)),
      fee: Currency.fromNanomina(BigInt(input.fee)),
      memo: input.memo || undefined,
      nonce: input.nonce ? Number(input.nonce) : undefined,
      validUntil: input.validUntil ? Number(input.validUntil) : undefined,
      signature: { field: tx.signature.field, scalar: tx.signature.scalar },
    }));
  }

  sendZkAppTx(tx: ExplorerZkAppTransaction): Observable<any> {
    return this.sdk.call(client => client.sendZkapp(tx.input.zkappCommand));
  }
}
