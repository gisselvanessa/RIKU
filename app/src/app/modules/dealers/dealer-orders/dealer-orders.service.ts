import { Injectable } from '@angular/core';
import { environment } from "../../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ScheduleMeeting, Order, OrderListResponse, OrderDetails } from './dealer-order.model';

@Injectable({
  providedIn: 'root'
})
export class DealerOrdersService {

  currentOrder: OrderDetails;
  constructor(private http: HttpClient) { }


  public orderDetails(id: string) {
    return this.http.get(`${environment.apiURL}/dealer/orders/${id}`)
  }

  public getOrderList(params: any) {
    return this.http.get<OrderListResponse>(`${environment.apiURL}/dealer/orders`, {params: params})
  }

  public getCurrentOrder(){
    return this.currentOrder;
  }

  public setCurrentOrder(orderDetail: OrderDetails){
    this.currentOrder = Object.assign({}, orderDetail);
  }

  public makePayment(type: string, order_id: string){
    const params = `type=${type}&order_id=${order_id}`;
    return this.http.get(`${environment.apiURL}/checkout?${params}`);
  }

  public confirmDelivery(deliveryData: {order_id: string, is_delivered: boolean}){
    return this.http.post(`${environment.apiURL}/dealer/orders/confirm-delivery`, deliveryData);
  }

  public getAccountDetails(type: string, order_id: string){
    const params = `type=${type}&order_id=${order_id}`;
    return this.http.get(`${environment.apiURL}/payment/account?${params}`);
  }

  //this function is used to submit bank receipt
  public submitBankReceipt(data: any) {
    return this.http.post<any>(`${environment.apiURL}/dealer/orders/bank-receipt`, data);
  }

  public sendOfferResponse(offerResponse: any, orderId: any) {
    return this.http.post<any>(`${environment.apiURL}/seller/negotiate-price`, { order_id: orderId, is_accepted: offerResponse })
  }

  public sendDeliveryStatus(deliveryStatus:any, orderId:any){
    return this.http.post<any>(`${environment.apiURL}/seller/confirm-delivery`,{order_id:orderId, status:deliveryStatus})
  }

}
