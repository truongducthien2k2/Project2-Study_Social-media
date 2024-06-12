import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepotformComponent } from './repotform.component';

describe('RepotformComponent', () => {
  let component: RepotformComponent;
  let fixture: ComponentFixture<RepotformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepotformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepotformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
