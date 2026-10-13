import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MinaSdkService } from '@core/services/mina-sdk.service';
import { ExplorerSnark } from '@shared/types/explorer/snarks/explorer-snarks.type';

@Injectable({
  providedIn: 'root',
})
export class ExplorerSnarksService {

  constructor(private sdk: MinaSdkService) { }

  getSnarks(): Observable<ExplorerSnark[]> {
    return this.sdk.call(client => client.getSnarkPool())
      .pipe(
        map(works => works
          .map(work => ({
            fee: work.fee.toNanominaString(),
            prover: work.prover,
            workIds: work.workIds.join(', '),
          } as ExplorerSnark)),
        ),
      );
  }
}
