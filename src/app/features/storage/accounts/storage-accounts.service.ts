import { Injectable } from '@angular/core';
import { MinaSdkService } from '@core/services/mina-sdk.service';
import { delay, map, Observable, of } from 'rxjs';
import { StorageAccount } from '@shared/types/storage/accounts/storage-account.type';
import { WALLETS } from '@benchmarks/wallets/benchmarks-wallets.service';

@Injectable({
  providedIn: 'root',
})
export class StorageAccountsService {

  constructor(private sdk: MinaSdkService) { }

  getAccounts(filters: string[], start: number, size: number): Observable<StorageAccount[]> {
    const walletsSlice = WALLETS.slice(0, 40);
    return this.sdk.call(client => Promise.all(
      walletsSlice.map(wallet => client.getAccount(wallet.publicKey)),
    ))
      .pipe(
        map(accounts => accounts.map((account, i: number) => ({
          publicKey: walletsSlice[i].publicKey,
          tokenId: account.tokenId,
          tokenSymbol: account.tokenSymbol,
          balance: { total: account.balance.total.toNanominaString() },
          nonce: account.nonce,
          timing: account.timing,
          votingFor: account.votingFor,
          zkappUri: account.zkappUri,
          zkappState: account.zkappState,
          permissions: account.permissions,
        } as StorageAccount))),
      );
  }

  getRevisionIds(): Observable<string[]> {
    return of({ revisionIds: ['B62qoyDCsPSAAyAdfMPfJBntwC4Ny4BF1SWW1Y8uxDA2wGALN3itGbr', 'B62qjdLNsPPmgMnuowkM5DNkY7eyEstWfL7ACn3SJkU3t15RE3YVbHc', 'B62qqvxSokGBKd88wyTrEzr8S1s2LDLGtbd1eJo6izrc72bJHLn2PYA'] }).pipe(delay(100))
      .pipe(
        map((gqlResponse: any) => gqlResponse.revisionIds),
      );
  }
}
