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
  currentTemperature = [];
  subscription: Subscription;
  resultSerParam: any;
  refresh = false;
  employees = [];

  constructor(private sharedService: SharedDataService, private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.subscription = this.sharedService.currentTemp$.subscribe(
      currentTemp => {
        this.currentTemperature = currentTemp;
      });
  }

  refreshWeather(cityName) {
    this.refresh = true;
    this.spinner.show();
    const resultData = this.sharedService.getCurrentTemp(cityName);
    resultData.then((jsonData) => {
      this.resultSerParam = jsonData;
      this.currentTemperature.forEach(element => {
        if (element.name === jsonData.name) {
          if (element.main.temp !== jsonData.main.temp || element.weather[0].main !== jsonData.weather[0].main) {
            element = jsonData;
          }
        }
      });
      this.refresh = false;
      this.spinner.hide();
    });
  }

  rmvFromWeatherList(index) {
    this.currentTemperature.splice(index, 1);
  }

  clearListData() {
    if (this.currentTemperature) {
      this.currentTemperature.splice(0, this.currentTemperature.length);
      this.sharedService.sendToDetail('');
      this.sharedService.sendFutureReadings('');
    }
  }

  async showDetail(index) { // demonstration of async and await in JS
    this.sharedService.sendToDetail(this.currentTemperature[index]);
    const futreReadings = await this.sharedService.getFutureDaysForecast(this.currentTemperature[index].name);
    const finalData = JSON.parse(JSON.stringify(futreReadings));
    this.sharedService.sendFutureReadings(finalData);
  }

}
