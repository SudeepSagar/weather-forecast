import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedDataService } from '../shared-data.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.sass']
})
export class ListPageComponent implements OnInit {
  currentTemp: any;
  subscription: Subscription;
  resultSerParam: any;
  refresh = false;

  constructor(private sharedService: SharedDataService, private spinner: NgxSpinnerService) {
    this.subscription = this.sharedService.currentTemp$.subscribe(
      currentTemp => {
        this.currentTemp = currentTemp;
      });
  }

  ngOnInit() {
  }

  refreshWeather(cityName) {
    this.refresh = true;
    const resultData = this.sharedService.getCurrentTemp(cityName);
    resultData.then((jsonData) => {
      this.resultSerParam = jsonData;
      this.currentTemp.forEach(element => {
        if (element.name === jsonData.name) {
          if (element.main.temp !== jsonData.main.temp || element.weather[0].main !== jsonData.weather[0].main) {
            element = jsonData;
          }
        }
      });
      this.refresh = false;
    });
  }

  rmvFromWeatherList(index) {
    this.currentTemp.splice(index, 1);
  }

  clearListData() {
    this.currentTemp.splice(0, this.currentTemp.length);
  }

  showDetail(index) {
    this.sharedService.sendToDetail(this.currentTemp[index]);
    const futreReadings = this.sharedService.getFutureDaysForecast(this.currentTemp[index].name);
    futreReadings.then((jsonData) => {
      this.sharedService.sendFutureReadings(jsonData);
    });
  }

}
