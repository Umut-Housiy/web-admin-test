import { FunctionComponent, useRef, useState } from "react";
import { OrderListRow } from "../Components/OrderListRow";
import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService";

export const DelayedOrderList: FunctionComponent = () => {

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Sipariş Tutarı Azalan" },
    { key: "4", value: "Sipariş Tutarı Artan" },
  ];

  const tableOrderList = useRef<any>();

  const getOrderList = async (order: number, searchText: string, page: number, take: number) => {

    //TODO:Geciken Siparislerim listesi gelecek

    // const _result = await ApiService.getOrderList(page, take, searchText, order);

    // if (_result.succeeded === true) {
    //   return {
    //     Data: _result.data.Data,
    //     TotalCount: _result.data.TotalCount
    //   }
    // }
    // else {
    //   return {
    //     Data: [],
    //     TotalCount: 0
    //   }
    // }
    return {
      Data: [],
      TotalCount: 0
    }

  }

  const returnHeader = () => {
    return <div className="lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-2">
      <div className="lg:col-span-1 flex items-center">
        <span className="text-sm text-gray-700 font-medium">
          Sipariş Bilgileri
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="text-sm text-gray-700 font-medium">
          Satıcı Bilgileri
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="text-sm text-gray-700 font-medium">
          Ürün Bilgileri
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="text-sm text-gray-700 font-medium">
          Alıcı Bilgileri
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="text-sm text-gray-700 font-medium">
          Satış Tutarı
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="text-sm text-gray-700 font-medium">
          Son Gönderim Tarihi
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="text-sm text-gray-700 font-medium ">
          Kargo Bilgileri
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="text-sm text-gray-700 font-medium ">
          Sipariş Durumu
        </span>
      </div>
    </div>
  }


  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-7">Sipariş Listesi</h2>
        <Table
          ref={tableOrderList}
          key="1"
          emptyListText={"Liste Bulunamadı"}
          getDataFunction={getOrderList}
          header={returnHeader()}
          renderItem={(e, i) => {
            return <OrderListRow item={e} key={"orderList" + i} />
          }}
          sortOptions={sortOptions}
        />
      </div>
    </div>
  )
}
