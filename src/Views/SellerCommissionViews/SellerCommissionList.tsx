import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Table } from "../../Components/Table";
import { Button } from "../../Components/Button";
import { EditIcon, PlusIcon, TrashIcon } from "../../Components/Icons";
import { Link, useHistory } from "react-router-dom";
import { readPageQueryString } from "../../Services/Functions";
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { SellerCommissionDiscount } from "../../Models";

function AddNewButton() {
  const history = useHistory();
  return (
    <Button buttonMd textTiny color="text-blue-400"
            className="w-72" design="button-blue-100"
            text="Yeni İçerik Oluştur" hasIcon
            icon={<PlusIcon className="icon-sm mr-2"/>}
            onClick={() => history.push("/magaza-komisyon-orani-olustur")}/>
  );
}

function Header() {
  return (
    <div className=" lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
      <div className="lg:col-span-2 flex items-center">
          <span className="p-sm-gray-400">
            Mağaza
          </span>
      </div>
      <div className="lg:col-span-2 flex items-center">
          <span className="p-sm-gray-400">
            Komisyon İndirimi İsmi
          </span>
      </div>
      <div className="lg:col-span-2 flex items-center">
          <span className="p-sm-gray-400">
            Komisyon Zaman Aralığı
          </span>
      </div>
    </div>
  );
}

function ListItem(props: { sellerCommissionDiscount: SellerCommissionDiscount; sellerList: { [key: number]: string }; showDeleteModal: () => void; }) {
  const {sellerCommissionDiscount, sellerList, showDeleteModal} = props;
  return (
    <div className="lg:grid-cols-8 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center">
      <div className="lg:col-span-2 flex lg:block items-center">
        <p className="p-sm">
          {sellerList[sellerCommissionDiscount.SellerId]}
        </p>
      </div>
      <div className="lg:col-span-2 flex lg:block items-center">
        <p className="p-sm">
          {sellerCommissionDiscount.CommissionDiscountName || '-'}
        </p>
      </div>
      <div className="lg:col-span-2 flex lg:block items-center">
          <span className="w-1/3">
            {(new Date(sellerCommissionDiscount.StartDate)).toLocaleDateString('tr')}
          </span>
        <span className="w-1/3 ml-4">
            {(new Date(sellerCommissionDiscount.EndDate)).toLocaleDateString('tr')}
          </span>
      </div>
      <div className="lg:col-span-1"/>
      <div className="lg:col-span-1 flex justify-between items-center">
        <div className="text-gray-700 flex gap-2 items-center ml-auto">
          <Link to={{
            pathname: `/magaza-komisyon-orani-duzenle/${sellerCommissionDiscount.Id}`,
            state: {queryPage: Number(readPageQueryString(window.location) ?? "1")}
          }}>
            <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all"/>
          </Link>
          <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all "
                     onClick={showDeleteModal}/>
        </div>
      </div>
    </div>
  )
}

export function SellerCommissionList() {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);
  const tableEl = useRef<any>();

  const [sellerListMapped, setSellerListMapped] = useState<{ [key: number]: string }>([]);

  const fetchSellerCommissionList = useCallback(async (order: number, searchText: string, page: number, take: number) => {
    const response = await ApiService.getListSellerCommissionDiscount(page, take, searchText, order);

    if (response.succeeded && response.data) {
      return {Data: response.data.Data, TotalCount: response.data.TotalCount,};
    } else {
      return {Data: [], TotalCount: 0,};
    }
  }, []);

  const showDeleteModal = useCallback((item: SellerCommissionDiscount) => {
    context.showModal({
      type: "Question",
      title: "Bannerı Sil",
      message: `${item.CommissionDiscountName} isimli komisyonu silmek istediğinize emin misiniz?`,
      onClick: async () => {
        const response = await ApiService.deleteSellerCommission(item.Id);
        context.hideModal();

        if (response.succeeded) {
          context.showModal({
            type: "Success",
            title: "Mağaza Komisyon Oranı başarıyla silindi",
            onClose: () => {
              context.hideModal();
              if (tableEl.current) tableEl.current?.reload();
            }
          });
        } else {
          context.showModal({
            type: "Error",
            message: response.message,
            onClose: () => context.hideModal(),
          });
        }
        return true;
      },

      onClose: () => context.hideModal(),
    })
  }, []);

  const fetchSellerList = useCallback(async () => {
    const response = await ApiService.getSellerApprovedList(1, 9999, '', 1);
    if (response.succeeded) {
      return setSellerListMapped(response.data.Data
        .reduce((prev, cur) => ({...prev, [cur.Id]: cur.StoreName}), {}));
    }
    context.showModal({
      type: "Error",
      message: response.message,
      onClose: () => context.hideModal(),
    });
  }, []);

  useEffect(() => {
    fetchSellerList();
  }, []);

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Oluşturulan Mağaza Komisyon Oranları</h2>
        <Table
          ref={tableEl}
          emptyListText={"Mağaza Komisyon Oranı Bulunamadı"}
          getDataFunction={fetchSellerCommissionList}
          addNewButton={<AddNewButton/>}
          header={<Header/>}
          renderItem={(item, index) => (
            <ListItem
              sellerList={sellerListMapped}
              sellerCommissionDiscount={item}
              showDeleteModal={() => showDeleteModal(item)}
              key={`key_${index}`}/>
          )}
          page={Number(readPageQueryString(window.location) ?? "1")}
          setPageQueryString
        />
      </div>
    </div>
  );
}
