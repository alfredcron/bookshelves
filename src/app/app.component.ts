import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() {
    var firebaseConfig = {
      apiKey: "AIzaSyCNyh2Utpsl7_r5yCx85WDc1ZvPUj7TATA",
      authDomain: "bookshelves-ed485.firebaseapp.com",
      databaseURL: "https://bookshelves-ed485.firebaseio.com",
      projectId: "bookshelves-ed485",
      storageBucket: "bookshelves-ed485.appspot.com",
      messagingSenderId: "22827573572",
      appId: "1:22827573572:web:f3d90c18477df3f8453711"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }
}
