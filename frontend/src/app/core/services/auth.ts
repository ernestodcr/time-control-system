import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private apiUrl = "http://localhost:8000/api/auth";
  private fichajesUrl = 'http://localhost:8000/api/fichajes';

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.apiUrl}/login`, body);
  }

  registrarFichaje(empleadoId: number, tipo: "entrada" | "salida"): Observable<any> {
    const body = { empleado_id: empleadoId, tipo }
    return this.http.post(`${this.fichajesUrl}/registrar`, body);
  }

  getFichajes(empleadoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.fichajesUrl}/empleado/${empleadoId}`);
  }
}
