import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ScheduleMeeting, Order } from './buyer-order.model';


@Injectable({
  providedIn: 'root'
})
export class BuyerOrdersService {

  currentOrder: Order;
  constructor(private http: HttpClient) { }

  public postOrder(orderData: { vehicle_id?: string, current_stage: string, loan_id?: string }) {
    return this.http.post(`${environment.apiURL}/buyer/orders`, orderData);
  }

  public scheduleMeeting(scheduleMeeting: ScheduleMeeting) {
    return this.http.post(`${environment.apiURL}/buyer/order/schedule/meeting`, scheduleMeeting)
  }

  public reviewVehicle(reviewVehicleData: { order_id: string, current_stage: string, vehicle_review_status: string, vehicle_review_comment: string }) {
    return this.http.post(`${environment.apiURL}/buyer/order/vehicle/review`, reviewVehicleData)
  }

  public negotiatePrice(negotiateData: { order_id: string, offered_price: number, is_price_negotiating: boolean }) {
    return this.http.put(`${environment.apiURL}/buyer/order/price-negotiation`, negotiateData)
  }

  public setVehicleProcedureCheck(orderId: string, isVehicleProcedure: boolean, currentStage: string) {
    const data = {
      order_id: orderId,
      is_vehicle_procedure: isVehicleProcedure,
      current_stage: currentStage
    }
    return this.http.post(`${environment.apiURL}/buyer/order/vehicle/procedure`, data);
  }

  public expertReviewCheck(data: any) {
    return this.http.post(`${environment.apiURL}/buyer/order/expert/evaluation`, data);
  }

  public orderDetails(id: string) {
    return this.http.get(`${environment.apiURL}/buyer/orders/${id}`)
  }

  public orderList(selectedStatus: string, params: any) {
    return this.http.get(`${environment.apiURL}/buyer/orders?status=${selectedStatus}&limit=${params.limit}&page=${params.page}`)
  }

  public getCurrentOrder() {
    return this.currentOrder;
  }

  public setCurrentOrder(orderDetail: Order) {
    this.currentOrder = Object.assign({}, orderDetail);
  }

  public makePayment(type: string, order_id: string) {
    const params = `type=${type}&order_id=${order_id}`;
    return this.http.get(`${environment.apiURL}/checkout?${params}`);
  }

  public confirmDelivery(deliveryData: { order_id: string, is_delivered: boolean }) {
    return this.http.post(`${environment.apiURL}/buyer/orders/confirm-delivery`, deliveryData);
  }

  public getAccountDetails(type: string, order_id: string) {
    const params = `type=${type}&order_id=${order_id}`;
    return this.http.get(`${environment.apiURL}/payment/account?${params}`);
  }

  //this function is used to submit bank receipt
  public submitBankReceipt(data: any) {
    return this.http.post<any>(`${environment.apiURL}/buyer/orders/bank-receipt`, data);
  }

  //cancel order
  public cancelOrder(data: {order_id: string}){
    return this.http.post<any>(`${environment.apiURL}/buyer/orders/cancel`, data);
  }
}
