import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  credentials = { email: '', password: '' };
  loading = false;
  error = '';
  showPassword = false;

  login() {
    if (!this.credentials.email || !this.credentials.password) {
      this.error = 'Please enter your email and password.';
      return;
    }
    this.loading = true;
    this.error = '';

    this.auth.login(this.credentials).subscribe({
      next: () => this.router.navigate(['/admin/dashboard']),
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Invalid credentials. Please try again.';
      }
    });
  }
}
