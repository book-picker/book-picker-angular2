import { Component, OnInit, inject, Inject, NgModule } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-book-dialog',
  templateUrl: './book-dialog.component.html',
  styleUrls: ['./book-dialog.component.sass']
})
export class BookDialogComponent implements OnInit {
books=[];

constructor(public dialogRef : MatDialogRef<BookDialogComponent>,
    @Inject (MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true;
      this.books = data.data
     }

  ngOnInit(): void { }
 
  RowSelected(u:any){
    this.dialogRef.close(u);
    }

  Next_button_pressed(){
    this.dialogRef.close(
      {
        title : '',
        authors : [''],
        description : '',
        imageLink : '../../assets/images/book.svg',
        rating : '0'
      }
    );
  }
}
