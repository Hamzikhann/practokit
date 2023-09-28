import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  loading: boolean = true;
  currentUser: any;

  constructor(public router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    this.currentUser = user ? JSON.parse(user) : null;
    this.authService.getUser().subscribe((res) => {
      this.currentUser = res;
      this.loading = false;
    });
    // console.log('user: ', this.currentUser)
  }

  logOut() {
    this.authService.logOut();
  }
}
