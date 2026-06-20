import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
})
export class DashboardPage implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private router = inject(Router);

  user: any = null;
  currentTime: string = "00:00:00";
  currentDate: string = "";
  private clockInterval: any;
  fichajesList: any[] = [];

  ngOnInit(): void {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      this.user = JSON.parse(savedUser);
      this.cargarHistorial();
    }
    this.updateClock();
    this.clockInterval = setInterval(() => this.updateClock(), 1000)
  }

  ngOnDestroy(): void {
    if (this.clockInterval){
      clearInterval(this.clockInterval)
    }
  }

  cargarHistorial(): void {
    if (!this.user || !this.user.id) return;

    this.authService.getFichajes(this.user.id).subscribe({
      next: (data) => {
        this.fichajesList = data;
        console.log('Historial real cargado desde SQLite:', this.fichajesList);
        this.cdr.detectChanges(); // Forzamos a Angular a pintar la lista real en el monitor
      },
      error: (err) => {
        console.error('Error al cargar el historial:', err);
      }
    });
  }

  fichar(tipo: "entrada" | "salida"): void {
    if (!this.user || !this.user.id) {
      alert('Error: No se ha detectado ninguna sesión de empleado activa.');
      return;
    }
    let idLimpio = 0;
    
    if (Array.isArray(this.user.id)) {
      idLimpio = Number(this.user.id[0]);
    } else if (typeof this.user.id === 'object' && this.user.id !== null) {
      idLimpio = Number(this.user.id[0] || this.user.id.id || 0);
    } else {
      idLimpio = Number(this.user.id);
    }

    if (!idLimpio || isNaN(idLimpio)) {
      alert('Error técnico: El formato del ID del empleado no es válido.');
      return;
    }

    console.log(`Enviando fichaje a Python -> Empleado ID: ${idLimpio}, Tipo: ${tipo}`)

    this.authService.registrarFichaje(idLimpio, tipo).subscribe({
      next: (response) => {
        console.log('Fichaje guardado en SQLite:', response);
        alert(`¡Fichaje de ${tipo.toUpperCase()} registrado con éxito a las ${this.currentTime}!`);
        this.cargarHistorial();
      },
      error: (err) => {
        console.error('Error al registrar fichaje:', err);
        alert('Hubo un problema de conexión al guardar tu marca.');
      }
    });
  }

  logout(): void{
    localStorage.removeItem("currentUser");
    this.router.navigate(["/login"])
  }

  private updateClock(): void {
    const now = new Date();
    this.currentTime = now.toTimeString().split(' ')[0];

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    }
    this.currentDate = now.toLocaleDateString("es-ES", options);
    this.currentDate = this.currentDate.charAt(0).toUpperCase() + this.currentDate.slice(1);
    this.cdr.detectChanges();
  }
}
