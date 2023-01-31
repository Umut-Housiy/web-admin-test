import React, { FunctionComponent, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useHistory } from "react-router-dom";
import { Button } from "../Components/Button";
import { EditIcon, PlusIcon, TrashIcon, UserIcon } from "../Components/Icons";
import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { formatter, fraction } from "../Services/Functions";
import { DiscountCouponModel, DiscountCouponUser } from "../Models";
import { Modal } from "../Components/Modal";
import { Dropdown } from "../Components/Dropdown";

type DiscountCouponUserListModalProps = {
  couponId: number;
  showModal: boolean;
  setShowModal: (bool: boolean) => void;
}

function DiscountCouponUserListModal(props: DiscountCouponUserListModalProps) {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);
  const tableRef = useRef<any>();

  const [userFilterOptions] = useState([
    {key: "1", value: "Tüm üyeler"},
    {key: "2", value: "Kullanmış"},
    {key: "3", value: "Kullanmamış"},
  ]);
  const [selectedUserFilterOption, setSelectedUserFilterOption] = useState<{ key: string; value: string }>(userFilterOptions[0]);

  const getDiscountCouponUserList = useCallback(async (order: number, searchText: string, page: number, take: number) => {
    const isUsed = selectedUserFilterOption.key === "1" ? null : (selectedUserFilterOption.key === "2");
    const response = await ApiService.getDiscountCouponUserList(page, take, props.couponId, isUsed);

    if (response.succeeded) {
      return {
        Data: response.data.Data,
        TotalCount: response.data.TotalCount
      }
    } else {
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => context.hideModal(),
      });
      return {Data: [], TotalCount: 0}
    }
  }, [selectedUserFilterOption, userFilterOptions, props.couponId]);

  useEffect(() => {
    tableRef.current?.reload();
  }, [selectedUserFilterOption]);

  return (
    <Modal
      modalType="fixedMd"
      showModal={props.showModal}
      onClose={() => props.setShowModal(false)}
      title={"Kupon Tanımlanmış Üyeler"}
      body={
        <Table
          ref={tableRef}
          emptyListText={"Tanımlanmış üye bulunamadı"}
          getDataFunction={getDiscountCouponUserList}
          addNewButton={<></>}
          header={
            <div className="lg:grid-cols-5 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
              <div className="lg:col-span-1 flex items-center">
                <span className="p-sm-gray-400">
                  İsim Soyisim
                </span>
              </div>
              <div className="lg:col-span-1 flex flex-row items-center">
                <span className="p-sm-gray-400">
                  Durum
                </span>
                <Dropdown
                  className="w-full text-black-700 text-sm border-gray-300 ml-4"
                  label={selectedUserFilterOption.value}
                  items={userFilterOptions}
                  onItemSelected={setSelectedUserFilterOption}
                />
              </div>
            </div>
          }
          renderItem={(item: DiscountCouponUser, index) => {
            return (
              <div key={`key_${index}`}
                   className="lg:grid-cols-5 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
                <div className="lg:col-span-1 flex items-center">
                  <p className="p-sm">
                    {item.NameSurname}
                  </p>
                </div>
                <div className="lg:col-span-1">
                  <p className={`p-sm ${!item.IsUsed ? "text-green-400" : "text-red-400"}`}>
                    {!item.IsUsed ? "Aktif" : "Pasif"}
                  </p>
                </div>
              </div>
            )
          }}
        />
      }
      footer={
        <Button className="w-full" design="button-blue-400" text="Kapat"
                onClick={() => props.setShowModal(false)}/>
      }
    />
  )
}

function DiscountCouponListAddNewButton() {
  const history = useHistory();
  return (
    <Button buttonMd textTiny color="text-blue-400" className="w-72"
            design="button-blue-100" text="Yeni İçerik Oluştur"
            hasIcon icon={<PlusIcon className="icon-sm mr-2"/>}
            onClick={() => history.push("/indirim-kuponu-duzenle")}/>
  );
}

