import { StringLiteralLike } from "typescript";

export type BillType = {
  time: Date;
  /** 1 stands for income, */
  type: 1 | 0;
  category?: string;
  amount: number;
};
export type BillCategoryType = {
  id: string;
  name: string;
  type: 1 | 0;
};
