import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'benefits-ui';

  constructor(private httpClient: HttpClient, private afAuth: AngularFireAuth) {

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
