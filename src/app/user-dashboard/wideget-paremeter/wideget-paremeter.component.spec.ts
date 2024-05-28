import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidegetParemeterComponent } from './wideget-paremeter.component';

describe('WidegetParemeterComponent', () => {
  let component: WidegetParemeterComponent;
  let fixture: ComponentFixture<WidegetParemeterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidegetParemeterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidegetParemeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
