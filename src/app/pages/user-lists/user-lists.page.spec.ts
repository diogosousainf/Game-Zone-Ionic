import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListsPage } from './user-lists.page';

describe('UserListsPage', () => {
  let component: UserListsPage;
  let fixture: ComponentFixture<UserListsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
