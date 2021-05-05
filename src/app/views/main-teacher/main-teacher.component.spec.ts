import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTeacherComponent } from './main-teacher.component';

describe('MainTeacherComponent', () => {
  let component: MainTeacherComponent;
  let fixture: ComponentFixture<MainTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainTeacherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
