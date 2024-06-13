import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { PaginationData } from 'src/app/modules/admin/admin-vehicles/models/vehicle.model';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { CancelOrderDialogComponent } from '../order-details/cancel-order-dialog/cancel-order-dialog.component';

import { BuyerVehicleService } from '../../buyer-vehicle.service';
import { BuyerOrdersService } from '../buyer-orders.service';




@Component({
  selector: 'app-buyer-order-list',
  templateUrl: './buyer-order-list.component.html',
  styleUrls: ['./buyer-order-list.component.scss']
})
export class BuyerOrderListComponent implements OnInit {

  constructor(private buyerOrderService: BuyerOrdersService, private buyerVehicleService: BuyerVehicleService,
    private modalService: NgbModal, private router: Router) { }


  orderList: any = [];
  selectedTab = 'IN_PROGRESS';
  favId: any[] = [];
  favVehicleId: any[] = [];
  page: number = 1;
  limit: number;
  loading: boolean = true;
  getScreenWidth: any;
  paginationData: PaginationData = new PaginationData();
  isEnableNext: boolean = false;

  status = [{ statusId: 'PAST', statusName: 'Past' }, { statusId: 'IN_PROGRESS', statusName: 'In Progress' }]
  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth < 768) {
      this.limit = 10;
    } else {
      this.limit = 10;
    }
    this.getOrderList({ page: this.page, limit: this.limit })


  }

  selectTab(selectedTab: string) {
    this.selectedTab = selectedTab;
    this.getOrderList({ page: this.page, limit: this.limit })

  }

  jumpToThePage(page: number) {
    this.page = page;
    this.getOrderList({ page: this.page, limit: this.limit })

  }
  getOrderList(params: any) {
    this.loading = true;
    this.buyerOrderService.orderList(this.selectedTab, params).subscribe((resp: any) => {
      this.orderList = resp.data.items ? resp.data.items : [];
      this.paginationData = resp.data.pagination;
      if (this.paginationData.total_pages > 1) {
        this.isEnableNext = true;
      }
      this.loading = false;
      this.getFavouriteVehicle()
    })
  }

  getFavouriteVehicle() {
    this.favId = []
    this.favVehicleId = []
    this.buyerVehicleService.getFavouriteVehicle().subscribe((resp: any) => {
      if (resp.data.length > 0) {
        for (let i = 0; i < resp.data.length; i++) {
          this.favId.push(resp.data[i].id)
          this.favVehicleId.push(resp.data[i].favourite_vehicle_id)
        }
      }
    })
  }

  favVehicle(index: any) {
    if (this.favVehicleId.includes(this.orderList[index].vehicle_id)) {
      let i = this.favVehicleId.indexOf(this.orderList[index].vehicle_id)
      this.buyerVehicleService.deletFavouriteVehicle(this.favId[i]).subscribe((resp: any) => {
        if (resp.success_code === 'REMOVED_FAVOURITE_VEHICLE') {
          this.favVehicleId.splice(i, 1)
          this.favId.splice(i, 1);
        }
      })
    }
    else {
      this.buyerVehicleService.postFavouriteVehicle(this.orderList[index].vehicle_id).subscribe((resp: any) => {
        this.favVehicleId.push(this.orderList[index].vehicle_id)
        this.favId.push(resp.data.id)
      })
    }

  }


  continueOrder(orderId: string) {
    localStorage.setItem('current_order_id', orderId);
    this.router.navigate([`/user/buyer-orders/add-order/${orderId}`])
  }

  cancelOrder(orderId: string) {
    const modalRef = this.modalService.open(CancelOrderDialogComponent, {
      windowClass: 'cancel-order-modal',
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    })
    modalRef.componentInstance.orderId = orderId;
    modalRef.result.then((isCancel: boolean) => {
      if (isCancel) {
        const modalRef = this.modalService.open(SuccessfullComponent, {
          windowClass: 'success-modal'
        })
        modalRef.componentInstance.cancelOrderSuccess = true;
        const index = this.orderList.findIndex((x: any) => x.order_id == orderId);
        if(index > -1){
          this.orderList.splice(index, 1);
        }
      }
    }).catch((error: Error) => {
    });
  }

}
