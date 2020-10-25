import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Book } from '../book';
import { GlobalVar } from '../global-var';

@Component({
  selector: 'app-book-info',
  templateUrl: './book-info.component.html',
  styleUrls: ['./book-info.component.sass']
})
export class BookInfoComponent implements OnInit {
  num = [1,2,3,4,5,6]
  num_mob = [1,2,3]
  isbn : String = "1234567890"
  mobile : string = "1111111111"
  private sub : any
  commentBox = false
  recommendations : Book[]
  book : Book
  addedComment
  comments : {
    comment : String
    nickname : String
  }[]
  size
  rows
  resp = false;
  authors: String[]
  constructor( 
    private route :  ActivatedRoute,
    private http : HttpClient,
    public gv: GlobalVar,
  ) { }

  ngOnInit(): void {
    this.commentBox = false
    // this.mobile = localStorage.getItem('number')
    // this.sub = this.route.params.subscribe(
    //   params => {
    //     this.isbn = +params['isbn']
    //   }
    // )
    console.log(this.resp)

    this.authors = ['Sumit','Vishwakarma']
   
    this.getBookinfo()
    // this.getRecommendations()

  }

  getBookinfo(){
    console.log("requesting")
    let headers = new HttpHeaders({'Content-Type':'application/json','Anonymous':'true'})
    // headers.append('Content-Type','application/json')
    this.http.post( this.gv.URL + "/getBook", JSON.stringify({'mobile' : this.mobile, 'isbn' : this.isbn}), {headers:headers}).subscribe(
      Response => {
        this.resp = true
        console.log(Response)
        let res = JSON.parse(JSON.stringify(Response))
        this.book = res.book  
        this.comments = this.book.comments    
        console.log(this.book.comments)
      }
    )
  }

  async getRecommendations(){
    let headers = new HttpHeaders()
    headers.append('Content-Type','application/json')
    this.http.post( this.gv.URL, {mobile : this.mobile}, {headers:headers}).subscribe(
      Response => {
        let res = JSON.parse(JSON.stringify(Response))
        this.recommendations = res.body.recommendations
        this.getRows()
      }
    )
  }

  addComment(){
    let headers = new HttpHeaders({'Content-Type':'application/json'})
    this.http.post(this.gv.URL + '/addComment', JSON.stringify({'comment': this.addedComment, 'mobile':this.mobile, 'isbn': this.isbn}), {headers:headers}).subscribe(
      Response => {
        let res = JSON.parse(JSON.stringify(Response))
        console.log(res)
        if(res.status === true){
          this.comments.push(this.addedComment)
        }
      }
    )
  }

  getRows(){
    this.size = this.recommendations.length
    this.rows = this.size / 7
    if( this.rows % 1 < 0.5){
      this.rows = this.rows.toFixed(0) + 1
    } else{
      this.rows = this.rows.toFixed(0)
    }
  }

  

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this.sub.unsubscribe()
  }


}
