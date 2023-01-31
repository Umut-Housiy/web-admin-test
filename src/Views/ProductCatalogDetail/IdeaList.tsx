import { FunctionComponent, useContext, useRef } from "react"
import { Link, useHistory } from "react-router-dom";
import { ChevronRightIcon } from "../../Components/Icons";
import { Table } from "../../Components/Table";
import { ProjectModel } from "../../Models";
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";

export interface IdeaListPropModel {
  productId: number
}

export const IdeaList: FunctionComponent<IdeaListPropModel> = (props: IdeaListPropModel) => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const getProjectListForProduct = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProjectListForProduct(props.productId, page, take, searchText, order);

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

  const handleJsDate = (JsTime) => {
    try {
      var time = new Date(JsTime);
      return time.toLocaleDateString() ?? "";
    }
    catch {
      return ""
    }
  }

  return (
    <>
      <Table
        ref={tableEl}
        emptyListText={"Proje Bulunamadı"}
        getDataFunction={getProjectListForProduct}
        header={
          <div className=" lg:grid-cols-10 px-2 border-b border-t py-6 border-gray-200 hidden lg:grid gap-4 flex items-center">
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Fikir ID
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Fikir Adı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Kategori
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Ekleyen Profesyonel
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Oluşturulma Tarihi
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Kullanılan Ürün Sayısı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center gap-1">
              <span className="p-sm-gray-400">
                Gelen Soru Sayısı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Görüntülenme Sayısı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Favoriye Eklenme Sayısı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center gap-1">
              <span className="p-sm-gray-400">
                Durum
              </span>
            </div>
          </div>
        }
        renderItem={(e: ProjectModel, i) => {
          return (
            <div key={"list" + i} className="lg:grid-cols-11 px-2 border-b  border-gray-200 grid gap-4 items-center py-6 ">
              <div className="lg:col-span-2 flex items-center gap-2">
                <p className="p-sm">
                  {e.Id}
                </p>
              </div>
              <div className="lg:col-span-1 flex gap-2 text-sm font-medium text-yellow-600  items-center">
                <p className="p-sm">
                  {e.Name}
                </p>
              </div>
              <div className="lg:col-span-1  items-center">
                <p className="p-sm">
                  {e.CategoryName}
                </p>
              </div>
              <div className="lg:col-span-1  items-center">
                <p className="text-sm text-blue-400 underline font-medium cursor-pointer" onClick={() => { history.push("/pro-profesyonel-detay/" + e.ProId); }}>
                  {e.StoreName}
                </p>
              </div>
              <div className="lg:col-span-1  items-center">
                <p className="p-sm">
                  {handleJsDate(e.CreatedDateJSTime)}
                </p>
              </div>
              <div className="lg:col-span-1  items-center">
                <p className="p-sm">
                  {e.ProductCount}
                </p>
              </div>
              <div className="lg:col-span-1  items-center">
                <p className="p-sm">
                  {e.ProductCount}
                </p>
              </div>
              <div className="lg:col-span-1  items-center">
                <p className="p-sm">
                  {e.ViewCount}
                </p>
              </div>
              <div className="lg:col-span-1  items-center">
                <p className="p-sm">
                  {e.FavoriteCount}
                </p>
              </div>
              <div className="lg:col-span-1  flex items-center">
                <div className="flex items-center w-full justify-between">
                  {
                    e.IsEnabled ?
                      <p className="text-sm font-medium text-green-400">Aktif</p>
                      :
                      <p className="text-sm font-medium text-red-400">Pasif</p>
                  }
                  <Link className="hover:text-blue-400 text-gray-700 cursor-pointer transition-all" to={{ pathname: `${"/proje-detay/" + e.Id}`, state: { IsIdeaApproved: e.IsIdeaApproved } }} >
                    <ChevronRightIcon className="icon-md" />
                  </Link>
                </div>
              </div>
            </div>
          )
        }}
      />
    </>
  )
}
