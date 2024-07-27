import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnChanges {
  userForm: FormGroup;
  @Input() userToEdit: any = null;
  @Output() userAdded = new EventEmitter<any>();
  @Output() userUpdated = new EventEmitter<any>();
  @Output() formReset = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.maxLength(50)]],
      lastname: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.maxLength(50)]],
      website: ['', [Validators.required]]
    });
  }

  ngOnChanges() {
    if (this.userToEdit) {
      this.userForm.patchValue(this.userToEdit);
    } else {
      this.userForm.reset();
    }
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }

    if (this.userToEdit) {
      // Update existing user
      const updatedUser = { ...this.userToEdit, ...this.userForm.value };
      this.userService.updateUser(updatedUser).subscribe({
        next: (response) => {
          this.userUpdated.emit(response);
          this.userForm.reset();
          this.formReset.emit(); // Emit event to reset form state in parent component
          console.log(response);
        },
        error: (error) => {
          console.error('An error occurred:', error);
        }
      });
    } else {
      // Add new user
      this.userService.addUser(this.userForm.value).subscribe({
        next: (response) => {
          this.userAdded.emit(response);
          this.userForm.reset();
          console.log(response);
        },
        error: (error) => {
          console.error('An error occurred:', error);
        }
      });
    }
   
    }
    
}
