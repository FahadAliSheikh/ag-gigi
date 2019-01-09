import { PackagesModule } from './packages.module';

describe('PackagesModule', () => {
  let packagesModule: PackagesModule;

  beforeEach(() => {
    packagesModule = new PackagesModule();
  });

  it('should create an instance', () => {
    expect(packagesModule).toBeTruthy();
  });
});
