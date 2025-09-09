import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExperimentDetails } from '@app/shared/types/experiments/experiments-details.type';

@Injectable({
  providedIn: 'root',
})
export class ExperimentsService {
  private readonly apiUrl = EXPERIMENTS_BACKEND_API_ENDPOINT; // Will be replaced by Webpack DefinePlugin

  constructor(private readonly http: HttpClient) {}

  getExperiments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getExperimentDetails(experimentName: string): Observable<ExperimentDetails[]> {
    // Note: API returns array, we'll take the first item in the effect
    const url = `${this.apiUrl.replace('/experiments', '')}/experiment/${experimentName}`;
    return this.http.get<ExperimentDetails[]>(url);
  }
}
