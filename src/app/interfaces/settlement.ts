export interface Settlement {
  readonly id: string;
  readonly createdAt: Date;
  readonly title: string;
  readonly path: string;
  readonly sellerEmail: string;
  readonly amount: number;
  readonly userId: string;
}
