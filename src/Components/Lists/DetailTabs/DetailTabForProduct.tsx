import { FunctionComponent, useContext, useRef, useState } from "react"
import { useHistory } from "react-router-dom";
import { DynamicListAdvertModel } from "../../../Models";
import ApiService from "../../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../../Services/SharedContext";
import { Button } from "../../Button";
import { CheckIcon, ChevronRightIcon, PlusIcon, StarIcon, TrashIcon } from "../../Icons";
import { Table } from "../../Table";
import { Image } from "../../Image";
import { formatter, fraction } from "../../../Services/Functions";
import { DateView } from "../../DateView";
import { Modal } from "../../Modal";
import { AdvertSearchFilterBar } from "../../AdvertSearchFilterBar";

export interface DetailTabForProductProps {
  DynamicListId: number
}

export const DetailTabForProduct: FunctionComponent<DetailTabForProductProps> = (props: DetailTabForProductProps) => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const tableElModal = useRef<any>();

  const history = useHistory();

  const [showAddingModal, setShowAddingModal] = useState<boolean>(false);

  const [selectedItemIdList, setSelectedItemIdList] = useState<number[]>([])

  const [selectedTempItemIdList, setSelectedTempItemIdList] = useState<number[]>([]);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const sortOptions = [
    { key: "3", value: "Yeniden Eskiye" },
    { key: "4", value: "Eskiden Yeniye" },
    { key: "1", value: "Fiyat Artan" },
    { key: "2", value: "Fiyat Azalan" }
  ]

  //#region filters start
  const [categoryName, setCategoryName] = useState<string>("");

  const [minPrice, setMinPrice] = useState<string>("0");

  const [maxPrice, setMaxPrice] = useState<string>("0");

  const [minDiscountRate, setMinDiscountRate] = useState<string>("0");

  const [maxDiscountRate, setMaxDiscountRate] = useState<string>("0");

  //#endregion fiters end

  const getDynamicListItems = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getDynamicListItems(props.DynamicListId, page, take, searchText, order);

    if (_result.succeeded === true) {
      let _tempArray: DynamicListAdvertModel[] = []
      let _selectedItemIdList: number[] = []
      _result.data.Data.map((item) => (
        _tempArray.push(item.Advert),
        _selectedItemIdList.push(item.Advert.AdvertId)
      ))
      setSelectedItemIdList(_selectedItemIdList)

      return {
        Data: _tempArray,
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

  const showDeleteModal = (item) => {
    context.showModal({
      type: "Question",
      title: "Ürün Sil",
      message: `${item.ProductName} isimli ürünü listeden silmek istediğinize emin misiniz?`,
      onClick: async () => {
        const _result = await ApiService.deleteItemFromDynamicList(item.ItemId);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Ürün başarıyla silindi",
            onClose: () => {
              context.hideModal();
              if (tableEl.current) {
                tableEl.current?.reload();
              }
              setSelectedTempItemIdList([])
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

  const searchAvertForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.searchAvertForAdmin(searchText, page, take, order, categoryName, "", minPrice, maxPrice, minDiscountRate, maxDiscountRate, [], []);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      setShowAddingModal(false);
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


  const addItemToDynamicList = async () => {
    setProcessLoading(true);

    const _result = await ApiService.addItemToDynamicList(props.DynamicListId, selectedTempItemIdList, [])

    setShowAddingModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Ürün(ler) başarıyla eklendi",
        onClose: () => {
          context.hideModal();
          setProcessLoading(false);
          if (tableEl.current) {
            tableEl.current?.reload();
          }
          setSelectedTempItemIdList([]);
          clearFilter();
        }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal(); setProcessLoading(false);
        }
      });
    }
  }

  const returnHeader = () => {
    return <div className="lg:grid-cols-11 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
      <div className="lg:col-span-3">
        <span className="p-sm-gray-400">
          Ürün Adı
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="p-sm-gray-400">
          Stok Adedi
        </span>
      </div>
      <div className="lg:col-span-2">
        <span className="p-sm-gray-400">
          Ürün Kategorisi
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="p-sm-gray-400">
          Satış Fiyatı
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="p-sm-gray-400">
          Ürün Puanı
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="p-sm-gray-400">
          Durum
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="p-sm-gray-400"> </span>
      </div>
    </div>
  }

  const returnBody = (e) => {
    return <>
      <div className="lg:col-span-3 flex lg:block items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Ürün Adı:</span>
        <div className="flex items-center w-full">
          <Image src={e.mainPhoto} className="min-w-14 max-w-14 max-h-14 min-h-14 mr-2 object-contain  " />
          <div className="">
            <p className="p-sm line-clamp-2">{e.productName}</p>
            <p className="text-black-700 text-sm">Barkod No: <span className="font-medium">{e.barcodeNo}</span></p>
          </div>
        </div>

      </div>
      <div className="lg:col-span-1 flex lg:block items-center flex items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Stok Adedi:</span>
        <p className="text-black-700 text-sm">
          {e.stockCount}
        </p>
      </div>
      <div className="lg:col-span-2 flex lg:block items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Ürün Kategorisi:</span>
        <p className="text-black-700 text-sm">
          {e.category.join(" > ")}
        </p>
      </div>
      <div className="lg:col-span-1 flex lg:block items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Satış Fiyatı:</span>
        <p className="text-sm font-medium text-black-400">
          {
            (e.discountedPrice && e.discountedPrice > 0) ?
              <div className="text-tiny text-black-400 font-medium text-sm">
                {e.discountedPrice % 1 === 0 ?
                  <>{fraction.format(e.discountedPrice ?? 0)} TL </>
                  :
                  <>{formatter.format(e.discountedPrice ?? 0)} TL</>
                }
              </div>
              :
              <div className="flex items-center gap-x-1 mt-1">
                <div className="text-tiny text-black-400 font-medium text-sm">
                  {e.price % 1 === 0 ?
                    <>{fraction.format(e.price)} TL </>
                    :
                    <>{formatter.format(e.price)} TL</>
                  }
                </div>
              </div>
          }
        </p>
      </div>
      <div className="lg:col-span-1 flex lg:block items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Ürün Puanı:</span>
        <div className="flex items-center font-semibold gap-2 text-yellow-600 text-sm">
          <StarIcon className="w-4 h-4 mr-2" />
          <span className="text-yellow-600">{e.rate}</span>
        </div>
      </div>
      <div className="lg:col-span-2 flex lg:block items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Durum:</span>
        <p className={`${e.isEnabled === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
          {e.isEnabled === true ? "Aktif" : "Pasif"}
        </p>
      </div>
    </>
  }

  const handleAddTempItem = (product) => {

    if (selectedTempItemIdList.find(i => i === Number(product.advertId))) {
      let _currentArray = selectedTempItemIdList.filter(i => i !== Number(product.advertId));
      setSelectedTempItemIdList(_currentArray);
    }
    else {
      setSelectedTempItemIdList([...selectedTempItemIdList, Number(product.advertId)])
    }

  }

  const clearFilter = () => {
    setCategoryName("");
    setMinPrice("0");
    setMaxPrice("0");
    setMinDiscountRate("0");
    setMaxDiscountRate("0");
  }

  return (
    <>
      <Table
        ref={tableEl}
        emptyListText={"Liste Bulunamadı"}
        getDataFunction={getDynamicListItems}
        addNewButton={
          <Button buttonMd textTiny color="text-blue-400" className="w-72" design="button-blue-100" text="Yeni Ürün Ekle" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { setShowAddingModal(true) }} />}
        header={<div className=" lg:grid-cols-10 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
          <div className="lg:col-span-2 flex items-center">
            <span className="p-sm-gray-400">
              Liste Türü
            </span>
          </div>
          <div className="lg:col-span-1">
            <span className="p-sm-gray-400">
              Stok Adedi
            </span>
          </div>
          <div className="lg:col-span-2">
            <span className="p-sm-gray-400">
              Kategori
            </span>
          </div>
          <div className="lg:col-span-1">
            <span className="p-sm-gray-400">
              Satış Fiyatı
            </span>
          </div>
          <div className="lg:col-span-1">
            <span className="p-sm-gray-400">
              Ürün Puanı
            </span>
          </div>
          <div className="lg:col-span-1">
            <span className="p-sm-gray-400">
              Başlangıç Tarihi
            </span>
          </div>
          <div className="lg:col-span-1">
            <span className="p-sm-gray-400">
              Bitiş Tarihi
            </span>
          </div>
        </div>}
        renderItem={(e, i) => {
          return <div key={"list" + i} className="lg:grid-cols-10 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center">
            <div className="lg:col-span-2 flex lg:block items-center">
              <span className="p-sm-gray-700 lg:hidden mr-2">Ürün Adı:</span>
              <div className="flex items-center w-full">
                <Image src={e.MainPhoto} className="min-w-14 max-w-14 max-h-14 min-h-14 mr-2 object-contain  " />
                <div className="">
                  <p className="p-sm line-clamp-2">{e.ProductName}</p>
                  <p className="text-black-700 text-sm">Barkod No: <span className="font-medium">{e.BarcodeNo}</span></p>
                </div>
              </div>

            </div>
            <div className="lg:col-span-1 flex lg:block items-center">
              <span className="p-sm-gray-700 lg:hidden mr-2">Stok Adedi:</span>
              <p className="p-sm">
                {e.StockCount}
              </p>
            </div>
            <div className="lg:col-span-2 flex lg:block items-center">
              <span className="p-sm-gray-700 lg:hidden mr-2">Kategori:</span>
              <p className="p-sm">
                {e.Category}
              </p>
            </div>
            <div className="lg:col-span-1 flex lg:block items-center">
              <span className="p-sm-gray-700 lg:hidden mr-2">Satış Fiyatı:</span>
              <p className="text-sm font-medium text-black-400">
                {e.SalePrice % 1 === 0 ?
                  <>{fraction.format(e.SalePrice)} TL </>
                  :
                  <>{formatter.format(e.SalePrice)} TL</>
                }
              </p>
            </div>
            <div className="lg:col-span-1 flex lg:block items-center">
              <span className="p-sm-gray-700 lg:hidden mr-2">Ürün Puanı:</span>
              <div className="flex items-center font-semibold gap-2 text-yellow-600 text-sm">
                <StarIcon className="w-4 h-4 mr-2" />
                <span className="text-yellow-600">{e.AdvertRate}</span>
              </div>
            </div>

            <div className="lg:col-span-1 flex lg:block items-center">
              <span className="p-sm-gray-700 lg:hidden mr-2">Başlangıç Tarihi:</span>
              {e.PromoteStartDateJsTime > 0 ?
                <DateView className="text-sm font-medium" dateNumber={e.PromoteStartDateJsTime} pattern="dd/MM/yyyy" />
                :
                "-"
              }
            </div>
            <div className="lg:col-span-1 flex lg:block items-center">
              <span className="p-sm-gray-700 lg:hidden mr-2">Bitiş Tarihi:</span>
              {e.PromoteEndDateJsTime > 0 ?
                <DateView className="text-sm font-medium" dateNumber={e.PromoteEndDateJsTime} pattern="dd/MM/yyyy" />
                :
                "-"
              }
            </div>
            <div className="lg:col-span-1 flex justify-between items-center">
              <span className="p-sm-gray-700 lg:hidden mr-2">İşlemler: </span>
              <div className="text-gray-700 flex gap-2 items-center ml-auto">
                <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => showDeleteModal(e)} />
                <ChevronRightIcon className="icon-md text-gray-700 border-l cursor-pointer" onClick={() => history.push(`/urun-ilan-detay/${e.AdvertId}`)} />
              </div>
            </div>
          </div>
        }}
      />

      <Modal
        modalType="fixedMd"
        showModal={showAddingModal}
        onClose={() => { setShowAddingModal(false); setSelectedTempItemIdList([]); clearFilter(); }}
        title="Listeden Ürün Ekleme"
        body=
        {
          <div className="">
            <div className="flex gap-3 justify-end items-centblockImageser text-sm my-4">
              <div className="text-gray-700"><span className="text-gray-900 font-medium">{selectedItemIdList.length + selectedTempItemIdList.length} / 200</span> Ürün Seçildi</div>
              <Button isLoading={processLoading} buttonMd text="Seçili Ürünleri Ekle" design="button-blue-400 w-60" onClick={() => {
                addItemToDynamicList()
              }} />
            </div>
            <AdvertSearchFilterBar
              setCategoryName={setCategoryName}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              setMinDiscountRate={setMinDiscountRate}
              setMaxDiscountRate={setMaxDiscountRate}
              setApplyClink={() => tableElModal.current?.reload()}
            />
            <Table
              ref={tableElModal}
              key={"table1"}
              emptyListText={"Ürün Bulunamadı"}
              getDataFunction={searchAvertForAdmin}
              header={returnHeader()}
              sortOptions={sortOptions}
              renderItem={(e, i) => {
                return <div key={"list" + i} className="lg:grid-cols-11 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
                  {returnBody(e)}
                  <div className="lg:col-span-1">
                    {/* {e.isEnabled === true ? */}
                    <Button buttonSm
                      className="p-6"
                      hasIcon icon={(selectedTempItemIdList.find(i => i === Number(e.advertId)) || selectedItemIdList.find(i => i === Number(e.advertId))) ? <CheckIcon className="icon-sm" /> : <></>}
                      design={selectedTempItemIdList.find(i => i === Number(e.advertId)) ? "button-blue-400 text-white" : selectedItemIdList.find(i => i === Number(e.advertId)) ? "button-blue-400 text-white pointer-events-none" : "button-blue-100 text-blue-400"}
                      text={(selectedTempItemIdList.find(i => i === Number(e.advertId)) || selectedItemIdList.find(i => i === Number(e.advertId))) ? "" : "Seç"} onClick={() => { handleAddTempItem(e); }} />
                    {/* : <></>} */}
                  </div>
                </div>
              }}
              noRefreshButton
            />
          </div>
        }
      />

    </>
  )
}
