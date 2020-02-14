export interface Settlement {
  readonly id: string;
  readonly createdAt: any;
  readonly title: string;
  readonly path: string;
  readonly sellerEmail: string;
  readonly amount: number;
  readonly userId: string;
  readonly type: string;
  readonly contentId: string;
}
