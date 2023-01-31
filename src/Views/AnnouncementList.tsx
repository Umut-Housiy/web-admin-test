import { FunctionComponent, useContext, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Table } from "../Components/Table";
import { TabsTitle } from "../Components/TabsTitle";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { AnnouncementListInnerModel } from "../Models";
import { ChevronRightIcon, EditIcon, PlusIcon, TrashIcon } from "../Components/Icons";
import { Button } from "../Components/Button";

export const AnnouncementList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const sendedTableEl = useRef<any>();

  const waitingTableEl = useRef<any>();

  const tabsLink = [
    { id: 1, name: "Gönderilen Duyurular" },
    { id: 2, name: "Gönderilecek Duyurular" }
  ];

  const [selectedTabsId, setSelectedTabsId] = useState<number>(1);

  const getSendedAnnouncementList = async (order: number, searchText: string, page: number, take: number) => {
    const _result = await ApiService.getSendedAnnouncementList(page, take, searchText, order);

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

  const getWaitingAnnouncementList = async (order: number, searchText: string, page: number, take: number) => {
    const _result = await ApiService.getWaitingAnnouncementList(page, take, searchText, order);

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

  const showDeleteModal = (Id: number) => {
    context.showModal({
      type: "Question",
      title: "Duyuru Sil",
      message: "Duyuru silinecek. Emin misiniz?",
      onClick: async () => {
        const _result = await ApiService.deleteAnnouncement(Id);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Duyuru silindi",
            onClose: () => {
              context.hideModal();
              if (waitingTableEl.current) {
                waitingTableEl.current?.reload();
              }
              if (sendedTableEl.current) {
                sendedTableEl.current?.reload();
              }
            }
          });
        }
        else {
          context.showModal({
            type: "Error",
            message: _result.message,
            onClose: () => { context.hideModal(); }
          });
        }

        return true;
      },
      onClose: () => { context.hideModal(); },
    })
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Duyuru Listesi</h2>
        <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id); }} />
        {
          selectedTabsId === 1 ?
            <>
              <Table
                ref={sendedTableEl}
                key={"1"}
                emptyListText={"Duyuru Bulunamadı"}
                getDataFunction={getSendedAnnouncementList}
                addNewButton={
                  <Link className="w-72" to={{ pathname: `${"/duyuru-duzenle"}`, state: { isEditActive: true } }} >
                    <Button buttonMd textTiny color="text-blue-400" className="w-full" design="button-blue-100" text="Yeni Duyuru Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} />
                  </Link>
                }
                header={<div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                  <div className="lg:col-span-6">
                    <span className="p-sm-gray-400">
                      Duyuru Başlığı
                    </span>
                  </div>
                  <div className="lg:col-span-6">
                    <span className="p-sm-gray-400">
                      Duyuru İçeriği
                    </span>
                  </div>
                </div>}
                renderItem={(e: AnnouncementListInnerModel, i) => {
                  return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
                    <div className="lg:col-span-6 flex items-center">
                      <p className="p-sm">
                        {e.Title}
                      </p>
                    </div>
                    <div className="lg:col-span-6 flex items-center justify-between">
                      <p className="p-sm">
                        {e.Description}
                      </p>
                      <div className="text-gray-700 flex gap-2 items-center">
                        <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { showDeleteModal(e.AnnouncementId); }} />
                        <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400 cursor-pointer transition-all border-l pl-1" onClick={() => { history.push("/duyuru-duzenle/" + e.AnnouncementId); }} />
                      </div>
                    </div>
                  </div>
                }}
              />
            </>
            :
            selectedTabsId === 2 ?
              <>
                <Table
                  ref={waitingTableEl}
                  key={"2"}
                  emptyListText={"Duyuru Bulunamadı"}
                  getDataFunction={getWaitingAnnouncementList}
                  addNewButton={
                    <Link className="w-72" to={{ pathname: `${"/duyuru-duzenle"}`, state: { isEditActive: true } }} >
                      <Button buttonMd textTiny className="w-full" color="text-blue-400" design="button-blue-100" text="Yeni Duyuru Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} />
                    </Link>
                  }
                  header={<div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                    <div className="lg:col-span-6">
                      <span className="p-sm-gray-400">
                        Duyuru Başlığı
                      </span>
                    </div>
                    <div className="lg:col-span-6">
                      <span className="p-sm-gray-400">
                        Duyuru İçeriği
                      </span>
                    </div>
                  </div>}
                  renderItem={(e: AnnouncementListInnerModel, i) => {
                    return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
                      <div className="lg:col-span-6 flex items-center">
                        <p className="p-sm">
                          {e.Title}
                        </p>
                      </div>
                      <div className="lg:col-span-6 flex items-center justify-between">
                        <p className="p-sm">
                          {e.Description}
                        </p>
                        <div className="text-gray-700 flex gap-2 items-center">
                          <Link to={{ pathname: `${"/duyuru-duzenle/" + e.AnnouncementId}`, state: { isEditActive: true } }} >
                            <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { }} />
                          </Link>
                          <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { showDeleteModal(e.AnnouncementId); }} />
                          <Link to={{ pathname: `${"/duyuru-duzenle/" + e.AnnouncementId}`, state: { isEditActive: false } }} >
                            <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400 cursor-pointer transition-all border-l pl-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  }}
                />
              </>
              :
              <></>
        }
      </div>
    </div>
  )
}
