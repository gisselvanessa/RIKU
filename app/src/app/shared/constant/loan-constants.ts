export enum LoanStages {
  APPLICATION = 'application',
  CEDULA_ID_VERIFICATION = 'cedula_id_verification',
  APPLICANT_INFO = 'applicant_info',
  CO_APPLICANT_INFO = 'co_applicant_info',
  REFERENCE_INFO = 'reference_info',
  APPLICATION_REVIEW = 'application_review',
  SUMMARY = 'summary',
}

export enum LoanStepsNumber {
  APPLICATION = 1,
  CEDULA_ID_VERIFICATION = 2,
  APPLICANT_INFO = 3,
  CO_APPLICANT_INFO = 4,
  REFERENCE_INFO = 5,
  APPLICATION_REVIEW = 6,
  SUMMARY = 7,
}

export enum LoanConstansts {
  MIN_EMI_MONTH = 1,
  MAX_EMI_MONTH = 72,
  MAX_AUTOMOBILE_EMI_MONTH = 60,
  MIN_DEPOSIT = 30,
  MAX_DEPOSIT = 95,
  CAR_AUTOMOBILE_INTEREST_RATE = 16.8, // for automobile
  HEAVY_VEHICLE_INTEREST_RATE = 11 // other than automobile
};

export const LOAN_TYPES = ['variable', 'fixed', 'readjustable'];

