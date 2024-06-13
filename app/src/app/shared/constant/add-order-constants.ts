export class AddOrderConstants {
  public static timeList: Array<string> = [
    '12:00 am',
    '12:15 am',
    '12:30 am',
    '12:45 am',
    '01:00 am',
    '01:15 am',
    '01:30 am',
    '01:45 am',
    '02:00 am',
    '02:15 am',
    '02:30 am',
    '02:45 am',
    '03:00 am',
    '03:15 am',
    '03:30 am',
    '03:45 am',
    '04:00 am',
    '04:15 am',
    '04:30 am',
    '04:45 am',
    '05:00 am',
    '05:15 am',
    '05:30 am',
    '05:45 am',
    '06:00 am',
    '06:15 am',
    '06:30 am',
    '06:45 am',
    '07:00 am',
    '07:15 am',
    '07:30 am',
    '07:45 am',
    '08:00 am',
    '08:15 am',
    '08:30 am',
    '08:45 am',
    '09:00 am',
    '09:15 am',
    '09:30 am',
    '09:45 am',
    '10:00 am',
    '10:15 am',
    '10:30 am',
    '10:45 am',
    '11:00 am',
    '11:15 am',
    '11:30 am',
    '11:45 am',
    '12:00 pm',
    '12:15 pm',
    '12:30 pm',
    '12:45 pm',
    '01:00 pm',
    '01:15 pm',
    '01:30 pm',
    '01:45 pm',
    '02:00 pm',
    '02:15 pm',
    '02:30 pm',
    '02:45 pm',
    '03:00 pm',
    '03:15 pm',
    '03:30 pm',
    '03:45 pm',
    '04:00 pm',
    '04:15 pm',
    '04:30 pm',
    '04:45 pm',
    '05:00 pm',
    '05:15 pm',
    '05:30 pm',
    '05:45 pm',
    '06:00 pm',
    '06:15 pm',
    '06:30 pm',
    '06:45 pm',
    '07:00 pm',
    '07:15 pm',
    '07:30 pm',
    '07:45 pm',
    '08:00 pm',
    '08:15 pm',
    '08:30 pm',
    '08:45 pm',
    '09:00 pm',
    '09:15 pm',
    '09:30 pm',
    '09:45 pm',
    '10:00 pm',
    '10:15 pm',
    '10:30 pm',
    '10:45 pm',
    '11:00 pm',
    '11:15 pm',
    '11:30 pm',
    '11:45 pm'
  ];

  public static orderStages: {
    PLACED: 'placed',
    EXPERT_EVALUATION: 'expert_evaluation',
    SCHEDULE_MEETING: 'schedule_meeting',
    VEHICLE_REVIEW: 'vehicle_review',
    PRICE_NEGOTIATION: 'price_negotiation',
    VEHICLE_PROCEDURE_CHECK: 'vehicle_procedure_check',
    BUY_NOW: 'buy_now',
    LOAN: 'loan',
    VEHICLE_PROCEDURE: 'vehicle_procedure',
    VEHICLE_DELIVERY_STATUS: 'vehicle_delivery_status'
  }

  public static orderStagesNumber: {
    PLACED: 1,
    EXPERT_EVALUATION: 2,
    SCHEDULE_MEETING: 3,
    VEHICLE_REVIEW: 4,
    PRICE_NEGOTIATION: 5,
    VEHICLE_PROCEDURE_CHECK: 6,
    BUY_NOW: 7,
    VEHICLE_PROCEDURE: 8,
    VEHICLE_DELIVERY_STATUS: 9
  }
}

export enum OrderStages {
  PLACED = 'placed',
  EXPERT_EVALUATION = 'expert_evaluation',
  SCHEDULE_MEETING = 'schedule_meeting',
  VEHICLE_REVIEW = 'vehicle_review',
  PRICE_NEGOTIATION = 'price_negotiation',
  VEHICLE_PROCEDURE_CHECK = 'vehicle_procedure_check',
  BUY_NOW = 'buy_now',
  LOAN = 'loan',
  VEHICLE_PROCEDURE = 'vehicle_procedure',
  VEHICLE_DELIVERY_STATUS = 'vehicle_delivery_status'
}

export enum OrderStepsNumber {
  PLACED = 1,
  EXPERT_EVALUATION = 2,
  SCHEDULE_MEETING = 3,
  VEHICLE_REVIEW = 4,
  PRICE_NEGOTIATION = 5,
  VEHICLE_PROCEDURE_CHECK = 6,
  BUY_NOW = 7,
  LOAN = 8,
  VEHICLE_PROCEDURE = 9,
  VEHICLE_DELIVERY_STATUS = 10
}

export enum VehicleReviewStatus {
  AS_EXPECTED = 'as_expected',
  NOT_AS_EXPECTED = 'not_as_expected'
}

export enum VehicleProcedureSteps {
  REQUEST_FOR_DOCUMENTS = 'request_for_documents',
  CONTRACT_DEVELOPMENT = 'contract_development',
  NOTARY = 'notary',
  MONEY_TRANSFER_TO_SELLER = 'money_transfer_to_seller',
  TAX_PAYMENT_ORDERS = 'tax_payment_orders',
  NATIONAL_TRANSIT = 'national_transit',
  REGISTRATION_DELIVERY = 'registration_delivery'
};

export enum VehicleProcedureStepsNumber {
  REQUEST_FOR_DOCUMENTS = 1,
  CONTRACT_DEVELOPMENT = 2,
  NOTARY = 3,
  MONEY_TRANSFER_TO_SELLER = 4,
  TAX_PAYMENT_ORDERS = 5,
  NATIONAL_TRANSIT = 6,
  REGISTRATION_DELIVERY = 7
};

export enum ExpertReviewSteps {
  PRODUCT_SERVICES = 'product_services',
  FIND_EXPERT_APPRAISER = 'find_expert_appraiser',
  CONTACT_INFORMATION = 'contact_information',
  VEHICLE_INFORMATION = 'vehicle_information',
  PAYMENT = 'payment',
  CONFIRMATION = 'confirmation'
};

export enum ExpertReviewStepsNumber {
  PRODUCT_SERVICES = 1,
  FIND_EXPERT_APPRAISER = 2,
  CONTACT_INFORMATION = 3,
  VEHICLE_INFORMATION = 4,
  PAYMENT = 5,
  CONFIRMATION = 6,
  SUMMARY = 7
};
