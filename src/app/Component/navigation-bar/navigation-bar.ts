import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  imports: [],
  templateUrl: './navigation-bar.html',
  styleUrl: './navigation-bar.css',
})
export class NavigationBar implements OnInit {
  userName: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        this.userName = user.name;
      }
    }
  }

  logout() {
    localStorage.removeItem('user');
    // poora app fresh reload hoga — component destroy aur reinitialize hoga
    window.location.href = '/login';
  }
}