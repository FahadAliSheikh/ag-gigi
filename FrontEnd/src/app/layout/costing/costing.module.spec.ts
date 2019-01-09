import { CostingModule } from './costing.module';

describe('CostingModule', () => {
  let costingModule: CostingModule;

  beforeEach(() => {
    costingModule = new CostingModule();
  });

  it('should create an instance', () => {
    expect(costingModule).toBeTruthy();
  });
});
