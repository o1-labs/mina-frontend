import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExperimentDetails } from '@app/shared/types/experiments/experiments-details.type';

@Injectable({
  providedIn: 'root',
})
export class ExperimentsService {
  private readonly apiUrl = "http://65.21.209.217:3003/api/experiments"; // Will be replaced by Webpack DefinePlugin

  constructor(private readonly http: HttpClient) {}

  getExperiments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getExperimentDetails(experimentName: string): Observable<ExperimentDetails[]> {
    // Note: API returns array, we'll take the first item in the effect
    return this.http.get<ExperimentDetails[]>(`http://65.21.209.217:3003/api/experiment/${experimentName}`);
  }
}
