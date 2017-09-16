import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaphorComponent } from './metaphor.component';

describe('MetaphorComponent', () => {
  let component: MetaphorComponent;
  let fixture: ComponentFixture<MetaphorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetaphorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaphorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
