import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchMapComponent } from './branch-map.component';

describe('BranchMapComponent', () => {
  let component: BranchMapComponent;
  let fixture: ComponentFixture<BranchMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
