import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireAuth } from 'angularfire2/auth';

import { auth, messaging } from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'benefits-ui';
  messaging;

  constructor(private httpClient: HttpClient, public afAuth: AngularFireAuth) {
    this.messaging = messaging();
  }

  ngOnInit() {

  }

  async login() {
    const credential = await this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    const token = await credential.user.getIdToken();
    console.log(token)

    const request = await this.messaging.requestPermission();
    const deviceToken = await this.messaging.getToken();

    console.log('FCM: ' + deviceToken);
    this.httpClient.put(`https://us-central1-rb-benefits.cloudfunctions.net/api/users/${credential.user.email}`, {
      deviceToken: deviceToken
    }, {
        headers: new HttpHeaders().append('Authorization', `Bearer ${token}`)
      }).toPromise().then((res) => {
        console.log(res);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
