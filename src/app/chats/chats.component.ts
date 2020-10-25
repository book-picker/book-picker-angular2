import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { MatDrawer, MatDrawerContent } from '@angular/material/sidenav';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.sass']
})
export class ChatsComponent implements OnInit {

  @ViewChild('drawer') drawer: MatDrawer
  select = 0
  displayChats = false
  //chat
  nickname = localStorage.getItem('nickname')
  display = false
  newMessage;
  messages = []
  chatId
  link = 'user/' + localStorage.getItem('nickname') + '/to'

  chats = []

  @ViewChild('scrollChat') private ScrollChat: MatDrawerContent;
  constructor(
    private afs: AngularFirestore
  ) { }
  ngOnInit() {
    this.afs.collection('user/' + localStorage.getItem('nickname') + '/to').valueChanges().subscribe(res => {
      this.chats = res      
      this.displayChats = true
    })
  }
  selected(nickname) {
    this.chats[this.select].style = {}
    const selected = this.chats.find(element => element.nickname === nickname)
    this.select = this.chats.indexOf(selected)
    this.chats[this.select].style = { 'background': '#CDCDCD' }
    this.drawer.toggle()
    this.chatId = this.chats[this.select].chatId

    this.getMessages()
  }
  getMessages() {
    this.afs.collection('chats/' + this.chatId + '/Messages').valueChanges().
      subscribe(messages => {
        const mess_res = JSON.parse(JSON.stringify(messages))
        mess_res.sort(((a, b) => (a.timestamp.seconds * 1000 + a.timestamp.nanoseconds * 0.0000001) - (b.timestamp.seconds * 1000 + b.timestamp.nanoseconds * 0.0000001)))
        this.messages = []
        for (let message of mess_res) {
          const date = new Date(null)
          date.setSeconds(message.timestamp.seconds, message.timestamp.nanoseconds * 0.0000001)
          if (message.from === this.nickname) {
            this.messages.push({
              message: message.message,
              timestamp: date.toTimeString().slice(0, 5) + ',' + date.toDateString().slice(3,),
              class: 'end'
            })
          } else {
            this.messages.push({
              message: message.message,
              timestamp: date.toTimeString().slice(0, 5) + ',' + date.toDateString().slice(3,),
              class: 'start'
            })
          }
        }
        this.display = true
        this.ScrollChat.scrollTo({top: 50})
      })
  }
  sendmessage() {
    const time = new Date()
    console.log(time);
    if (this.newMessage === undefined || this.newMessage === '') { return }
    this.afs.collection('chats/' + this.chatId + '/Messages').add({
      from: this.nickname,
      message: this.newMessage,
      timestamp: time,
    }).then(
      response => console.log(response),
      error => console.log(error)
    )
    this.newMessage = ''

  }
  back() {
    this.drawer.toggle()
  }
  scroller() {
    console.log("hello")
  }

}
