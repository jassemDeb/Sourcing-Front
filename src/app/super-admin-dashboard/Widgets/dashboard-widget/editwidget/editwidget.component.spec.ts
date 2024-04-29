import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditwidgetComponent } from './editwidget.component';

describe('EditwidgetComponent', () => {
  let component: EditwidgetComponent;
  let fixture: ComponentFixture<EditwidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditwidgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditwidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
