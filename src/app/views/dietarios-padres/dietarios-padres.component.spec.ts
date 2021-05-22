import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietariosPadresComponent } from './dietarios-padres.component';

describe('DietariosPadresComponent', () => {
  let component: DietariosPadresComponent;
  let fixture: ComponentFixture<DietariosPadresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DietariosPadresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DietariosPadresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
