import React, { FunctionComponent, useContext, useRef, useState } from "react"
import { Link, useHistory, useLocation } from "react-router-dom";
import { DateView } from "../Components/DateView";
import { ChevronRightIcon } from "../Components/Icons";
import { Table } from "../Components/Table";
import { ProModel } from "../Models";
import ApiService from "../Services/ApiService";
import { currentDateStampForCompare, readPageQueryString } from "../Services/Functions";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";


export const ProProfessionalMemberList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const getMemberList = async (order: number, searchText: string, page: number, take: number) => {
    const _result = await ApiService.getProMemberList(page, take, order, searchText);

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
        <h2 className="mb-5">Profesyonel Üyelik Listesi</h2>
        <Table
          ref={tableEl}
          emptyListText={"Profesyonel Bulunamadı"}
          getDataFunction={getMemberList}
          header={<div className=" lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Şirket Adı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Üyelik Tipi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Başlangıç Tarihi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Yenileme Tarihi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Teklif Sayısı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Favori Eklenme Sayısı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Tamamlanan Hizmet Sayısı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Üyelik Durumu
              </span>
            </div>
          </div>}
          renderItem={(e: ProModel, i) => {
            return <div key={"list" + i} className="lg:grid-cols-8 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.StoreName}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.PackageName}
                </p>
              </div>
              <div className="lg:col-span-1">
                {e.CreatedDateJSTime > 0 ?
                  <DateView className="p-sm" dateNumber={e.CreatedDateJSTime} pattern="dd/MM/yyyy" />
                  :
                  "-"
                }
              </div>
              <div className="lg:col-span-1">
                {e.PackageRefreshDate > 0 ?
                  <DateView className="p-sm" dateNumber={e.PackageRefreshDate} pattern="dd/MM/yyyy" />
                  :
                  "-"
                }
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.OfferCount}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.FavoriteCount}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.ServiceCount}
                </p>
              </div>
              <div className="lg:col-span-1 flex justify-between">
                {(e.PackageExpirationDate > 0 && e.PackageExpirationDate > currentDateStampForCompare()) ?
                  <span className="text-sm font-medium text-green-400">
                    Devam Ediyor
                  </span>
                  :
                  <span className="text-sm font-medium text-gray-400">
                    Süresi Doldu
                  </span>
                }
                <div className="ml-auto text-gray-700 flex gap-2 items-center">
                  <Link to={{ pathname: `${"/pro-profesyonel-detay/" + e.Id}`, state: { prevTitle: "Profesyonel Listesi", queryPage: Number(readPageQueryString(window.location) ?? "1"), prevPath: window.location.pathname, tabId: 1 } }} >
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
