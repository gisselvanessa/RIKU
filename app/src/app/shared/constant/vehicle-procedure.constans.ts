//#Vehicle transfer procedure without loan
const VehicleProcedureSteps = {
 REQUEST_FOR_DOCUMENTS: 'request_for_documents',
 CONTRACT_DEVELOPMENT: 'contract_development',
 NOTARY: 'notary',
 TAX_PAYMENT_ORDERS: 'tax_payment_orders',
 MONEY_TRANSFER_TO_SELLER: 'money_transfer_to_seller',
 NATIONAL_TRANSIT: 'national_transit',
 APPLIES_TO_HEAVY_VEHICLES: 'applies_to_heavy_vehicle',
 REGISTRATION_DELIVERY: 'registration_delivery',
};

// Vehicle procedure without loan (used car / heavy vehicle) documents
const VehicleProcedureStepDocument = {
 REQUEST_FOR_DOCUMENTS: [
  'unique_vehicle_certificate_ant',
  'commercial_certificate',
  'copy_of_registration',
  'identification_documents',
  'identification_documents_buyer',
  'special_power'
 ],
 CONTRACT_DEVELOPMENT: ['purchase_contract', 'contracts_of_power_to_carry_out_the_vehicle_process'],
 NOTARY: ['notarization_of_sales_contract', 'contract_of_power_to_carry_out_the_vehicle_procedure'],
 TAX_PAYMENT_ORDERS: [
  'tuition_payment',
  'duplicate_registration_payment',
  'sri_domain_transfer_payment',
  'municipal_tax_payments',
  'payments_of_fines_and_infractions',
  'request_for_shift_application_of_the_ant',
 ],
 MONEY_TRANSFER_TO_SELLER: ['proof_to_transfer'],
 NATIONAL_TRANSIT: ['enabling_and_sales_contract', 'tax_payments_made', 'power_of_attorney_contract'],
 APPLIES_TO_HEAVY_VEHICLES: [
  'ant_operation_permit',
  'ant_quota_increase',
  'vehicle_insurance_policy',
  'technical_approval_document',
 ],
 REGISTRATION_DELIVERY: ['new_owner_registration'],
};

//# Vehicle procedure with the loan (used car)
const VehicleProcedureStepsUsedWithLoan = {
 REQUEST_FOR_DOCUMENTS: 'request_for_documents',
 LOAN_DISBURSEMENT: 'loan_disbursement',
 CONTRACT_DEVELOPMENT: 'contract_development',
 NOTARY: 'notary',
 MONEY_TRANSFER_TO_SELLER: 'money_transfer_to_seller',
 TAX_PAYMENT_ORDERS: 'tax_payment_orders',
 NATIONAL_TRANSIT: 'national_transit',
 APPLIES_TO_HEAVY_VEHICLES: 'applies_to_heavy_vehicle',
 REGISTRATION_DELIVERY: 'registration_delivery',
};

const VehicleProcedureStepsUsedWithLoanDocument = {
 REQUEST_FOR_DOCUMENTS: [
  'unique_vehicle_certificate_ant',
  'commercial_certificate',
  'copy_of_registration',
  'identification_documents',
  'identification_documents_buyer',
  'special_power'
 ],
 LOAN_DISBURSEMENT: ['loan_disbursement'],
 CONTRACT_DEVELOPMENT: ['purchase_contract', 'trust_agreement', 'trust_department_subscription'],
 NOTARY: ['notarization_of_purchase_contract', 'trust_agreement'],
 MONEY_TRANSFER_TO_SELLER: ['proof_to_transfer', 'vehicle_delivery'],
 TAX_PAYMENT_ORDERS: [
  'tuition_payment',
  'duplicate_registration_payment',
  'sri_domain_transfer_payment',
  'municipal_tax_payments',
  'payments_of_fines_and_infractions',
  'request_for_shift_application_of_the_ant',
 ],
 NATIONAL_TRANSIT: [
  'enabling_and_sales_contract',
  'trust_agreement',
  'proceeding_management_contract',
  'tax_payments_made',
  'ant_turn',
  'technical_review_document',
 ],
 APPLIES_TO_HEAVY_VEHICLES: [
  'ant_operation_permit',
  'ant_quota_increase',
  'vehicle_insurance_policy',
  'technical_approval_document',
 ],
 REGISTRATION_DELIVERY: ['new_owner_registration'],
};

