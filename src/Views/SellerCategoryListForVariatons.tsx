import { FunctionComponent, useRef } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ChevronRightIcon, EditIcon, SubListIcon } from "../Components/Icons";
import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService";
import { Image } from "../Components/Image";
import { readPageQueryString } from "../Services/Functions";

interface RouteParams {
  id: string
}

interface LocationModel {
  prevTitle?: string
}

export const SellerCategoryListForVariations: FunctionComponent = () => {
  const params = useParams<RouteParams>();

  const location = useLocation<LocationModel>();

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Sıraya göre azalan" },
    { key: "4", value: "Sıraya göre artan" }
  ];

  const tableEl = useRef<any>();

  const getSellerCategoryListForVariations = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerCategoryListForVariations(Number(params.id), page, take, searchText, order);

    if (_result.succeeded === true) {
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

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        {(location.state?.prevTitle) ?
          <div onClick={() => { window.history.back(); }} className="inline-block mb-5 cursor-pointer">
            <div className="flex items-center text-sm text-gray-400 ">
              <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
              {location.state?.prevTitle ?? ""}
            </div>
          </div>
          :
          <></>
        }
        <h2 className="mb-5">Varyasyonun Kullanıldığı Kategori Listesi</h2>
        <Table
          ref={tableEl}
          emptyListText={"Veri Bulunamadı"}
          getDataFunction={getSellerCategoryListForVariations}
          header={<div className=" lg:grid-cols-10 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-2 flex items-center">
              <span className="p-sm-gray-400">
                Kategori Görseli
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Kategori Adı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Kategori Kodu
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Üst Kategori
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Kategori Sırası
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Kategori Komisyonu
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Durum
              </span>
            </div>

          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-10 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Kategori Görseli:</span>
                <Image src={e.PhotoPath} alt={e.CategoryName} className="w-14 h-14 object-contain" />
              </div>
              <div className="lg:col-span-2 flex lg:block items-center flex items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Kategori Adı:</span>
                <p className="p-sm">
                  {e.CategoryName}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Kategori Kodu:</span>
                <p className="p-sm">
                  {e.CategoryCode}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Üst Kategori:</span>
                <p className="p-sm">
                  {e.ParentName}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Kategori Sırası:</span>
                <p className="p-sm">
                  {e.CategoryOrder}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Kategori Komisyonu:</span>
                <p className="p-sm">
                  %{e.CommissionPercentage}
                </p>
              </div>
              <div className="lg:col-span-2 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2">Durum: </span>
                  <p className={`${e.CategoryStatus === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
                    {e.CategoryStatus === true ? "Aktif" : "Pasif"}
                  </p>
                </div>
                <div className="text-gray-700 flex gap-2 items-center">
                  {e.SubCategoryCount > 0 ?
                    <Link to={{ pathname: `/satici-alt-kategori-listesi/${e.Id}`, state: {} }} >
                      <SubListIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all mx-1" />
                    </Link>
                    :
                    <></>
                  }
                  <Link to={{ pathname: `${"/satici-kategori-bilgileri-detay/" + e.Id}`, state: { isEditActive: true } }} >
                    <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" />
                  </Link>
                  <Link to={{ pathname: `${"/satici-kategori-bilgileri-detay/" + e.Id}`, state: { isEditActive: false } }} >
                    <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400   cursor-pointer transition-all border-l pl-1" />
                  </Link>
                </div>
              </div>
            </div>
          }}
          sortOptions={sortOptions}
          page={Number(readPageQueryString(window.location) ?? "1")}
          setPageQueryString
        />
      </div>
    </div>
  )
}
