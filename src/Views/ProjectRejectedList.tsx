import { FunctionComponent, useContext, useRef } from "react"
import { Link, useHistory } from "react-router-dom";
import { ChevronRightIcon } from "../Components/Icons";
import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService";
import { readPageQueryString } from "../Services/Functions";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

export const ProjectRejectedList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const getProjectList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProjectList(page, take, searchText, order, 3);

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
  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Reddedilen Proje Listesi</h2>
        <Table
          ref={tableEl}
          emptyListText={"Proje Bulunamadı"}
          getDataFunction={getProjectList}
          header={<div className=" lg:grid-cols-6 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Proje Adı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Kategori
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Ekleyen Profesyonel
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Oluşturulma Tarihi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Kullanılan Ürün Sayısı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Durum
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-6 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.Name}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.CategoryName}
                </p>
              </div>
              <div className="lg:col-span-1">
                <Link to={{ pathname: `${"/pro-profesyonel-detay/" + e.ProId}`, state: { prevTitle: "Profesyonel Listesi", prevPath: "/pro-profesyonel-listesi", tabId: 1 } }} >
                  <p className="text-sm text-blue-400 leading-5 font-medium underline">
                    {e.StoreName}
                  </p>
                </Link>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.CreatedDate}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.ProductCount}
                </p>
              </div>
              <div className="lg:col-span-1 flex justify-between">
                <div className="rounded-full w-36 py-1 bg-gray-100 text-gray-600 text-sm text-center my-auto">Reddedildi</div>
                <div className="text-gray-700 flex gap-2 items-center">
                  <Link to={{ pathname: `${"/proje-detay/" + e.Id}`, state: { prevTitle: "Reddedilen Projeler", prevPath: window.location.pathname, tabId: 1, IsIdeaApproved: false, queryPage: Number(readPageQueryString(window.location) ?? "1") } }} >
                    <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400   cursor-pointer transition-all border-l pl-1" />
                  </Link>
                </div>
              </div>
            </div>
          }}
          page={Number(readPageQueryString(window.location) ?? "1")}
          setPageQueryString
        />
      </div>
    </div>
  )
}