//#Vehicle procedure with a loan (new vehicle)
const VehicleProcedureStepNewWithLoan = {
 REQUEST_FOR_DOCUMENTS: 'request_for_documents',
 VEHICLE_BILL: 'vehicle_bill',
 LOAN_DISBURSEMENT: 'loan_disbursement',
 CONTRACT_DEVELOPMENT: 'contract_development',
 NOTARY: 'notary',
 MONEY_TRANSFER_TO_DEALERSHIP: 'money_transfer_to_dealership',
 CONCESSIONAIRE: 'concessionaire',
 DELIVERY_VEHICLE: 'delivery_vehicle',
};

const VehicleProcedureStepNewWithLoanDocument = {
 REQUEST_FOR_DOCUMENTS: ['purchase_order'],
 VEHICLE_BILL: ['invoice'],
 LOAN_DISBURSEMENT: ['loan_disbursement'],
 CONTRACT_DEVELOPMENT: ['trust_agreement', 'contract_fiduciary_offices_subscription'],
 NOTARY: ['notarization_of_purchase_contract'],
 MONEY_TRANSFER_TO_DEALERSHIP: ['bank_transfer_receipt'],
 CONCESSIONAIRE: ['contract_fiduciary_offices_subscription'],
 DELIVERY_VEHICLE: ['new_owner_registration'],
};

/* User Car / Heavy Vehicle
 1. request_for_documents
 2. LOAN_DISBURSEMENT // if vehicle purchase with loan
 2. contract_development
 3. notary
 4. tax_payment_orders
 5. money_transfer_to_seller
 6. NATIONAL_TRANSIT
 7. applies_to_heavy_vehicle
 8. registration_delivery
*/


/*New Vehicle
 1. request_for_documents
 2. vehicle_bill
 3. loan_disbursement
 4. contract_development
 5. notary
 6. money_transfer_to_dealership
 7. concessionaire
 8. delivery_vehicle
 */



 /* Used Cars/Heavy Vehicle Documents */
export const UsedCarVehicleProcedureDocuments = {
  "request_for_documents": [
    'unique_vehicle_certificate_ant',
    'commercial_certificate',
    'copy_of_registration',
    'identification_documents',
    'identification_documents_buyer',
    'special_power'
  ],
  "loan_disbursement": ['loan_disbursement'],
  "contract_development": ['purchase_contract', 'trust_agreement', 'trust_department_subscription'],
  "notary": ['notarization_of_purchase_contract', 'trust_agreement'],
  "money_transfer_to_seller": ['proof_to_transfer', 'vehicle_delivery'],
  "tax_payment_orders": [
    'tuition_payment',
    'duplicate_registration_payment',
    'sri_domain_transfer_payment',
    'municipal_tax_payments',
    'payments_of_fines_and_infractions',
    'request_for_shift_application_of_the_ant',
  ],
  "national_transit": [
    'enabling_and_sales_contract',
    'trust_agreement',
    'proceeding_management_contract',
    'tax_payments_made',
    'ant_turn',
    'technical_review_document',
  ],
  "applies_to_heavy_vehicle": [
    'ant_operation_permit',
    'ant_quota_increase',
    'vehicle_insurance_policy',
    'technical_approval_document',
  ],
  "registration_delivery": ['new_owner_registration']
}

export const NewVehicleDocuments = {
  "request_for_documents": ['purchase_order'],
  "vehicle_bill": ['invoice'],
  "loan_disbursement": ['loan_disbursement'],
  "contract_development": ['trust_agreement', 'contract_fiduciary_offices_subscription'],
  "notary": ['notarization_of_purchase_contract'],
  "money_transfer_to_dealership": ['bank_transfer_receipt'],
  "concessionaire": ['contract_fiduciary_offices_subscription'],
  "delivery_vehicle": ['new_owner_registration']
}
