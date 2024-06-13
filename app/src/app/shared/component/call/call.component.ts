import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TermsConditionsChatCallComponent } from 'src/app/modules/buyers/buyer-vehicle/terms-conditions-chat-call/terms-conditions-chat-call.component';
import { TwilioService } from '../../services/twilio.service';
import { Timer } from './timer';
import { UserService } from '../../services/user.service';

declare var Twilio: any;

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss']
})

export class CallComponent implements OnInit, OnDestroy {
  @Input() callObject: any = {};
  @Output() callended: EventEmitter<{error: boolean}> = new EventEmitter(false);
  isConnected: boolean = false;
  timerStatus:number = 1;
  interval:any;
  device:any[] = [];
  isPopUpOpened: boolean = false;
  callTime:any;
  isCallTimeStarted = false;
  callTimeInterval:any;
  isMicMute = false;
  currentSpeaker:any;
  disabledActions = false;
  ifUserCutTheCall = false;
  moveToChat = false;
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private twilioService:TwilioService,
    private location:Location,
    public userService:UserService
  ) { }

  ngOnInit(): void {
    this.checkStatus();
    this.getAudioOutputList();
    this.requestAudioOutputPermission();
  }

  makeCall(){
    if(this.callObject.caller_id && this.callObject.receiver_id && this.callObject.receiver_role_type && this.callObject.number){
      let selectedParams: any = {};
      selectedParams.caller_id = this.callObject.caller_id;
      selectedParams.receiver_id = this.callObject.receiver_id;
      selectedParams.receiver_role_type = this.callObject.receiver_role_type;
      selectedParams.number = this.callObject.number;
      this.twilioService.connectCall(selectedParams);
      Twilio.Device.disconnect((res: any) => {
        //console.log('disconnect', res);
        if(!this.ifUserCutTheCall) this.disconnectCall();
      });
    }else{
      this.location.back();
      this.callended.emit(
        {
          error:true
        }
      );
    }
  }

  muteCalls(){
    this.twilioService.muteCall();
    this.isMicMute = true;
  }

  unmuteCalls(){
    this.twilioService.unmuteCall();
    this.isMicMute = false;
  }

  disconnectCall(){
    this.ifUserCutTheCall = true;
    if(!this.moveToChat){
      setTimeout(() => {
        if (this.userService.isFromMobile) {
          this.router.navigate[(`${this.callObject.receiver_role_type}/${this.callObject.receiver_role_type}-profile/${this.callObject.receiver_id}`)];
        } else {
          this.location.back();
        }
      }, 2000)
    }
    this.twilioService.disconnectCall();
    this.disabledActions = true;
    this.isConnected = true;
    this.timerStatus = 3;
    clearInterval(this.callTimeInterval);
    this.callended.emit(
      {
        error:false
      }
    );
  }

  checkStatus(){
    if(!this.isConnected){
      this.interval = setInterval(()=>{
        const SID: any = this.twilioService.getSID();
        if(SID){
          this.getStatus(SID);
        }
      },1000);
    }
  }

  getStatus(SID:any){
    this.twilioService.getStatus(SID).subscribe((res:any)=>{
      if(res.data.status == 'in-progress'){
        this.isConnected = true;
        this.timerStatus = 2;
        clearInterval(this.interval);
        //timer start
        if(!this.isCallTimeStarted){
          this.isCallTimeStarted = true;
          const timer = new Timer();
          timer.start();
          this.callTimeInterval = setInterval(() => {
            this.callTime = new Date(timer.getTime());
          }, 100);
        }
      } else if(res.data.status == 'completed' || res.data.status == 'no-answer'){
        this.isConnected = true;
        this.timerStatus = 3;
        clearInterval(this.callTimeInterval);
      }
    })
  }

  async setSpeaker(deviceId: string){
    this.currentSpeaker = deviceId;
    this.twilioService.setSpeaker(deviceId);
  }

  public async requestAudioOutputPermission() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('getUserMedia is not supported in this browser');
      return;
    }
    const constraints = { audio: true, video: false };
    try {
      await navigator.mediaDevices.getUserMedia(constraints);
      this.makeCall();
      //console.log('Success, permission to access audio output device is granted');
    } catch (error) {
      console.error('Error while requesting permission to access audio output device', error);
    }
  }

  public getAudioOutputList(){
    navigator.mediaDevices.getUserMedia({audio: true}).then(() => {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        this.device = devices.filter((device) => {
          //console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
          return device.kind === 'audiooutput';
        });
        if(this.device.length){
          this.currentSpeaker = this.device[0].deviceId;
        }
      })
      .catch((err) => {
        console.log(`${err.name}: ${err.message}`);
      });
    })
    .catch((err) => {
      console.log(`${err.name}: ${err.message}`);
    });
  }

  openContact(type:string) {
    if(!this.isPopUpOpened){
      this.isPopUpOpened = true;
      this.twilioService.getTermsAndConditionData('chat', this.callObject.caller_id).subscribe((resp: any) => {
        const modalRef = this.modalService.open(TermsConditionsChatCallComponent, {
          windowClass: 'delete-vehicle-modal modal-lg'
        })
        modalRef.componentInstance.typeOfContact = 'Chat'
        modalRef.componentInstance.userId = this.callObject.caller_id
        modalRef.componentInstance.userType = type
        modalRef.componentInstance.showTermsAndConditions = false;
        modalRef.componentInstance.isWarning = true;
        modalRef.result.catch((result: any) => {
          this.isPopUpOpened = false;
          if (result === 'proceed') {
            this.moveToChat = true;
            this.twilioService.disconnectCall();
            setTimeout(()=>{
              this.router.navigate(['/buyer/chat-user']);
            },3000)
          }
        });
      })
    }
  }

  ngOnDestroy(): void{
    if(this.userService.isFromMobile){
      this.userService.isFromMobile = false;
    }
  }
}
