import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusFormularioComponent } from './menus-formulario.component';

describe('MenusFormularioComponent', () => {
  let component: MenusFormularioComponent;
  let fixture: ComponentFixture<MenusFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenusFormularioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenusFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
