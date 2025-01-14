import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExperimentsService {
  private readonly apiUrl = EXPERIMENTS_BACKEND_API_ENDPOINT; // Will be replaced by Webpack DefinePlugin

  constructor(private readonly http: HttpClient) {}

  getExperiments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
