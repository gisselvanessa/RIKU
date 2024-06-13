import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { OrderListResponse, OrderResponse } from './order.model';
import { Order } from '../../buyers/buyer-orders/buyer-order.model';

@Injectable({
  providedIn: 'root'
})

export class OrdersService {

  public baseURL:string = environment.adminApiURL;
  currentOrder: Order;

  constructor(private http: HttpClient) { }

  public orderDetails(id: string) {
    return this.http.get<OrderResponse>(`${environment.adminApiURL}/orders/${id}`)
  }

  public getOrderList(params: any) {
    return this.http.get<OrderListResponse>(`${environment.adminApiURL}/orders`, {params: params})
  }

  public paymentToSeller(data: any) {
    return this.http.post<any>(`${environment.adminApiURL}/orders/change-payment-status`, data)
  }

  public getCurrentOrder(){
    return this.currentOrder;
  }

  public setCurrentOrder(orderDetail: Order){
    this.currentOrder = Object.assign({}, orderDetail);
  }

  public confirmDelivery(deliveryData: {order_id: string, is_delivered: boolean}){
    return this.http.post(`${environment.adminApiURL}/orders/confirm-delivery`, deliveryData);
  }

  public confirmPayment(data:{order_id: string, is_received: boolean}){
    return this.http.post(`${environment.adminApiURL}/orders/confirm-payment`, data);
  }
}
