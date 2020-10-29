package structure

//Login structure is used for storing parsed information from login /login request
type Login struct {
	Mobile string `json:"mobile" bson:"mobile,omitempty"`
}

//ResponseLogin is used encode the response for /login(POST) request
type ResponseLogin struct {
	Status   bool   `json:"status"`
	Message  string `json:"message"`
	Nickname string `json:"nickname" bson:"nickname"`
}

//ResponseDefault is used encode the response for /login(POST) request
type ResponseDefault struct {
	Status  bool   `json:"status"`
	Message string `json:"message"`
}

//AddBook is
/*type BookData struct {
	ISBN      string `json:"isbn,omitempty" bson:"isbn,omitempty"`
	BookName  string `json:"bookName,omitempty" bson:"bookName,omitempty"`
	Author    string `json:"author,omitempty" bson:"author,omitempty"`
	Edition   int32 `json:"edition,omitempty" bson:"edition,omitempty"`
	Genre     string `json:"genre" bson:"genre,omitempty"`
	Opinion   string `json:"opinion" bson:"opinion,omitempty"`
	Time      int64  `json:"addedTime" bson:"addedTime,omitempty"`
}
*/
//AddBook is the template for the addbook route object
type AddBook struct {
	ID   string       `json:"mobile,omitempty" bson:"_id"`
	Book *AddBookData `json:"book" bson:"books"`
}

//GetUniqueBook is the template for the addbook route object
type GetUniqueBook struct {
	ID   string       `json:"mobile,omitempty" bson:"_id"`
	Book *GetBookData `json:"book" bson:"books"`
}

//BookCount is used the template for getting number  of books
type BookCount struct {
	Count int `bson:"bookCount"`
}

//UniqueBook is the book object
type UniqueBook struct {
	Status  bool         `json:"status"`
	Message string       `json:"message"`
	ID      string       `json:"mobile,omitempty" bson:"_id"`
	Book    *GetBookData `json:"book,omitempty" bson:"books"`
}

//GetBookData is used as the object for Books in mongod server
type GetBookData struct {
	ISBN     string     `json:"isbn" bson:"isbn"`
	Name     string     `json:"title" bson:"bookName"`
	Author   []string   `json:"authors" bson:"author"`
	Opinion  string     `json:"description" bson:"description"`
	Genre    string     `json:"genre" bson:"genre"`
	Comments *[]Comment `json:"comments" bson:"comments"`
	Ilink    string     `json:"ilink" bson:"ilink"`
	Time     int64      `json:"time,omitempty" bson:"addedTime"`
	Rating   float32    `json:"rating" bson:"rating"`
}

//AddBookData is used as the object for Books in mongod server
type AddBookData struct {
	ISBN    string   `json:"isbn" bson:"isbn"`
	Name    string   `json:"title" bson:"bookName"`
	Author  []string `json:"authors" bson:"author"`
	Opinion string   `json:"description" bson:"description"`
	Genre   string   `json:"genre" bson:"genre"`
	Ilink   string   `json:"ilink" bson:"ilink"`
	Time    int64    `json:"time,omitempty" bson:"addedTime"`
	Rating  float32  `json:"rating" bson:"rating"`
}

//HomepageBook is used to get the book object for homepage
type HomepageBook struct {
	ISBN  string `json:"isbn" bson:"isbn"`
	Name  string `json:"title" bson:"bookName"`
	Ilink string `json:"ilink" bson:"ilink"`
}

//HomepageObject is used
type HomepageObject struct {
	Nickname string        `json:"nickname" bson:"nickname"`
	Book     *HomepageBook `json:"book" bson:"books"`
}

//HomepageResponse is used 
type HomepageResponse struct{
	Status bool `json:"status" bson:"status"`
	Message string `json:"message" bson:"message"`
	Body []HomepageObject `json:"books"`
}

//RequestHomepage is used
type RequestHomepage struct {
	Genre  string `json:"genre" bson:"genre"`
	Length int    `json:"length" bson:"length"`
	Skip   int    `json:"skip"`
}

//Comment is used for the comment template
type Comment struct {
	Nickname string `json:"nickname" bson:"nickname"`
	Text     string `json:"text" bson:"text,omitempty"`
}

//GetBook is used to get the unique book
type GetBook struct {
	ID   string `json:"mobile" bson:"_id"`
	ISBN string `json:"isbn" bson:"isbn"`
}

//UserCount is used
type UserCount struct {
	Count int16 `bson:"userCount"`
}

//Nickname  is used
type Nickname struct {
	Mobile   string `json:"mobile" bson:"_id"`
	Nickname string `json:"nickname" bson:"nickname"`
}

//OnlyNickname is used
type OnlyNickname struct {
	Nickname string `json:"nickname" bson:"nickname"`
}

//RequestComment is used
type RequestComment struct {
	Mobile  string   `json:"mobile" bson:"_id"`
	ISBN    string   `json:"isbn" bson:"isbn"`
	Comment *Comment `json:"comment" bson:"comments"`
}

//CommentCount is used for decoding the bson key value pair into the go struct
type CommentCount struct {
	Count int `bson:"count"`
}