export const LoanStatus = {
  PENDING: 'pending',
  QUALIFIED: 'qualified',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

export const LoanDocuments = {
  'employed': { // Dependent
    personal: {
      primary: [
        {
          name: 'Photo',
          key: 'photo'
        },
        {
          name: 'Copy of ID and Voting Ballot or Refugee ID',
          key: 'voting_ballot_or_refugee_id'
        },
        {
          name: 'Basic Service',
          key: 'basic_service'
        }
      ],
      additional: [
        {
          name: 'Passport if you are a foreigner',
          key: 'passport'
        },
        {
          name: 'Marital Dissolution if it exists',
          key: 'marital_dissolution'
        },
        // {
        //   name: 'Affidavit if any',
        //   key: 'affidavit'
        // },
        {
          name: 'Special or General Power of Attorney (Foreign - Apostille) if required',
          key: 'special_or_general_power_of_attorney'
        }
      ]
    },
    income: {
      primary: [
        {
          name: 'Last 3 Pay Stubs',
          key: 'last_2_pay_slips'
        },
        {
          name: 'IESS Mechanized Role',
          key: 'iess_mechanized_role'
        },
        {
          name: 'Account Status',
          key: 'account_status'
        },
        // {
        //   name: 'Contribution to ISSFA and/or ISSPOL If you are a police officer',
        //   key: 'issfa_contribution_and_or_isspol'
        // }
      ],
      additional: [
        {
          name: 'Proof of Foreign Transfers if applicable',
          key: 'foreign_transfer_proof'
        },
        {
          name: 'Certificate of the owner of the unit.',
          key: 'unit_owner_certificate'
        },
        {
          name: 'Contribution to ISSFA and/or ISSPOL If you are a police officer',
          key: 'issfa_contribution_and_or_isspol'
        }
      ]
    },
    heritage: {
      primary: [
        {
          name: 'Copy/Original of Deed',
          key: 'deed_certificate'
        },
        {
          name: 'Property Tax',
          key: 'property_tax'
        },
        // {
        //   name: 'Legalized Purchase and Sale Contract',
        //   key: 'purchase_and_sale_contract'
        // },
        // {
        //   name: 'Expert appraisal applies only used vehicles',
        //   key: 'expert_appraisal'
        // }
      ],
      additional: [
        {
          name: 'Lien Certificate if required',
          key: 'lien_certificate'
        },
        {
          name: 'Lease Contract',
          key: 'lease_contract'
        },
        {
          name: 'Expert technical review (Applies to used vehicles)',
          key: 'expert_review'
        },
        // {
        //   name: 'Property Titles or Invoices if required',
        //   key: 'property_titles_or_invoice'
        // },
        // {
        //   name: 'Expert appraisal applies only used vehicles',
        //   key: 'expert_appraisal'
        // }
      ]
    }
  },
  'self_employed': { // Independent
    personal: {
      primary: [
        {
          name: 'Photo',
          key: 'photo'
        },
        {
          name: 'Copy of ID and Voting Ballot or Refugee ID',
          key: 'voting_ballot_or_refugee_id'
        },
        {
          name: 'Basic Service',
          key: 'basic_service'
        }
      ],
      additional: [
        {
          name: 'Passport if you are a foreigner',
          key: 'passport'
        },
        {
          name: 'Marital Dissolution if it exists',
          key: 'marital_dissolution'
        },
        // {
        //   name: 'Affidavit if any',
        //   key: 'affidavit'
        // },
        {
          name: 'Special or General Power of Attorney (Foreign - Apostille) if required',
          key: 'special_or_general_power_of_attorney'
        }
      ]
    },
    income: {
      primary: [
        {
          name: 'RUC/RISE (Declarations) annual or last three months',
          key: 'ruc_or_rise_declaration'
        },
        {
          name: 'Account statement last three months',
          key: 'last_2_month_account_statement'
        },
        // {
        //   name: 'In case of being a licensed professional driver',
        //   key: 'professional_driver_license'
        // },
        // {
        //   name: 'Certificate of the Coop. Taxi or Bus and Copy of the vehicle registration (driver/official)',
        //   key: 'coop_certification_or_vehicle_registration_of_bus_taxi'
        // }
      ],
      additional: [
        {
          name: 'Proof of Foreign Transfers if applicable',
          key: 'foreign_transfer_proof'
        },
        {
          name: 'Purchase Invoice if required',
          key: 'purchase_invoice'
        },
        // {
        //   name: 'RUC (Declarations) from abroad if it exists',
        //   key: 'abroad_ruc_declaration'
        // }
        
        {
          name: 'Certificate of the Coop. Taxi or Bus and Copy of the vehicle registration (driver/official)',
          key: 'coop_certification_or_vehicle_registration_of_bus_taxi'
        },
        {
          name: 'In case of being a licensed professional driver',
          key: 'professional_driver_license'
        }
      ]
    },
    heritage: {
      primary: [
        {
          name: 'Copy/Original of Deed',
          key: 'deed_certificate'
        },
        {
          name: 'Expert technical review (Applies to used vehicles)',
          key: 'expert_review'
        },
        // {
        //   name: 'Legalized Purchase and Sale Contract',
        //   key: 'purchase_and_sale_contract'
        // },
        // {
        //   name: 'Expert appraisal applies only used vehicles',
        //   key: 'expert_appraisal'
        // }
      ],
      additional: [
        {
          name: 'Lien Certificate if required',
          key: 'lien_certificate'
        },
        // {
        //   name: 'Property Titles or Invoices if required',
        //   key: 'property_titles_or_invoice'
        // },
        {
          name: 'Lease Contract',
          key: 'lease_contract'
        },
      ]
    }
  },
  'retired': {
    personal: {
      primary: [
        {
          name: 'Photo',
          key: 'photo'
        },
        {
          name: 'Copy of ID and Voting Ballot or Refugee ID',
          key: 'voting_ballot_or_refugee_id'
        },
        {
          name: 'Basic Service',
          key: 'basic_service'
        }
      ]
    },
    income: {
      primary: [
        {
          name: 'Role of retirement',
          key: 'role_of_retirement'
        },
        {
          name: 'Copy of the deposit books',
          key: 'deposit_book_copy'
        },
        {
          name: 'Documentation of Additional Income',
          key: 'additional_income_documentation'
        },
        {
          name: 'Proof of Foreign Transfers if applicable',
          key: 'foreign_transfer_proof'
        }
      ]
    }
  }
}

export const LoanType = {
  FIXED: 'fixed',
  VARIABLE: 'variable',
  READJUSTABLE: 'readjustable', // TODO: remove this
};

export const EducationLevel = {
  PRIMARY: 'primary',
  HIGH_SCHOOL: 'high_school',
  BACHELOR: 'bachelor',
  DEGREE: 'degree',
  MASTERS: 'masters',
  TECHNOLOGIST: 'technologist',
  NOTHING: 'nothing',
};

export const MaritalStatus = {
  SINGLE: 'single',
  MARRIED: 'married',
  WIDOW_OR_WIDOWER: 'widow_or_widower',
  DIVORCED: 'divorced',
  SEPARATED: 'separated',
};

export const DependencyRelationship = {
  DEPENDANT: 'dependant',
  INDEPENDENT: 'independent',
};

export const HomeStatus = {
  OWN: 'own',
  RENTED: 'rented',
  FAMILIAR: 'familiar',
  WITH_MORTGAGE: 'with_mortgage',
};

export const EmploymentType = {
  EMPLOYED: 'employed',
  SELF_EMPLOYED: 'self_employed',
  RETIRED: 'retired',
};

export const EconomicActivity = {
  AGRICULTURE: 'Agriculture, livestock, forestry and related service activities',
  MINING_AND_QUARRYING: 'Mining and quarrying',
  MANUFACTURING: 'Manufacturing',
  WATER_SUPPLY: 'Water supply, sewerage, waste management and sanitation activities',
  CONSTRUCTION: 'Construction',
  WHOLESALE_AND_RETAILING: 'Wholesale and retail trade; Repair of motor vehicles and motorcycles',
  ACCOMMODATION: 'Accommodation and food services',
  TRANSPORT: 'Transport and storage',
  INFORMATION: 'Information and communication',
  FINANCE: 'Financial and insurance',
  REAL_ESTATE: 'Real estate',
  PROFESSIONAL: 'Professional, technical and administrative activities and private households with domestic service',
  TEACHING: 'Teaching',
  SOCIAL_SERVICE: 'Social service',
  ENTERTAINMENT: 'Entertainment, recreation and other service activities',
  RETAIL_TRADE: 'Retail trade, except vehicles',
  WHOLESALE_TRADE: 'Wholesale trade, except vehicles',
};

export const LoanCurrentStage = {
  APPLICATION: 'application',
  CEDULA_ID_VERIFICATION: 'cedula_id_verification',
  APPLICANT_INFO: 'applicant_info',
  CO_APPLICANT_INFO: 'co_applicant_info',
  REFERENCE_INFO: 'reference_info',
  APPLICATION_REVIEW: 'application_review',
  SUMMARY: 'summary',
};

export const ReferenceType = {
  DAD: 'dad',
  MOM: 'mom',
  BROTHER: 'brother',
  SISTER: 'sister',
  UNCLE: 'uncle',
  AUNT: 'aunt',
  FEMALE_COUSIN: 'female_cousin',
  MALE_COUSIN: 'male_cousin',
  GRAND_FATHER: 'grand_father',
  GRAND_MOTHER: 'grand_mother',
  FRIEND: 'friend',
  NEIGHBOR: 'neighbor',
  GOD_FATHER: 'god_father',
  OTHER: 'other',
};

export const PreApprovalStatus = {
  NOT_ELIGIBLE_FOR_LOAN: 'NOT_ELIGIBLE_FOR_LOAN',
  CEDULA_ID_VERIFICATION: 'CEDULA_ID_VERIFICATION',
  LOAN_APPLICATION_CREATED: 'LOAN_APPLICATION_CREATED',
};

export const EmployementType = {
  EMPLOYED: 'employed',
  SELF_EMPLOYED: 'self_employed',
  RETIRED: 'retired',
};


export const MandatoryLoanDocuments = {
  'employed': [
    'photo',
    'voting_ballot_or_refugee_id',
    'basic_service',
    'last_2_pay_slips',
    'iess_mechanized_role',
    'account_status',
    // 'issfa_contribution_and_or_isspol',
    'deed_certificate',
    // 'purchase_and_sale_contract',
    // 'expert_appraisal',
    'property_tax',
  ],
  'self_employed': [
    'photo',
    'voting_ballot_or_refugee_id',
    'basic_service',
    'ruc_or_rise_declaration',
    'last_2_month_account_statement',
    // 'professional_driver_license',
    // 'coop_certification_or_vehicle_registration_of_bus_taxi',
    'deed_certificate',
    'expert_review',
    // 'purchase_and_sale_contract',
    // 'expert_appraisal'
  ],
  'retired': ['photo', 'voting_ballot_or_refugee_id', 'basic_service', 'role_of_retirement', 'deposit_book_copy',
    'additional_income_documentation', 'foreign_transfer_proof']
}