function DiscountCouponListHeader() {
  return (
    <div className="lg:grid-cols-5 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
      <div className="lg:col-span-1 flex items-center">
        <span className="p-sm-gray-400">
          Kupon Kodu
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="p-sm-gray-400">
          Kupon Adı
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="p-sm-gray-400">
          Min. Tutar
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="p-sm-gray-400">
          Geçerlilik Tarihi
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="p-sm-gray-400">
          Kupon Bedeli
        </span>
      </div>
    </div>
  );
}

function DiscountCouponListRenderItem(props: { item: DiscountCouponModel; onDelete: () => void; onUserClick: () => void }) {
  const {item, onDelete, onUserClick} = props;
  const history = useHistory();

  const handleJsTime = useCallback((JsTime) => {
    return (new Date(JsTime)).toLocaleDateString() ?? "";
  }, [])

  return (
    <div className="lg:grid-cols-5 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
      <div className="lg:col-span-1 flex items-center">
        <p className="p-sm">
          {item.Code}
        </p>
      </div>
      <div className="lg:col-span-1">
        <p className="p-sm">
          {item.Title}
        </p>
      </div>
      <div className="lg:col-span-1">
        <p className="p-sm">
          {item.MinimumCartPrice % 1 === 0 ?
            <>{fraction.format(item.MinimumCartPrice)} TL </>
            :
            <>{formatter.format(item.MinimumCartPrice)} TL</>
          }
        </p>
      </div>
      <div className="lg:col-span-1">
        <p className="p-sm">
          {handleJsTime(item.StartDateJS) + " - " + handleJsTime(item.EndDateJS)}
        </p>
      </div>
      <div className="lg:col-span-1 flex justify-between">
        <p className="p-sm">
          {item.Discount % 1 === 0 ?
            <>{fraction.format(item.Discount)} TL </>
            :
            <>{formatter.format(item.Discount)} TL</>
          }
        </p>
        <div className="text-gray-700 flex gap-2 items-center">
          <UserIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={onUserClick}/>
          <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={() => {
            history.push(`/indirim-kuponu-duzenle/${item.Id}`);
          }}/>
          <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={onDelete}/>
        </div>
      </div>
    </div>
  );
}

export const DiscountCouponList: FunctionComponent = () => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);
  const tableEl = useRef<any>();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCouponId, setSelectedCouponId] = useState<number>(-1);

  const getDiscountCouponList = async (order: number, searchText: string, page: number, take: number) => {
    const response = await ApiService.getDiscountCouponList(page, take, searchText, order);

    if (response.succeeded) {
      return {
        Data: response.data.Data,
        TotalCount: response.data.TotalCount
      }
    } else {
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => context.hideModal(),
      });
      return {Data: [], TotalCount: 0}
    }
  }

  const removeDiscountCoupon = useCallback((item) => {
    context.showModal({
      type: "Question",
      title: "Kupon Sil",
      message: "İndirim kuponu silinecek. Emin misiniz?",
      onClick: async () => {
        const response = await ApiService.removeDiscountCoupon(item.Id);
        context.hideModal();

        if (response.succeeded) {
          context.showModal({
            type: "Success",
            title: "Kupon başarıyla silindi",
            onClose: () => {
              context.hideModal();
              if (tableEl.current) {
                tableEl.current?.reload();
              }
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
    });
  }, [context])

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">İndirim Kuponları</h2>
        <Table
          ref={tableEl}
          emptyListText={"Kupon Bulunamadı"}
          getDataFunction={getDiscountCouponList}
          addNewButton={<DiscountCouponListAddNewButton/>}
          header={<DiscountCouponListHeader/>}
          renderItem={(item: DiscountCouponModel, index) => {
            return (
              <DiscountCouponListRenderItem
                item={item}
                onDelete={() => removeDiscountCoupon(item)}
                onUserClick={() => {
                  setSelectedCouponId(item.Id);
                  setShowModal(true);
                }}
                key={`key_${index}`}
              />
            )
          }}
        />
      </div>
      <DiscountCouponUserListModal
        couponId={selectedCouponId}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </div>
  )
}
