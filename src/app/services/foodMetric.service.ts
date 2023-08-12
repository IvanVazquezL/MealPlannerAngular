import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FoodMetric } from '../models/foodMetric.model';
import { map } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable({
    providedIn: 'root'
})

export class FoodMetricService {

  constructor( private http: HttpClient ) { }

  createFoodMetric(foodMetric: FoodMetric) {
    const url = `${ base_url }/foodMetrics`;
    return this.http.post( url, foodMetric);
  }

  getAllFoodMetrics() {
    const url = `${ base_url }/foodMetrics`;
    return this.http.get(url)
      .pipe(
          map( (resp: any) => resp.foodMetrics )
      );
  }
}
