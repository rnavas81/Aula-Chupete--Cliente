import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainParentComponent } from './main-parent.component';

describe('MainParentComponent', () => {
  let component: MainParentComponent;
  let fixture: ComponentFixture<MainParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainParentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
