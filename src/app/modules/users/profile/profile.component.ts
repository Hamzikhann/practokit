import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  editMode: boolean = false;
  updateProfile: {
    firstName: string;
    lastName: string;
  } = { firstName: '', lastName: '' };

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    let user: any = localStorage.getItem('user');
    this.currentUser = JSON.parse(user);
    console.log(this.currentUser);
    this.updateProfile.firstName = this.currentUser.firstName;
    this.updateProfile.lastName = this.currentUser.lastName;
  }

  editProfile() {
    var error = '';

    if (!this.updateProfile.firstName) {
      error = 'First Name required!';
    } else if (!this.updateProfile.lastName) {
      error = 'Last Name required!';
    } else if (
      this.updateProfile.firstName == this.currentUser.firstName &&
      this.updateProfile.lastName == this.currentUser.lastName
    ) {
      error = 'No Changes Occured!';
    }

    if (error) {
      this.toastr.info(error);
    } else {
      var payload = {
        firstName: this.updateProfile.firstName,
        lastName: this.updateProfile.lastName,
      };

      this.userService.updateProfile(payload).subscribe((res: any) => {
        const user: any = res.body['user'];
        console.log(user);
        this.toastr.success('Profile Updated successfully');
        this.authService.storeUserData(null, user);
        this.authService.setUser(user);
        this.editMode = false;
      });
    }
  }
}
