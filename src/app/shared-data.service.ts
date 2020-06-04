import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  APP_ID = 'c51223c219d6aec8cb8c5210449bd859';
  constructor() { }

  private seachParam = new BehaviorSubject<any>(null);
  public seachParam$ = this.seachParam.asObservable();

  private currentTemp = new BehaviorSubject<any>(null);
  public currentTemp$ = this.currentTemp.asObservable();

  private detailData = new BehaviorSubject<any>(null);
  public detailData$ = this.detailData.asObservable();

  private futureData = new BehaviorSubject<any>(null);
  public futureData$ = this.futureData.asObservable();

  // working API call method
  public getFutureDaysForecast(cityName) {
    const apiUrl = environment.apiUrl + `data/2.5/forecast/daily?q=${cityName}&cnt=5&appid=${this.APP_ID}`;
    return fetch(apiUrl).then(res => res.json());
  }

  public getCurrentTemp(cityName) {
    const apiUrl = environment.apiUrl + `data/2.5/weather?q=${cityName}&appid=${this.APP_ID}`;
    return fetch(apiUrl).then(res => res.json());
  }

  public sendCurrentTemp(currentReprt) {
    this.currentTemp.next(currentReprt);
  }

  public sendToDetail(arrayData: any) {
    this.detailData.next(arrayData);
  }

  public sendFutureReadings(arrayData: any) {
    this.futureData.next(arrayData);
  }
}
