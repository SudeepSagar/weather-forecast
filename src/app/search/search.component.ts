import { Component, ElementRef, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { SharedDataService } from '../shared-data.service';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit, OnDestroy {

  searchText: any;
  resultSerParam: any;
  msgShow = false;
  msgType: string;
  errorMsg = '';
  currentTemp = [];
  subscription: Subscription;

  constructor(private sharedService: SharedDataService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
  }

  addToList() {
    this.spinner.show();
    const resultData = this.sharedService.getCurrentTemp(this.searchText);
    resultData.then((jsonData) => {
      if (+jsonData.cod === 200) {
        const found = this.currentTemp.find(element => element.name === jsonData.name);
        if (found) {
          this.spinner.hide();
          return;
        }
        if (this.currentTemp.length >= 8) {
          this.currentTemp.pop();
        }
        this.currentTemp.unshift(jsonData);
        this.sharedService.sendCurrentTemp(this.currentTemp);
        this.spinner.hide();
        this.msgShow = false;

      } else {
        this.msgShow = true;
        this.msgType = 'error';
        this.errorMsg = jsonData.message;
        this.spinner.hide();
      }
      this.searchText = '';
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
