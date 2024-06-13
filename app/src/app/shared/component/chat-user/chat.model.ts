export class JakayMessage {
    twilio_conversation_id:string;
    sid: string;
    message: string;
    author: string;
    created: string;
}

export class JakayConversation {
  sid: string;
  participants: Array<any>;
  messages: Array<JakayMessage> = [];
  last_message: JakayMessage;
  updated_at: Date;
}

export class JakayConversationList {
    last_message?:JakayMessage;
    conversation_id: string;
    twilio_conversation_id: string;
    participant_1: Participant;
    participant_2: Participant;
    updated_at?: Date;
    messages?: Array<JakayMessage> = [];
    is_other_person_deleted: boolean;
}

export class Participant {
    first_name: string;
    last_name: string;
    profile_pic: string;
    user_id: string;
    is_online: boolean;
    email: string;
    block_details: Array<BlockDetails>
}

export class BlockDetails {
    block_status_id: string;
    type: string;
}
