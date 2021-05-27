import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietariosComponent } from './dietarios.component';

describe('DietariosComponent', () => {
  let component: DietariosComponent;
  let fixture: ComponentFixture<DietariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DietariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DietariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
