import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VelaFormComponent } from './vela-form.component';

describe('VelaFormComponent', () => {
  let component: VelaFormComponent;
  let fixture: ComponentFixture<VelaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VelaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VelaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
