import { FunctionComponent, useRef, useState } from "react";
import { OrderListRow } from "../Components/OrderListRow";
import { Table } from "../Components/Table";
import { TabsTitle } from "../Components/TabsTitle";
import ApiService from "../Services/ApiService";

export const CanceledOrderList: FunctionComponent = () => {
  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Sipariş Tutarı Azalan" },
    { key: "4", value: "Sipariş Tutarı Artan" },
  ];

  const [selectedTabsId, setSelectedTabsId] = useState<number>(1);

  const [canceledOrderListCountBySeller, setCanceledOrderListCountBySeller] = useState<number>(0);

  const [canceledOrderListCountByUser, setCanceledOrderListCountByUser] = useState<number>(0);

  const tabsLink = [
    { id: 1, name: `Satıcı İptalleri (${canceledOrderListCountBySeller})` },
    { id: 2, name: `Müşteri İptalleri (${canceledOrderListCountByUser})` },
  ];

  //TABS-1 WAITING APPROVAL TABS START

  const tableCanceledOrderListBySeller = useRef<any>();

  const getCanceledOrderListBySeller = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getCanceledOrderListBySeller(page, take, searchText, order);

    if (_result.succeeded === true) {
      setCanceledOrderListCountBySeller(_result.data.CanceledBySellerOrderCount);
      setCanceledOrderListCountByUser(_result.data.CanceledByUserOrderCount);
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      return {
        Data: [],
        TotalCount: 0
      }
    }
  }

  //TABS-2 READY FOR SHIPPING TABS START
  const tableCanceledOrderListByUser = useRef<any>();

  const getCanceledOrderListByUser = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getCanceledOrderListByUser(page, take, searchText, order);

    if (_result.succeeded === true) {
      setCanceledOrderListCountBySeller(_result.data.CanceledBySellerOrderCount);
      setCanceledOrderListCountByUser(_result.data.CanceledByUserOrderCount);
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      return {
        Data: [],
        TotalCount: 0
      }
    }
  }

  const returnHeaderForCanceledBySeller = () => {
    return <div className="lg:grid-cols-7 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
      <div className="lg:col-span-1 flex items-center">
        <span className="text-sm text-gray-700 font-medium">
          İptal Tarihi
        </span>
      </div>
      <div className="lg:col-span-1 flex items-center">
        <span className="text-sm text-gray-700 font-medium">
          Sipariş Bilgileri
        </span>
      </div>
      <div className="lg:col-span-1 flex items-center">
        <span className="text-sm text-gray-700 font-medium">
          Satıcı Bilgileri
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="text-sm text-gray-700 font-medium">
          Ürün Bilgisi
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="text-sm text-gray-700 font-medium">
          Alıcı Bilgileri
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="text-sm text-gray-700 font-medium">
          İptal Edilen Satış Tutarı
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="text-sm text-gray-700 font-medium ">
          Durum
        </span>
      </div>
    </div>
  }

  const returnHeaderForCanceledByUser = () => {
    return <div className="lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
      <div className="lg:col-span-1 flex items-center">
        <span className="text-sm text-gray-700 font-medium">
          İptal Tarihi
        </span>
      </div>
      <div className="lg:col-span-1 flex items-center">
        <span className="text-sm text-gray-700 font-medium">
          Sipariş Bilgileri
        </span>
      </div>
      <div className="lg:col-span-1 flex items-center">
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
          İptal Edilen Satış Tutarı
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="text-sm text-gray-700 font-medium ">
          İptal Nedeni
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="text-sm text-gray-700 font-medium  ">
          Durum
        </span>
      </div>
    </div>
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-7">Sipariş Listesi</h2>
        <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id) }} />
        {selectedTabsId === 1 ?
          <Table
            ref={tableCanceledOrderListBySeller}
            key="1"
            emptyListText={"Liste Bulunamadı"}
            getDataFunction={getCanceledOrderListBySeller}
            header={returnHeaderForCanceledBySeller()}
            renderItem={(e, i) => {
              return <OrderListRow onCanceledListBySeller item={e} key={"canceledOrderListBySeller" + i} />
            }}
            sortOptions={sortOptions}
          />
          : selectedTabsId === 2 &&
          <Table
            ref={tableCanceledOrderListByUser}
            key="2"
            emptyListText={"Liste Bulunamadı"}
            getDataFunction={getCanceledOrderListByUser}
            header={returnHeaderForCanceledByUser()}
            renderItem={(e, i) => {
              return <OrderListRow onCanceledListByUser item={e} key={"canceledOrderListByUser" + i} />
            }}
            sortOptions={sortOptions}
          />
        }
      </div>
    </div>
  )
}
