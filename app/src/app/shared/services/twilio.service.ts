import { EventEmitter, Injectable, Output } from "@angular/core";
import { HttpClient } from '@angular/common/http';
// import { Device } from '@twilio/voice-sdk';
import { Conversation, Client, Paginator, Participant, User, UserUpdateReason } from "@twilio/conversations";
import { environment } from '../../../environments/environment';
import { JakayConversation, JakayMessage } from "../component/chat-user/chat.model";
import { BehaviorSubject, Observable } from "rxjs";

declare var Twilio: any;

@Injectable({
  providedIn: 'root'
})
export class TwilioService {
  constructor(protected http: HttpClient) { }
  public conversationsClient: any;
  currentConversation: any;
  public chatConnectedEmitter: EventEmitter<any> = new EventEmitter<any>();
  connection: any;
  jakayConversation: JakayConversation;
  jakayConversationMessages: Array<any> = [];
  participantsIdentity: Array<any> = [];

  @Output() isMessageReceived: EventEmitter<any> = new EventEmitter();

  private newMessage: BehaviorSubject<any> = new BehaviorSubject<any>({});

  @Output() isParticantStatusUpdated: EventEmitter<any> = new EventEmitter();

  private updatedParticipant: BehaviorSubject<any> = new BehaviorSubject<any>({});

  get newMessageReceived() {
    return this.newMessage.asObservable();
  }

  pushNewMessage(message: JakayMessage) {
    this.newMessage.next(message);
  }

  get participantUpdated() {
    return this.updatedParticipant.asObservable();
  }

  updateParticipantStatus(participant){
    this.updatedParticipant.next(participant);
  }


