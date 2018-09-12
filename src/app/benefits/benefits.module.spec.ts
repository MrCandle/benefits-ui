import { BenefitsModule } from './benefits.module';

describe('BenefitsModule', () => {
  let benefitsModule: BenefitsModule;

  beforeEach(() => {
    benefitsModule = new BenefitsModule();
  });

  it('should create an instance', () => {
    expect(benefitsModule).toBeTruthy();
  });
});
