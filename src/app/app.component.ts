import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'benefits-ui';

  constructor(private httpClient: HttpClient) {

  }

  callCloudFunction() {
    this.httpClient.get('https://us-central1-rb-benefits.cloudfunctions.net/helloWorld', {responseType: 'text'}).subscribe(msg => {
      alert(msg);
    });
  }
}