  async connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const currentUserId: any = localStorage.getItem('userId');
      this.getChatToken(currentUserId).then((accessToken: any) => {
        this.conversationsClient = new Client(accessToken);
        this.conversationsClient.on("connectionStateChanged", async (state: any) => {
          if (state == 'connected') {
            //let conversationsPaginator: Paginator<Conversation> = await this.conversationsClient.getSubscribedConversations();
            // get conversations
            // const conversations: Conversation[] = conversationsPaginator.items;
            // console.log('conversations', conversations);
            resolve(true);
          } else if (state == 'denied') {
            resolve(false);
          }
        });
        this.conversationsClient.on("conversationJoined", (conversation: any) => {
          // this.createConversation(conversation.sid)
          conversation.on("typingStarted", (participant: any) => {
            // handlePromiseRejection(
            //   () =>
            //     updateTypingIndicator(participant, conversation.sid, startTyping),
            //   addNotifications
            // );
          });

          conversation.on("typingEnded", (participant: any) => {
            // handlePromiseRejection(
            //   () => updateTypingIndicator(participant, conversation.sid, endTyping),
            //   addNotifications
            // );
          });

          // handlePromiseRejection(async () => {
          //   if (conversation.status === "joined") {
          //     const result = await getConversationParticipants(conversation);
          //     updateParticipants(result, conversation.sid);

          //     const messages = await conversation.getMessages();
          //     upsertMessages(conversation.sid, messages.items);
          //     loadUnreadMessagesCount(conversation, updateUnreadMessages);
          //   }
          // }, addNotifications);
        });
        this.conversationsClient.on("conversationRemoved", (conversation: Conversation) => {
          // updateCurrentConversation("");
          // handlePromiseRejection(() => {
          //   removeConversation(conversation.sid);
          //   updateParticipants([], conversation.sid);
          // }, addNotifications);
        });
        this.conversationsClient.on("messageAdded", (message: any) => {
          const newMessage: any = { twilio_conversation_id: message.conversation.sid, sid: message.state.sid, author: message.state.author, message: message.state.body, created: message.state.dateUpdated }
          this.pushNewMessage(newMessage)
          // upsertMessage(message, upsertMessages, updateUnreadMessages);
          // if (message.author === localStorage.getItem("username")) {
          //   clearAttachments(message.conversation.sid, "-1");
          // }
        });
        this.conversationsClient.on("participantLeft", (participant: any) => {
          // handlePromiseRejection(
          //   () => handleParticipantsUpdate(participant, updateParticipants),
          //   addNotifications
          // );
        });
        this.conversationsClient.on("participantUpdated", (event: any) => {
          // console.log('participantUpdated', );
          // handlePromiseRejection(
          //   () => handleParticipantsUpdate(event.participant, updateParticipants),
          //   addNotifications
          // );
        });
        this.conversationsClient.on("participantJoined", (participant: any) => {
          // handlePromiseRejection(
          //   () => handleParticipantsUpdate(participant, updateParticipants),
          //   addNotifications
          // );
        });
        this.conversationsClient.on("userUpdated", ({ user, updateReasons}: {
          user: User,
          updateReasons: UserUpdateReason[]
        }) => {
          if (updateReasons.includes("reachabilityOnline")) {
            // user reachability status was updated
            const participantIndex = this.participantsIdentity.findIndex((x) => x.identity == user.identity);
            if(participantIndex >= 0){
              this.participantsIdentity[participantIndex].online = user.isOnline;
              this.updateParticipantStatus(this.participantsIdentity[participantIndex]);
            }

          }
          if (updateReasons.includes("reachabilityNotifiable")) {
            // user notifications status was updated
          }
        })
        this.conversationsClient.on("conversationUpdated", (conversation: any) => {
          this.getMessages(conversation.conversation.sid)
          // handlePromiseRejection(
          //   () => upsertConversation(conversation),
          //   addNotifications
          // );
        });
        this.conversationsClient.on("messageUpdated", (message: any) => {
          // handlePromiseRejection(
          //   () => upsertMessage(message, upsertMessages, updateUnreadMessages),
          //   addNotifications
          // );
        });
        this.conversationsClient.on("messageRemoved", (message: any) => {
          // handlePromiseRejection(
          //   () => removeMessages(message.conversation.sid, [message]),
          //   addNotifications
          // );
        });
        this.conversationsClient.on("pushNotification", (event: any) => {
          // @ts-ignore
          if (event.type != "twilio.conversations.new_message") {
            return;
          }

          if (Notification.permission === "granted") {
            // showNotification(event);
          } else {
            // console.log("Push notification is skipped", Notification.permission);
          }
        });
        this.conversationsClient.on("tokenAboutToExpire", () => {
          this.connect();
        });
        this.conversationsClient.on("tokenExpired", () => {
          this.connect();
        });
      });
    });
  }

  getChatToken(identity: string) {
    return new Promise((resolve, reject) => {
      const params = { identity: identity };
      this.http.get(`${environment.apiURL}/chat/access-token`, {params:params}).subscribe((res: any) => {
        // console.log('chat token', res);
        resolve(res.data.token);
      }, (error: any) => {
        reject(false);
      });
    });
  }

  getTempChatToken(identity: string) {
    return new Promise((resolve, reject) => {
      const params = { identity: identity };
      this.http.get(`http://localhost:3000/get-chat-token`, {params: params}).subscribe((res: any) => {
        // console.log('chat token', res);
        resolve(res.token);
      }, (error: any) => {
        reject(false);
      });
    });
  }

  async createConversation(userId: any, chatUserId: any, chatUserEmail: string) {
    //2bdf9c64-cf0c-4f80-a6cb-129f9db8bdfb
    //ca91bcb2-1fe6-4afd-a990-f3ac8d2deabb
    return new Promise(async(resolve, reject) => {
      const conversation = await this.conversationsClient.createConversation({
        friendlyName: chatUserEmail + '-'+new Date().getTime(),
        uniqueName: chatUserEmail + '-'+new Date().getTime()
      });
      await this.getChatToken(chatUserId);
      await conversation.add(chatUserId);
      await conversation.join();
      this.http.post(`${environment.apiURL}/chat/conversations`, {
        c_sid: conversation.sid,
        participant_1: userId,
        participant_2: chatUserId
      }).subscribe((res)=>{
        resolve(true)
      }, (error)=> {
        reject(false)
      })
    })

  }

  async setCurrentConversation(sid: string){
    this.currentConversation = await this.conversationsClient.getConversationBySid(sid);
  }

  async getMessages(sid: any) {
    try {
      let conversation = await this.conversationsClient.getConversationBySid(sid);
      if (conversation) {
        let conversationMessages = await conversation.getMessages();
        let twilioParticipants = await conversation.getParticipants();
        let participants: any = [];
        for (let participant of twilioParticipants) {
          // console.log('participant', participant);
          const user: any = await participant.getUser();
          // console.log('user', user);
          participants.push(user.state);
          // console.log('user', user);
          const index = this.participantsIdentity.findIndex(x => x.identity === user.identity);
          if (index < 0) {
            this.participantsIdentity.push(user.state);
          }
        }
        this.jakayConversationMessages = [];
        let lastMessage: JakayMessage = new JakayMessage();
        let updated_at: any;
        if (conversationMessages.items.length > 0) {
          for (let i = 0; i < conversationMessages.items.length; i++) {
            this.jakayConversationMessages.push({ author: conversationMessages.items[i].state.author, message: conversationMessages.items[i].state.body, created: conversationMessages.items[i].state.dateUpdated, sid: conversationMessages.items[i].state.sid, twilio_conversation_id: sid })
          }
          lastMessage = { author: conversationMessages.items[conversationMessages.items.length - 1].state.author, message: conversationMessages.items[conversationMessages.items.length - 1].state.body, created: conversationMessages.items[conversationMessages.items.length - 1].state.dateUpdated, sid: conversationMessages.items[conversationMessages.items.length - 1].state.sid, twilio_conversation_id: sid }
          updated_at = conversationMessages.items[conversationMessages.items.length - 1].state.dateUpdated;
        }
        return { sid: conversation.sid, participants: participants, messages: this.jakayConversationMessages, last_message: lastMessage, updated_at: updated_at, is_twilio_conversation_deleted: false }
      } else {
        return { sid: conversation.sid, participants: [], messages: [], last_message: '', updated_at: '', is_twilio_conversation_deleted: true }
      }
    } catch (error) {
      // console.log('error', error);
      return { sid: sid, participants: [], messages: [], last_message: '', updated_at: '', is_twilio_conversation_deleted: true }
    }


  }

  async sendMessage(message: string, sid: any) {
    this.currentConversation.join();
    this.currentConversation.sendMessage(message)
  }

  //Twilio calling service
  connectCall(params: any) {
    this.getCallToken().then(async (accessToken: any) => {
      //Configure event handlers for Twilio Device
      Twilio.Device.setup(accessToken);
      if (Twilio.Device.status() === 'ready') this.connection = Twilio.Device.connect(params);
      Twilio.Device.ready(async () => {
        this.connection = Twilio.Device.connect(params);
      });
      /*
        //this is used when call is disconnected
        Twilio.Device.disconnect((res: any) => {
          console.log('disconnect', res);
          this.disconnectCall();
        });
      */
      Twilio.Device.error((error: any) => {
        this.disconnectCall();
      });
    });
  }

  disconnectCall() {
    this.connection.disconnect();
    setTimeout(() => {
      this.connection = null;
    }, 300);
  }

  conversationList() {
    return this.http.get(`${environment.apiURL}/chat/conversations`)
  }

  muteCall() {
    this.connection.mute(true);
  }

  unmuteCall() {
    this.connection.mute(false);
  }

  chatProfileDetails(userId: any) {
    return this.http.get(`${environment.apiURL}/chat/users/${userId}`)
  }

  deleteChatConversation(conversationId: any) {
    return this.http.delete(`${environment.apiURL}/chat/conversations/${conversationId}`)
  }

  searchChatConversation(searchValue: any) {
    return this.http.get(`${environment.apiURL}/chat/search-user/${searchValue}`)
  }

  blockUser(userId: any, blockAction: any) {
    return this.http.post(`${environment.apiURL}/chat/block-users`, { user_to_block_id: userId, block_action: blockAction })
  }
  unBlockUser(blockStatus: any) {
    return this.http.post(`${environment.apiURL}/chat/block-users`, { block_status_id: blockStatus })
  }

  getCallToken() {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.apiURL}/call/token`).subscribe((res: any) => {
        resolve(res.data);
        //resolve(res.token)
      }, (error: any) => {
        reject(false);
      });
    });
  }

  setSpeaker(deviceId: any) {
    Twilio.Device.audio.speakerDevices.set(deviceId);
  }

  getStatus(SID: any): Observable<any> {
    return this.http.get(environment.apiURL + '/call/child/status', SID);
  }

  getSID() {
    return this.connection?.parameters?.CallSid;
  }

  getTermsAndConditionData(type: string, userId: any) {
    return this.http.get(`${environment.apiURL}/user/tnc-status?type=${type}&seller_id=${userId}`)
  }

  sendChatNotification(data: any){
    return this.http.post(`${environment.apiURL}/chat/conversations/notification`, data);
  }

  resumeConversation(data: any){
    return this.http.post(`${environment.apiURL}/chat/conversations/new-message`, data);
  }

}

