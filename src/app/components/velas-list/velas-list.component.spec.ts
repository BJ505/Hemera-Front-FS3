import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VelasListComponent } from './velas-list.component';

describe('VelasListComponent', () => {
  let component: VelasListComponent;
  let fixture: ComponentFixture<VelasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VelasListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VelasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
