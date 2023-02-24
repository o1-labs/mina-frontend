export interface ExplorerBlock {
  height: number;
  globalSlot: number;
  hash: string;
  txCount: number;
  totalTxCount: number;
  snarkCount: number;
  date: string;
  timestamp: number;
  snarkedLedgerHash: string;
  stagedLedgerHash: string;
}
