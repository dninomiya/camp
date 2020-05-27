import { CustomerPipe } from './customer.pipe';

describe('CustomerPipe', () => {
  it('create an instance', () => {
    const pipe = new CustomerPipe();
    expect(pipe).toBeTruthy();
  });
});
