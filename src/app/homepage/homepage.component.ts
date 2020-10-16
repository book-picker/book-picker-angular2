import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalBooks } from '../global-books';
import { GetBookService } from '../services/get-book.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.sass']
})
export class HomepageComponent implements OnInit {

  book = [
    { src: '../../assets/images/book.svg', title: '' },
    { src: '../../assets/images/book.svg', title: '' },
    { src: '../../assets/images/book.svg', title: '' },
    { src: '../../assets/images/book.svg', title: '' },
    { src: '../../assets/images/book.svg', title: '' },
    { src: '../../assets/images/book.svg', title: '' },
    { src: '../../assets/images/book.svg', title: '' },
    { src: '../../assets/images/book.svg', title: '' },
    { src: '../../assets/images/book.svg', title: '' }
  ]; 
  constructor(public router: Router, public bookService: GetBookService, public gb: GlobalBooks) { }

  ngOnInit(): void {
    if (localStorage.getItem('location') === null || localStorage.getItem('location') === "undefined") {
      this.router.navigate(['/location'])
    } else
      if (localStorage.getItem('genres') === null) {
        this.router.navigate(['/select-genre'])
      }
  }

}
