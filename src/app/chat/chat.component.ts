import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass']
})
export class ChatComponent implements OnInit {
  nickname = localStorage.getItem('nickname')
  display = false
  newMessage;
  messages = []
  chatId = '00000'
  link = 'user/' + localStorage.getItem('nickname') + '/to'
  constructor(
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
      this.afs.collection('chats/' + this.chatId + '/Messages').valueChanges().
      subscribe(messages => {
        const mess_res = JSON.parse(JSON.stringify(messages))
        mess_res.sort(((a,b) => (a.timestamp.seconds*1000 + a.timestamp.nanoseconds * 0.0000001 )-(b.timestamp.seconds*1000 + b.timestamp.nanoseconds * 0.0000001 )))
        this.messages =[]
        for (let message of mess_res) {
          const date = new Date(null)
          date.setSeconds(message.timestamp.seconds, message.timestamp.nanoseconds * 0.0000001)
          if (message.from === 'lukku') {
            this.messages.push({
              message: message.message,
              timestamp: date.toTimeString().slice(0,5) + ',' + date.toDateString().slice(3,),
              class: 'end'
            })
          } else {
            this.messages.push({
              message: message.message,
              timestamp: message.timestamp,
              class: 'start'
            })
          }
        }
        this.display = true
      })
  }

  sendmessage() {
    const time = new Date()
    console.log(time);
    if(this.newMessage === undefined|| this.newMessage === '') {return}
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
  }

}
