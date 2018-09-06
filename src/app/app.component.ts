import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    this.messaging.requestPermission();
    this.messaging.getToken().then((token) => {
      console.log(token)
    })
  }

  async login() {
    const credential = await this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    const token = await credential.user.getIdToken();
    console.log(token);
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
