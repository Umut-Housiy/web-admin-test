import React, { FunctionComponent, useContext, useRef } from "react"
import { Link, useHistory } from "react-router-dom";

import { Button } from "../Components/Button";
import { EditIcon, PlusIcon, TrashIcon } from "../Components/Icons"
import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService"
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

export const AdminUsers: FunctionComponent = () => {
  const tableEl = useRef<any>();

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const userTypeOptions = [
    { key: "1", value: "Admin" },
  ]

  const getAdminUsersList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getAdminUsersList(page, take);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
      return {
        Data: [],
        TotalCount: 0
      }
    }
  }

  const showDeleteModal = (item) => {
    context.showModal({
      type: "Question",
      title: "Admin sil",
      message: `${item.Username} isimli admin kullanıcısını silmek istediğinize emin misiniz?`,
      onClick: async () => {

        const _result = await ApiService.removeAdmin(item.Id);

        context.hideModal();

        if (_result.succeeded === true) {
          if (tableEl.current) {
            tableEl.current?.reload();
          }
        }
        else {
          context.showModal({
            type: "Error",
            message: _result.message,
            onClose: () => { context.hideModal(); }
          });
        }
        return true
      },
      onClose: () => { context.hideModal(); },
    })
  }


  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Admin Kullanıcıları</h2>
        <Table
          ref={tableEl}
          emptyListText={"Admin Bulunamadı"}
          getDataFunction={getAdminUsersList}
          addNewButton={
            <Button buttonMd textTiny color="text-blue-400" className="w-72 mr-3 px-3 my-3" design="button-blue-100" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} text="Yeni Oluştur" onClick={() => history.push('/admin-kullanici-ekle')} />
          }
          header={<div className=" lg:grid-cols-11 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-2">
              <span className="text-sm font-medium text-gray-400">
                Kullanıcı Adı
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="text-sm font-medium text-gray-400">
                E-posta
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="text-sm font-medium text-gray-400">
                Kullanıcı Rolü
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="text-sm font-medium text-gray-400">
                Eklenme Tarihi
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="text-sm font-medium text-gray-400">
                Değişiklik Tarihi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="text-sm font-medium text-gray-400">
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div className="lg:grid-cols-11 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center" key={i}>
              <div className="lg:col-span-2">
                <span className="text-sm font-medium text-gray-500">
                  {e.Username}
                </span>
              </div>
              <div className="lg:col-span-2">
                <p className="p-sm">
                  {e.Email}
                </p>
              </div>
              <div className="lg:col-span-2">
                <p className="p-sm">
                  {userTypeOptions.find(i => i.key === String(e.UserType))?.value ?? ""}
                </p>
              </div>
              <div className="lg:col-span-2">
                <p className="p-sm">
                  {e.CreatedDate}
                </p>
              </div>
              <div className="lg:col-span-3 flex justify-between">
                <p className="p-sm">
                  {e.UpdateDate !== "" ? e.UpdateDate : "-"}
                </p>
                <div className="flex text-gray-700">
                  <Link className="mx-1 cursor-pointer" to={`/admin-kullanicisi/${e.Id}`}>
                    <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" />
                  </Link>
                  <div className="mx-1 cursor-pointer" onClick={() => showDeleteModal(e)}>
                    <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" />
                  </div>
                </div>
              </div>
            </div>
          }}
          noSortOptions
          noSearchBar
          noRefreshButton
        />
      </div>
    </div>
  )
}
