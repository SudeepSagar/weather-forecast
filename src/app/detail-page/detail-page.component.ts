import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedDataService } from '../shared-data.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.sass']
})
export class DetailPageComponent implements OnInit {

  subscription: Subscription;
  detailData: any;
  futureData: any;

  constructor(private sharedService: SharedDataService, private spinner: NgxSpinnerService) {
    this.subscription = this.sharedService.detailData$.subscribe(
      detailData => {
        this.detailData = detailData;
      });

    this.subscription = this.sharedService.futureData$.subscribe(
      futureData => {
        this.futureData = futureData;

      });
  }

  ngOnInit() {
  }

  refreshAll(cityName) {
    this.spinner.show();
    const futreReadings = this.sharedService.getFutureDaysForecast(cityName);
    futreReadings.then((jsonData) => {
      this.sharedService.sendFutureReadings(jsonData);
      this.spinner.hide();
    });
  }

}
