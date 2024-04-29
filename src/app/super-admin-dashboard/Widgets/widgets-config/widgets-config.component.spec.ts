import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsConfigComponent } from './widgets-config.component';

describe('WidgetsConfigComponent', () => {
  let component: WidgetsConfigComponent;
  let fixture: ComponentFixture<WidgetsConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetsConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
