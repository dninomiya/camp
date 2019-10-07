export interface Tip {
  title: string;
  id: string;
}

export interface Tips {
  [keyName: string]: Tip;
}
