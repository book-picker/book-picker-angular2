import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GetBookService } from '../services/get-book.service';
import { MatDialog } from '@angular/material/dialog';
import { BookDialogComponent } from '../book-dialog/book-dialog.component';
import { FormBuilder } from '@angular/forms';
import { GlobalVar } from '../global-var';


interface Genre {
  value: string;
  viewValue: string
}

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.sass']
})
export class AddBookComponent implements OnInit {

  imageLink: string = '../../assets/images/book.svg';
  search_keyword: string;
  display = false;
  bookForm;
  rating;
  books=[];
  genres: Genre[] = [
    { value: 'Biography', viewValue: 'Biography' },
    { value: 'Romantic', viewValue: 'Romantic' },
    { value: 'Fiction', viewValue: 'Fiction' },
    { value: 'Sci-Fi', viewValue: 'Sci-Fi' },
    { value: 'Mystry', viewValue: 'Mystry' },
    { value: 'Poetry', viewValue: 'Poetry' },
    { value: 'Education', viewValue: 'Education' },
    { value: 'Others', viewValue: 'Others' }
  ];

  constructor(
    public _fb: FormBuilder,
    public _http: HttpClient,
    public bookService: GetBookService,
    public dialog: MatDialog,
    public gv : GlobalVar

  ) { }

  ngOnInit() {
    this.gv.bar = false
    this.bookForm = this._fb.group({
      title : [''],
      authors: [['']],
      description:[''],
      rating :[''],
      ilink : ['../../assets/images/book.svg'],
      genre : [''],
      isbn : [''],
    })
  }
 
  getBookFuction() {
    this.bookService.GetBooks(this.search_keyword).subscribe(response => {
      this.books=[];
      const books_reponse = JSON.parse(JSON.stringify(response)).items
      for (let book of books_reponse) {
        this.books.push({
          title: book.volumeInfo.title,
          rating: book.volumeInfo.averageRating,
          authors: book.volumeInfo.authors,
          imageLink: book.volumeInfo.imageLinks.thumbnail,
          description: book.volumeInfo.description
        })
      }

      const dialogRef = this.dialog.open(BookDialogComponent, {
        width: '750px',
        height: 'auto',
        data: { data: this.books },
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe(result => {
        this.display = true;
        this.bookForm.patchValue({
          title : result.title,
          authors : result.authors,
          description : result.description,
          rating : result.rating,
          ilink : result.imageLink,          
        })
        this.imageLink = result.imageLink
        if (result.rating >=0.1){
          this.rating = result.rating
        }
      });
      });
}

  addBookToLibrary() {
    var Header = new HttpHeaders();
    console.log(this.bookForm.value)
    Header.append("Content-Type", "application/json").append('Cache-Control', 'no-cache');
    this._http.post('/', JSON.stringify(
      {
        'mobile': '',
        'book': this.bookForm.value
      }
    ), { headers: Header }).subscribe(
      (data) => console.log(data),
      (response) => console.log(response),
    )
  }

}
