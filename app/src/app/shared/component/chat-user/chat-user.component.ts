import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TermsConditionsChatCallComponent } from 'src/app/modules/buyers/buyer-vehicle/terms-conditions-chat-call/terms-conditions-chat-call.component';
import { DeleteConfirmationComponent } from '../../modals/delete-confirmation/delete-confirmation.component';
import { UserProfile } from '../../models/user-profile.model';
import { TwilioService } from '../../services/twilio.service';
import { UserService } from '../../services/user.service';
import { BlockDetails, JakayConversationList, JakayMessage } from './chat.model';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.scss']
})

export class ChatUserComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('openUserDetails') openUser: TemplateRef<any>;
  @ViewChild('messageContainer') messagesContainer: ElementRef
  message: string;
  userProfileDetails: UserProfile;
  conversationMessages: Array<JakayMessage> = [];
  @Input() userType: string;
  conversationList: Array<JakayConversationList> = [];
  conversationScreen: any;
  chatUserId: string;
  chatUser: any;
  chatUserEmail: any;
  sid: string;
  userEmail: any;
  selectedChat: number;
  collapsed = true;
  loading: boolean = false;
  userId: any;
  public searchValue: any;
  blockDetails: Array<BlockDetails>;
  isPopUpOpened: boolean = false;
  isLoaded = false;
  subscribedMessage: any;
  subscribedUserStatus: any;

  rikuConversationId: string;
  isConversationCreated: boolean = false;

  constructor(
    private twilioService: TwilioService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private router: Router,
    private userService: UserService,
    private location: Location,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('email');
    this.userId = localStorage.getItem('userId');
    this.twilioService.connect().then((res) => {
      if (res) {
        this.subscribedMessage = this.twilioService.newMessageReceived.subscribe((resp: any) => {
          if (resp && resp.twilio_conversation_id) {
            if (resp.twilio_conversation_id == this.sid) {
              if (this.conversationMessages.findIndex(x => x.sid == resp.sid) < 0) {
                this.conversationMessages.push(resp)
              }
            }
            const index = this.conversationList.findIndex((x: any) => x.twilio_conversation_id == resp.twilio_conversation_id)
            if (index > -1) {
              this.conversationList[index].last_message = resp;
              this.conversationList.unshift(this.conversationList.splice(index, 1)[0]);
            }
          }
        })
        // update offline/online indicator when participants goes offline/online
        this.subscribedUserStatus = this.twilioService.participantUpdated.subscribe((participant) => {
          const index = this.conversationList.findIndex((conversation: any) => conversation.participant_1.user_id == participant.identity || conversation.participant_2.user_id == participant.identity);
          if (index >= 0) {
            if (this.conversationList[index].participant_1.user_id === participant.identity) {
              this.conversationList[index].participant_1.is_online = participant.online;
            } else if (this.conversationList[index].participant_2.user_id === participant.identity) {
              this.conversationList[index].participant_2.is_online = participant.online;
            }
          }
        })
        //get conversiation list / create conversation
        if (this.userType === 'buyer') {
          if (localStorage.getItem('chatUserId') && localStorage.getItem('chatUserEmail')) {
            this.chatUser = localStorage.getItem('chatUserId')
            this.chatUserEmail = localStorage.getItem('chatUserEmail')
          }
          this.getConversationList();
        } else if (this.userType === 'seller' || this.userType === 'dealer') {
          this.getConversationList();
        }
      }
    });
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  getConversationList() {
    this.loading = true;
    this.twilioService.conversationList().subscribe(async (resp: any) => {
      this.conversationList = resp.data;
      this.loading = false;
      if (this.conversationList.length > 0) {
        this.getEveryConversationDetail();
      }
      if (this.userType == 'buyer') {
        if (this.userId && this.chatUser) {
          if (this.conversationList.length === 0) {
            // this.twilioService.createConversation(this.userId, this.chatUser, this.chatUserEmail)).subscribe((resp: any) => {
            //   this.isConversationCreated = true;
            //   this.getSetConversations();
            // })
            this.twilioService.createConversation(this.userId, this.chatUser, this.chatUserEmail).then((res: any) => {
              this.isConversationCreated = true;
              this.getSetConversations();
            }).catch((error)=>{
              this.isConversationCreated = true;
              this.getSetConversations();
            })
          } else {
            for (let i = 0; i < this.conversationList.length; i++) {
              if (this.conversationList[i].participant_2.user_id === this.chatUser) {
                this.isConversationCreated = true;
                this.openChat(i)
                break;
              }
            }
            if (this.isConversationCreated === false) {
              // (await this.twilioService.createConversation(this.userId, this.chatUser, this.chatUserEmail)).subscribe((resp: any) => {
              //   this.getSetConversations();
              // });
              this.twilioService.createConversation(this.userId, this.chatUser, this.chatUserEmail).then((res: any) => {
                this.isConversationCreated = true;
                this.getSetConversations();
              }).catch((error)=>{
                this.isConversationCreated = true;
                this.getSetConversations();
              })
            }
          }
        } else {
          this.isConversationCreated = true;
        }
      } else {
        this.isConversationCreated = true;
      }
    });
  }

  getSetConversations() {
    this.twilioService.conversationList().subscribe((resp: any) => {
      this.conversationList = resp.data
    });
  }

  async getEveryConversationDetail() {
    let i = 0;
    for (let conversation of this.conversationList) {
      const currentConversation: any = await this.twilioService.getMessages(conversation.twilio_conversation_id);
      if (currentConversation.is_twilio_conversation_deleted == false) {
        conversation.messages = currentConversation.messages ? currentConversation.messages : [];
        const lastMessage: any = currentConversation.last_message;
        conversation.last_message = lastMessage;
        conversation.updated_at = currentConversation.updated_at;
        const participant1 = currentConversation.participants?.find((x: any) => x.identity == conversation.participant_1.user_id);
        const participant2 = currentConversation.participants?.find((x: any) => x.identity == conversation.participant_2.user_id);
        conversation.participant_1.is_online = participant1 ? participant1.online : false;
        conversation.participant_2.is_online = participant2 ? participant2.online : false;
      } else {
        this.conversationList.splice(i, 1);
      }
      i++;
      if (i == (this.conversationList.length - 1)) {
        this.conversationList.sort((a: any, b: any) => {
          const date2: any = new Date(b.updated_at).getTime();
          const date1: any = new Date(a.updated_at).getTime();
          return date2 - date1;
        });
      }
    }
  }


  isOnline(conversationUser: any): boolean {
    const user = this.twilioService.participantsIdentity.find((x) => x.identity == conversationUser.user_id);
    return user ? user.online : false;
  }

  async openData(user: any) {
    if (this.userType === 'buyer') {
      let isconversationCreated = false;
      for (let i = 0; i < this.conversationList.length; i++) {
        if (this.conversationList[i].participant_2.user_id === user.user_id) {
          isconversationCreated = true;
          this.openChat(i)
          break;
        }
      }
      if (isconversationCreated === false) {
        // (await this.twilioService.createConversation(this.userId, user.user_id, user.email)).subscribe((resp: any) => {
        //   this.twilioService.conversationList().subscribe((resp1: any) => {
        //     this.conversationList = resp1.data
        //   })
        // })
        this.twilioService.createConversation(this.userId, user.user_id, user.email).then((res: any) => {
          this.isConversationCreated = true;
          this.getSetConversations();
        }).catch((error)=>{
          this.isConversationCreated = true;
          this.getSetConversations();
        })
      }
    } else if (this.userType === 'seller' || this.userType === 'dealer') {
      for (let i = 0; i < this.conversationList.length; i++) {
        if (this.conversationList[i].participant_1.user_id === user.user_id) {
          this.openChat(i);
          break;
        }
      }
    }
  }

  scrollToBottom = () => {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  getMessages(sid: any) {
    this.twilioService.getMessages(sid).then((resp: any) => {
      this.conversationMessages = resp.messages;
    })
  }

  sendMessage(event: any) {
    if (!this.message || this.message.trim() == '') {
      return;
    } else {
      var emailRegex = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";
      // var numberRegex = "^(\\+?\d{1,4}[\s-])?(?!0+\s+,?$)\\d{10}\s*,?$";
      if (this.message.match(emailRegex)) {
        this.toastr.warning(this.translate.instant('The chat does not allow of sharing confidential information'))
      } else if ((/^\d{7,}$/).test(this.message.replace(/[\s()+\-\.]|ext/gi, ''))) {
        this.toastr.warning(this.translate.instant('The chat does not allow of sharing confidential information'))
      }
      else {
        this.sendNotification(this.message.trim(), this.rikuConversationId);
        this.twilioService.sendMessage(this.message.trim(), this.sid);
        this.resumeConversation(this.rikuConversationId);
      }
    }
    this.message = "";
  }

  sendNotification(message: string, rikuConversationId: string) {
    if (!this.conversationScreen.is_online) {
      this.twilioService.sendChatNotification({
        message: message,
        conversation_id: rikuConversationId
      }).subscribe();
    }
  }

  async openChat(index: number) {
    if (this.userType === 'buyer') {
      this.selectedChat = index;
      this.blockDetails = this.conversationList[index].participant_1.block_details;
      this.conversationScreen = this.conversationList[index].participant_2;
      this.conversationScreen.is_online = this.isOnline(this.conversationScreen);
      //console.log('this.conversationScreen', this.conversationScreen);
      this.chatUserId = this.conversationScreen.user_id;
      this.sid = this.conversationList[index].twilio_conversation_id;
      this.rikuConversationId = this.conversationList[index].conversation_id;
      this.twilioService.setCurrentConversation(this.sid);
      //this.getMessages(this.sid)
      let messages: any = this.conversationList[index].messages ? this.conversationList[index].messages : [];
      if (messages.length == 0) {
        this.getMessages(this.sid)
      } else {
        this.conversationMessages = messages;
      }
      messages = [];
    } else if (this.userType === 'seller' || this.userType === 'dealer') {
      this.selectedChat = index;
      this.blockDetails = this.conversationList[index].participant_2.block_details
      this.conversationScreen = this.conversationList[index].participant_1;
      this.conversationScreen.is_online = this.isOnline(this.conversationScreen);
      this.chatUserId = this.conversationScreen.user_id;
      this.sid = this.conversationList[index].twilio_conversation_id;
      this.rikuConversationId = this.conversationList[index].conversation_id;
      this.twilioService.setCurrentConversation(this.sid);
      let messages: any = this.conversationList[index].messages ? this.conversationList[index].messages : [];
      if (messages.length == 0) {
        this.getMessages(this.sid)
      } else {
        this.conversationMessages = messages;
      }
    }
  }

  blockUser(userId: any, blockStatus: any) {
    if (blockStatus === 'block') {
      const modalRef = this.modalService.open(DeleteConfirmationComponent, { windowClass: 'delete-vehicle-modal' })
      modalRef.componentInstance.blockUserId = userId;
      modalRef.componentInstance.blockAction = ['chat', 'call']
      const message = this.translate.instant("Back to Chat")
      modalRef.componentInstance.blockSuccessBtnText = message

      modalRef.result.then().catch((resp: any) => {
        if (resp === 'userBlocked') {
          this.twilioService.conversationList().subscribe(async (resp: any) => {
            this.conversationList = resp.data;
            this.openChat(this.selectedChat)
          })
        }
      })
    } else if (blockStatus === 'unblock') {
      const modalRef = this.modalService.open(DeleteConfirmationComponent, { windowClass: 'delete-vehicle-modal' })
      modalRef.componentInstance.unblockUserId = userId;
      const blockmessage = this.translate.instant("Back to Chat")
      modalRef.componentInstance.unblockSuccessBtnText = blockmessage
      if (this.userType === 'buyer') {
        let blockCallId;
        let blockChatId;
        if (this.conversationList[this.selectedChat].participant_1.block_details) {
          for (let i = 0; i < this.conversationList[this.selectedChat].participant_1.block_details.length; i++) {
            if (this.conversationList[this.selectedChat].participant_1.block_details[i].type === 'call') {
              blockCallId = this.conversationList[this.selectedChat].participant_1.block_details[i].block_status_id
            }
            if (this.conversationList[this.selectedChat].participant_1.block_details[i].type === 'chat') {
              blockChatId = this.conversationList[this.selectedChat].participant_1.block_details[i].block_status_id
            }
          }
          modalRef.componentInstance.blockStatusId = [blockChatId, blockCallId]
        }
      } else if (this.userType === 'seller' || this.userType === 'dealer') {
        let blockCallId;
        let blockChatId;
        if (this.conversationList[this.selectedChat].participant_2.block_details) {
          for (let i = 0; i < this.conversationList[this.selectedChat].participant_2.block_details.length; i++) {
            if (this.conversationList[this.selectedChat].participant_2.block_details[i].type === 'call') {
              blockCallId = this.conversationList[this.selectedChat].participant_2.block_details[i].block_status_id
            }
            if (this.conversationList[this.selectedChat].participant_2.block_details[i].type === 'chat') {
              blockChatId = this.conversationList[this.selectedChat].participant_2.block_details[i].block_status_id
            }
          }
          modalRef.componentInstance.blockStatusId = [blockChatId, blockCallId]
        }
      }

      modalRef.result.then().catch((resp: any) => {
        if (resp === 'userUnblocked') {
          this.twilioService.conversationList().subscribe(async (resp: any) => {
            this.conversationList = resp.data;
            this.openChat(this.selectedChat)
          })
        }
      })
    }

  }

  deleteConversation(conversationIndex: number) {
    const conversationId = this.conversationList[conversationIndex].conversation_id
    const modalRef = this.modalService.open(DeleteConfirmationComponent, {
      windowClass: 'delete-vehicle-modal'
    })
    modalRef.componentInstance.conversationId = conversationId;
    const message = this.translate.instant("Back to Chat List")
    modalRef.componentInstance.deleteSuccessBtnText = message

    modalRef.result.then().catch((resp: any) => {
      if (resp === 'deleted') {
        // this.twilioService.conversationList().subscribe(async (resp: any) => {
        //   this.conversationList = resp.data;
        //   this.conversationScreen = '';
        //   localStorage.removeItem('chatUserId')
        //   localStorage.removeItem('chatUserEmail')
        // })
        localStorage.removeItem('chatUserId')
        localStorage.removeItem('chatUserEmail')
        this.conversationList.splice(conversationIndex, 1);
        this.conversationScreen = null;
      }
    })
    // this.twilioService.deleteChatConversation(conversationId).subscribe((resp:any)=>{
    //   console.log(resp)
    // })
  }

  resumeConversation(rikuConversationId: string) {
    if (this.conversationList[this.selectedChat].is_other_person_deleted) {
      this.twilioService.resumeConversation({ conversation_id: rikuConversationId }).subscribe((res) => {
        if (res) {
          this.conversationList[this.selectedChat].is_other_person_deleted = false;
        }
      });
    }
  }

  openUserDetail() {
    this.isLoaded = false;
    this.twilioService.chatProfileDetails(this.chatUserId).subscribe((resp: any) => {
      this.userProfileDetails = resp.data;
      this.userProfileDetails.profile_pic = this.conversationScreen.profile_pic;
      this.isLoaded = true;
    })
    this.modalService.open(this.openUser, { size: 'md', backdrop: 'static', centered: true })
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  makeCall(userDetails: any) {
    const userId = this.userService.getUserId();
    if (!this.isPopUpOpened) {
      let type: any = null;
      const currentUserType = this.userService.getUserType();
      if (userDetails?.type.length < 1) {
        return;
      } else {
        const index: number = userDetails.type.indexOf(currentUserType);
        if (index !== -1) {
          userDetails.type.splice(index, 1);
        }
        if (userDetails.type.indexOf('buyer') > -1) {
          type = 'buyer';
        } else if (userDetails.type.indexOf('seller') > -1) {
          type = 'seller';
        } else if (userDetails.type.indexOf('dealer') > -1) {
          type = 'dealer';
        }
      }
      this.twilioService.getTermsAndConditionData('call', userId).subscribe((resp: any) => {
        const isAccepted = resp.data.is_accepted;
        if (isAccepted === false) {
          if (this.isPopUpOpened) {
            return;
          } else {
            this.isPopUpOpened = true
            const modalRef = this.modalService.open(TermsConditionsChatCallComponent, {
              windowClass: 'delete-vehicle-modal modal-lg'
            })
            modalRef.componentInstance.typeOfContact = 'Call'
            modalRef.componentInstance.userId = userId
            modalRef.componentInstance.userType = type
            modalRef.result.catch((result: any) => {
              this.isPopUpOpened = false;
              if (result === 'proceed') {
                this.userService.callingDetails = {};
                this.userService.callingDetails.id = userDetails.user_id;
                this.userService.callingDetails.type = type;
                this.userService.callingDetails.mobile_no = userDetails.mobile_no
                this.userService.callingDetails.country_code = userDetails.country_code;
                this.userService.callingDetails.first_name = userDetails.first_name;
                this.userService.callingDetails.last_name = userDetails.last_name;
                this.userService.callingDetails.profile_pic = userDetails.profile_pic;
                setTimeout(() => {
                  const url = `/${this.userType}/call`;
                  this.router.navigate([url]);
                }, 300)
              }
            })
          }
        } else {
          this.userService.callingDetails = {};
          this.userService.callingDetails.id = userDetails.user_id;
          this.userService.callingDetails.type = type;
          this.userService.callingDetails.mobile_no = userDetails.mobile_no
          this.userService.callingDetails.country_code = userDetails.country_code;
          this.userService.callingDetails.first_name = userDetails.first_name;
          this.userService.callingDetails.last_name = userDetails.last_name;
          this.userService.callingDetails.profile_pic = userDetails.profile_pic;
          setTimeout(() => {
            const url = '/buyer/call/';
            this.router.navigate([url]);
          }, 300)
        }
      })
    }
  }

  back() {
    this.location.back()
  }

  ngOnDestroy() {
    localStorage.removeItem('chatUserId');
    localStorage.removeItem('chatUserEmail');
    this.subscribedMessage.unsubscribe();
    this.subscribedUserStatus.unsubscribe();
  }
}


