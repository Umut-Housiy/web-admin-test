import { FunctionComponent, useContext, useRef, useState } from "react";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import { CategorySelectSeller } from "../Components/CategorySelectSeller";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Button } from "../Components/Button";
import { Image } from "../Components/Image";
import { Link, useLocation, useParams } from "react-router-dom";
import { ChevronRightIcon, EditIcon, SubListIcon, TrashIcon } from "../Components/Icons";
import ApiService from "../Services/ApiService";
import { Table } from "../Components/Table";
import { EmptyList } from "../Components/EmptyList";
import { useStateEffect } from "../Components/UseStateEffect";

interface RouteParams {
  id: string
}

interface LocationModel {
  prevPath?: string,
  prevTitle?: string
}

export const SellerSubCategoryList: FunctionComponent = () => {
  const params = useParams<RouteParams>();

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const location = useLocation<LocationModel>();

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Sıraya göre azalan" },
    { key: "4", value: "Sıraya göre artan" },
  ]

  const [loading, setLoading] = useState<boolean>(false);

  const [categoryId, setCategoryId] = useState<number>(0);

  const [categoryTempId, setCategoryTempId] = useState<number>(0);

  const [categoryDisplaytext, setCategoryDisplaytext] = useState<string>("");

  const tableEl = useRef<any>();

  const handleShowQuesionModal = (item) => {
    context.showModal({
      type: "Question",
      title: "Kategori Sil",
      message: `${item.CategoryName} isimli kategoriyi silmek istediğinize emin misiniz?`,
      onClick: async () => {

        const _result = await ApiService.removeSellerCategory(item.Id);

        context.hideModal();

        if (_result.succeeded === true) {

          context.showModal({
            type: "Success",
            title: "Kategori başarıyla silindi",
            onClose: () => {
              context.hideModal();
              if (tableEl.current) {
                tableEl.current?.reload();
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


  useStateEffect(() => {
    tableEl?.current?.reload();
  }, [categoryId, Number(params.id)])

  const getSellerSubCategoryList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerSubCategoryList(Number(params.id) > 0 ? Number(params.id) : categoryId, page, take, searchText, order);

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

  const returnHeader = () => {
    return <div className=" lg:grid-cols-10 px-2 border-b border-t py-5 border-gray-200 flex items-start hidden lg:grid gap-4">
      <div className="lg:col-span-1 flex items-center">
        <span className="p-sm-gray-400">
          Kategori Görseli
        </span>
      </div>
      <div className="lg:col-span-3">
        <span className="p-sm-gray-400">
          Kategori Adı
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="p-sm-gray-400">
          Kategori Tipi
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="p-sm-gray-400">
          Bağlı Alt Kategori Sayısı
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="p-sm-gray-400">
          Kategori Kodu
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="p-sm-gray-400">
          Kategori Sırası
        </span>
      </div>
      <div className="lg:col-span-2">
        <span className="p-sm-gray-400">
          Durum
        </span>
      </div>
    </div>
  }
  return (
    <div className="content-wrapper">
      <div className="flex flex-col gap-6">
        {Number(params.id) > 0 ? <></> :
          <div className="portlet-wrapper">
            <h2 className="pb-5 border-b mb-5">Alt Kategori Listesi</h2>
            <div className="w-1/2">
              <Label title="Kategori Seçimi" isRequired withoutDots />
              {loading ?
                <Loading inputSm />
                :
                <div className="flex items-center w-full gap-x-2">
                  <div className="flex-1">
                    <CategorySelectSeller value={categoryTempId} onChange={setCategoryTempId} setCategoryDisplayText={setCategoryDisplaytext} />
                  </div>
                  <Button buttonMd text="Seçimi Uygula" design="button-blue-400 w-32 mb-4" onClick={() => { setCategoryId(categoryTempId) }} />
                </div>
              }
            </div>
          </div>
        }
        <div className="portlet-wrapper">
          {(location.state?.prevPath && location.state?.prevTitle) &&
            <div onClick={() => { window.history.back(); }} className="inline-block mb-5 cursor-pointer">
              <div className="flex items-center text-sm text-gray-400 ">
                <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
                {location.state?.prevTitle ?? ""}
              </div>
            </div>
          }
          {Number(params.id) > 0 && <h2 className="pb-5">Kategoriye Bağlı Alt Kategori Listesi</h2>}
          {(!(Number(params.id) > 0) && categoryId === 0) ?
            <>
              {returnHeader()}
              <EmptyList text="Veri Bulunamadı" />
            </>
            :
            <Table
              ref={tableEl}
              emptyListText={"Veri Bulunamadı"}
              getDataFunction={getSellerSubCategoryList}
              header={returnHeader()}
              renderItem={(e, i) => {
                return <div key={"list" + i} className="lg:grid-cols-10 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
                  <div className="lg:col-span-1 flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Kategori Görseli:</span>
                    <Image src={e.PhotoPath} alt={e.CategoryName} className="w-14 h-14 object-contain" />
                  </div>
                  <div className="lg:col-span-3 flex lg:block items-center flex items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Kategori Adı:</span>
                    <p className="p-sm">
                      {e.CategoryName}
                    </p>
                  </div>
                  <div className="lg:col-span-1 flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Kategori Tipi:</span>
                    <p className="p-sm">
                      {(e.ParentCategory && e.ParentCategory > 0) ? "Alt Kategori" : "Üst Kategori"}
                    </p>
                  </div>
                  <div className="lg:col-span-1 flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Bağlı Alt Kategori Sayısı:</span>
                    <p className="p-sm">
                      {e.SubCategoryCount}
                    </p>
                  </div>
                  <div className="lg:col-span-1 flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Kategori Kodu:</span>
                    <p className="p-sm">
                      {e.CategoryCode}
                    </p>
                  </div>
                  <div className="lg:col-span-1 flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Kategori Sırası:</span>
                    <p className="p-sm">
                      {e.CategoryOrder}
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
                      {e.SubCategoryCount > 0 &&
                        <Link to={{ pathname: `/satici-alt-kategori-listesi/${e.Id}`, state: { prevTitle: "Kategoriye Bağlı Alt Kategori Listesi", prevPath: window.location.pathname } }} >
                          <SubListIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all  mx-1" />
                        </Link>
                      }
                      <Link to={{ pathname: `${"/satici-kategori-bilgileri-detay/" + e.Id}`, state: { isEditActive: true } }} >
                        <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" />
                      </Link>
                      <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => handleShowQuesionModal(e)} />
                      <Link to={{ pathname: `${"/satici-kategori-bilgileri-detay/" + e.Id}`, state: { isEditActive: false } }} >
                        <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400 cursor-pointer transition-all border-l pl-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              }}
              sortOptions={sortOptions}
            />
          }
        </div>
      </div>
    </div>

  )
}
