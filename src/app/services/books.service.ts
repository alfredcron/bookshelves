import { Injectable } from '@angular/core';
import { Book } from '../models/book.model';
import { Subject } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  books: Book[] = [];
  booksSubject = new Subject<Book[]>();

  constructor() { }

  sortBooks() {

    // Création d'objet temporaire qui contient les positions
    // et les valeurs en minuscules
    var mapped = this.books.map(
    (e,i) => {
      return { index: i, value: e.title.toLowerCase() };
    });

    // on trie l'objet temporaire avec les valeurs réduites
    mapped.sort(
    (a,b) => {
      if (a.value > b.value) {
        return 1;
      }
      if (a.value < b.value) {
        return -1;
      }
      return 0;
      });

// on utilise un objet final pour les résultats
    var result = mapped.map(
    e => {
      return this.books[e.index];
    });
//    this.books.sort(
//      (a, b) => {
//        if (a.title < b.title)
//          return -1;
//        if (a.title > b.title)
//          return 1;
//        else
//          return 0; 
//      }
//    );
    console.log('result : ' + result[2].title);
    this.books = result;
  }

  emitBooks() {
    this.booksSubject.next(this.books);
  }

  saveBooks() {
    firebase.database().ref('/books').set(this.books);
  }

  getBooks() {
    firebase.database().ref('/books')
    .on('value', (data)=> {
      this.books = data.val() ? data.val() : [];
      this.sortBooks();
      this.emitBooks();
    })
  }

  getSingleBook (id : number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/books/' + id).once('value').then(
          (data) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        )
      }
    )
  }

  createNewBook(newBook: Book) {
    this.books.push(newBook);
    this.saveBooks();
    this.emitBooks();
  }

  removeBook(book: Book) {
    if (book.photo) {
      const storageRef = firebase.storage().refFromURL(book.photo);
      storageRef.delete().then(
        () => {
          console.log('Photo supprimée');
        }
      ).catch(
        (error) => {
          console.log('Fichier non trouvé' + error)
        }
      )
    }
    const bookIndexToRemove = this.books.findIndex(
      (bookEl) => {
        if (bookEl === book) {
          return true;
        }
      }
    );
    this.books.splice(bookIndexToRemove, 1);
    this.saveBooks();
    this.emitBooks();
  }

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
          .child('images/' + almostUniqueFileName + file.name)
          .put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
            () => {
              console.log('Chargement...');
            },
            (error) => {
              console.log('Erreur de chargement : ' + error);
              reject();
            },
            () => {
              resolve(upload.snapshot.ref.getDownloadURL());
            }
          );  
      }
    );
  }
}
