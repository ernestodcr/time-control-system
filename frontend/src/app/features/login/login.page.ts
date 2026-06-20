import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  email: string = "";
  password: string = "";

  onSubmit(): void {
    console.log("Datos capturados listos enviar: ", this.email, this.password);
    
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('¡Conexión con Python exitosa! Datos del usuario:', response);
        
        localStorage.setItem("currentUser", JSON.stringify(response));
        
        this.router.navigate(["/dashboard"])
      },
      error: (err) => {
        console.error('Fallo en el inicio de sesión:', err);
      }
    });
  }
}
