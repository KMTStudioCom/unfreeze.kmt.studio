export enum UnfreezeStatus {
  FROZEN = "FROZEN", // 凍結未送出
  PENDING = "PENDING", // 送出等待審議
  APPROVED = "APPROVED", // 審議通過
  UNFROZEN = "UNFROZEN", // 已解凍
}

export interface UnfreezeCase {
  id: string;
  status: UnfreezeStatus;
  committee: string;
  amount: number;
  submittedAt?: Date;
  approvedAt?: Date;
  unfreezedAt?: Date;
}

export interface CommitteeProgress {
  committee: string;
  totalCases: number;
  statusCounts: Record<UnfreezeStatus, number>;
  progress: number;
}
