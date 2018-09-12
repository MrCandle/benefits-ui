import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitEditComponent } from './benefit-edit.component';

describe('BenefitEditComponent', () => {
  let component: BenefitEditComponent;
  let fixture: ComponentFixture<BenefitEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenefitEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
