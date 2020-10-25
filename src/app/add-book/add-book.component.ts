import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { GetBookService } from '../services/get-book.service';
import { MatDialog } from '@angular/material/dialog';
import { BookDialogComponent } from '../book-dialog/book-dialog.component';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { GlobalVar } from '../global-var';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

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
  bar: false;
  rating: string;
  books = [];
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
    public gv: GlobalVar,
    public router: Router
  ) { }

  ngOnInit() {
    this.gv.bar = false;
    this.bookForm = this._fb.group({
      title: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      authors: [[''], Validators.required],
      description: ['', Validators.required],
      rating: [''],
      ilink: ['../../assets/images/book.svg'],
      genre: ['', Validators.required],
      isbn: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(13)])],
    })
  }

  get title() { return this.bookForm.get('title') }
  get isbn() { return this.bookForm.get('isbn') }
  get authors() { return this.bookForm.get('authors') }
  get genre() { return this.bookForm.get('genre') }
  get description() { return this.bookForm.get('description') }

  getBookFuction() {
    this.gv.bar=true;
    this.bookService.GetBooks(this.search_keyword).subscribe(response => {
      this.books = [];
      const books_reponse = JSON.parse(JSON.stringify(response)).items
      for (let book of books_reponse) {
        this.books.push({
          title: book.volumeInfo.title,
          rating: book.volumeInfo.averageRating,
          authors: book.volumeInfo.authors,
          imageLink: book.volumeInfo.imageLinks.thumbnail,
          description: book.volumeInfo.description
        })
        this.gv.bar=false
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
          title: result.title,
          authors: result.authors,
          description: result.description,
          rating: result.rating,
          ilink: result.imageLink,
        })
        this.imageLink = result.imageLink
        if (result.rating >= 0.1) {
          this.rating = result.rating
        }else this.rating = ''
      });
    });
  }

  async addBookToLibrary() {
    if (this.bookForm.valid) {
      this.gv.bar = true
      var Header = new HttpHeaders();
      console.log(this.bookForm.value)
      Header.append("Content-Type", "application/json").append('Cache-Control', 'no-cache');
      this._http.post(this.gv.URL+'/addBook', JSON.stringify(
        {
          'mobile': '1111111111',
          'book': this.bookForm.value
        }
      ), { headers: Header }).subscribe(
        (response) => {
          console.log(JSON.parse(JSON.stringify(response)).status)
          
          if (JSON.parse(JSON.stringify(response)).status == true) {
            this.gv.bar=false 
            window.alert("Your book was sucessfully added!")
            this.router.navigate(['/home'])
          } else {
            this.gv.bar=false 
            window.alert("Something went wrong, Please try again!")
          }
        },
        (error)=>  {
          this.gv.bar=false  
          if (error) {
            console.log(error)
            window.alert("Please check your internet connection!")
          }
             
        }
      )
      this.bookForm.reset() ;
    }
    else {
      this.validateAllFormFields(this.bookForm)
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
