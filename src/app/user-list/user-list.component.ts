import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  displayedUsers: any[] = [];
  userToEdit: any = null;
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  isEditing = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.updatePagination();
      this.updateCurrentUsers();
    });
  }

  addUser(user: any): void {
    this.users.push(user);
    this.updatePagination();
    this.updateCurrentUsers();
  }

  updateUser(user: any): void {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index > -1) {
      this.users[index] = { ...user }; // Ensure the user is updated correctly
      this.updatePagination();
      this.updateCurrentUsers();
      this.isEditing = false;
      console.log(`User with ID ${user.id} has been updated`);
    } else {
      console.error(`User with ID ${user.id} not found`);
    }
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== userId);
          this.updatePagination();
          this.updateCurrentUsers();
          console.log('User deleted with id:', userId);
          alert(`Id ${userId} is Deleted`);
        },
        error: (error) => {
          console.error('An error occurred:', error);
        }
      });
    }
  }

  editUser(user: any): void {
    this.userToEdit = { ...user }; // Clone user to avoid direct modification
    this.isEditing = true;
  }

  onUserAdded(user: any): void {
    this.addUser(user);
    this.userToEdit = null;
    this.isEditing = false;
  }

  onUserUpdated(user: any): void {
    this.updateUser(user);
    this.userToEdit = null;
    this.isEditing = false;
  }

  onFormReset(): void {
    this.userToEdit = null;
    this.isEditing = false;
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.users.length / this.pageSize);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  updateCurrentUsers(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedUsers = this.users.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateCurrentUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateCurrentUsers();
    }
  }
}
