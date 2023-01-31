import { FunctionComponent, useRef, useState, useContext, useEffect } from "react";

import { ItemModel, ProjectModel, AdvertSearchResult } from "../../../Models";
import ApiService from "../../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../../Services/SharedContext";
import { Button } from "../../Button";
import { CheckIcon, PlusIcon, TrashIcon } from "../../Icons";
import { Modal } from "../../Modal";
import { Table } from "../../Table";
import { useStateEffect } from "../../UseStateEffect";
import { Image } from "../../Image";
import { formatter, fraction } from "../../../Services/Functions";
import { Tabs2ForIdeas } from "./Tabs2ForIdeas";
import { AdvertSearchFilterBar } from "../../AdvertSearchFilterBar";

export interface Tabs2ForProductIdeaProps {
  setSelectedListToApi: (e: ItemModel[]) => void,
  setSelectedIdeaList: (e: ProjectModel[]) => void,
  selectedIdeaList: ProjectModel[],
  setSelectedMainProduct: (e: AdvertSearchResult) => void,
  selectedMainProduct: AdvertSearchResult,
}

export const Tabs2ForProductIdea: FunctionComponent<Tabs2ForProductIdeaProps> = (props: Tabs2ForProductIdeaProps) => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [selectedItemsToApi, setSelectedItemsToApi] = useState<ItemModel[]>([]);


  // SELECT MAIN PRODUCT ---START---

  const tableMainProduct = useRef<any>();

  const tableProductModal = useRef<any>();

  const sortOptions = [
    { key: "3", value: "Yeniden Eskiye" },
    { key: "4", value: "Eskiden Yeniye" },
    { key: "1", value: "Fiyat Artan" },
    { key: "2", value: "Fiyat Azalan" }
  ]

  const [showAdvertProductModal, setShowAdvertProductModal] = useState<boolean>(false);

  const [selectedMainAdvertProduct, setSelectedMainAdvertProduct] = useState<AdvertSearchResult>(
    props.selectedMainProduct ??
    {
      AdvertId: 0,
      AdvertStatus: 0,
      BarcodeNo: "",
      BuyboxPrice: 0,
      Category: "",
      CreatedDateJSTime: 0,
      DraftId: 0,
      MarketPrice: 0,
      ModelNo: "",
      ProductId: 0,
      ProductMainPhoto: "",
      ProductName: "",
      SalePrice: 0,
      SellerId: 0,
      SellerName: "",
      StockCode: "",
      StockCount: 0,
      ProductIsEnabled: false,
      ShowProduct: false
    }
  );

  const [tempSelectedMainAdvertProduct, setTempSelectedMainAdvertProduct] = useState<AdvertSearchResult>(
    props.selectedMainProduct ??
    {
      advertId: "",
      productId: 0,
      productName: "",
      category: [],
      hasStock: false,
      isFreeShipping: false,
      categoryId: 0,
      sellerName: "",
      mainPhoto: "",
      rateCount: 0,
      rate: 0,
      price: 0,
      marketPrice: 0,
      discountedPrice: 0,
      discountRate: 0,
      seoUrl: "",
      discountStartDate: 0,
      discountEndDate: 0,
      campaignType: 0,
      isSponsored: false,
      barcodeNo: "",//fe
      stockCount: 0,//fe
      buybox: 0,//fe
      isEnabled: false,//fe
    }
  );

  const [selectedMainAdvertProductToShow, setSelectedMainAdvertProductToShow] = useState<AdvertSearchResult[]>([]);

  //#region filters start
  const [categoryName, setCategoryName] = useState<string>("");

  const [minPrice, setMinPrice] = useState<string>("0");

  const [maxPrice, setMaxPrice] = useState<string>("0");

  const [minDiscountRate, setMinDiscountRate] = useState<string>("0");

  const [maxDiscountRate, setMaxDiscountRate] = useState<string>("0");

  //#endregion fiters end


  const searchAvertForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.searchAvertForAdmin(searchText, page, take, order, categoryName, "", minPrice, maxPrice, minDiscountRate, maxDiscountRate, [], []);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      setShowAdvertProductModal(false);
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

  const removeSelectedMainAdvert = (e) => {
    selectedMainAdvertProduct.advertId = "0";
    setSelectedMainAdvertProduct(selectedMainAdvertProduct);
    setSelectedMainAdvertProductToShow([]);
  }

  useEffect(() => {
    let _selectedMainAdvertProductToShowList: AdvertSearchResult[] = []
    _selectedMainAdvertProductToShowList.push(selectedMainAdvertProduct);
    setSelectedMainAdvertProductToShow(_selectedMainAdvertProductToShowList);
  }, [selectedMainAdvertProduct]);

  useStateEffect(() => {
    tableMainProduct.current?.reload();
  }, [selectedMainAdvertProductToShow])

  const singleMainProduct = async (order: number, searchText: string, page: number, take: number) => {
    return {
      Data: Number(selectedMainAdvertProduct.advertId) > 0 ? selectedMainAdvertProductToShow : [],
      TotalCount: 1
    }
  }
  // SELECT MAIN PRODUCT ---END---

  const returnProductHeader = () => {
    return <div className="lg:grid-cols-10 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
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
          BUYBOX
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

  const returnProductBody = (e) => {
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
          {(e.discountedPrice && e.discountedPrice > 0) ?
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
        <span className="p-sm-gray-700 lg:hidden mr-2">BUYBOX:</span>
        <p className="text-sm text-green-400 font-medium">
          {e.buyboxPrice % 1 === 0 ?
            <>{fraction.format(e.buyboxPrice)} TL </>
            :
            <>{formatter.format(e.buyboxPrice)} TL</>
          }
        </p>
      </div>
      <div className="lg:col-span-1 flex lg:block items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Durum:</span>
        <p className={`${e.isEnabled === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
          {e.isEnabled === true ? "Aktif" : "Pasif"}
        </p>
      </div>
    </>
  }

  const [selectedIdeaListToApi, setSelectedIdeaListToApi] = useState<ItemModel[]>([]);

  const [selectedIdeaList, setSelectedIdeaList] = useState<ProjectModel[]>(props.selectedIdeaList ?? []);


  useStateEffect(() => {
    let _currentArray: ItemModel[] = []
    selectedMainAdvertProductToShow.map((item) => (
      _currentArray.push({
        ItemId: Number(item.advertId),
        PhotoUrl: "",
        RedirectUrl: "",
        Title: "",
        Description: "",
        IsIdeaMainProduct: true
      })
    ));
    selectedIdeaList.map((item) => (
      _currentArray.push({
        ItemId: item.Id,
        PhotoUrl: "",
        RedirectUrl: "",
        Title: "",
        Description: "",
        IsIdeaMainProduct: false
      })
    ));
    setSelectedItemsToApi(_currentArray);
  }, [selectedMainAdvertProductToShow, selectedIdeaListToApi]);

  useStateEffect(() => {
    props.setSelectedListToApi(selectedItemsToApi);
    props.setSelectedIdeaList(selectedIdeaList)
    props.setSelectedMainProduct(selectedMainAdvertProduct)
  }, [selectedItemsToApi]);

  const clearFilter = () => {
    setCategoryName("");
    setMinPrice("0");
    setMaxPrice("0");
    setMinDiscountRate("0");
    setMaxDiscountRate("0");
  }

  return (
    <div>
      {/* SELECT MAIN PRODUCT */}
      <h4 className="mb-4">Öne Çıkarılacak Ürün</h4>
      <Button textTiny text="Ürün Seç" hasIcon icon={<PlusIcon className="icon-sm mr-2 " />} design="button-blue-100 text-blue-400 w-60 mb-4" onClick={() => setShowAdvertProductModal(true)} />
      <Table
        ref={tableMainProduct}
        key={"table2"}
        emptyListText={"Ürün Bulunamadı"}
        getDataFunction={singleMainProduct}
        header={returnProductHeader()}
        renderItem={(e, i) => {
          return <div key={"list" + i} className="lg:grid-cols-10 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
            {returnProductBody(e)}
            <div className="lg:col-span-1">
              <TrashIcon className="icon-sm mr-2" onClick={() => removeSelectedMainAdvert(e)} />
            </div>
          </div>
        }}
        noRefreshButton
      />
      <Modal
        modalType="fixedMd"
        showModal={showAdvertProductModal}
        onClose={() => {
          setShowAdvertProductModal(false);
          setTempSelectedMainAdvertProduct(selectedMainAdvertProduct);
          clearFilter();
        }}
        title="Listeden Ürün Ekleme"
        body=
        {
          <div className="">
            <div className="flex gap-3 justify-end items-center text-sm my-4">
              <div className="text-gray-700"><span className="text-gray-900 font-medium">{Number(tempSelectedMainAdvertProduct.advertId) > 0 ? "1" : "0"} / 1</span> Ürün Seçildi</div>
              <Button buttonMd text="Seçili Ürünleri Ekle" design="button-blue-400 w-60" onClick={() => {
                setSelectedMainAdvertProduct(tempSelectedMainAdvertProduct); setShowAdvertProductModal(false); clearFilter();
              }} />
            </div>
            <AdvertSearchFilterBar
              setCategoryName={setCategoryName}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              setMinDiscountRate={setMinDiscountRate}
              setMaxDiscountRate={setMaxDiscountRate}
              setApplyClink={() => tableProductModal.current?.reload()}
            />
            <Table
              ref={tableProductModal}
              key={"table1"}
              emptyListText={"Ürün Bulunamadı"}
              getDataFunction={searchAvertForAdmin}
              header={returnProductHeader()}
              renderItem={(e, i) => {
                return <div key={"list" + i} className="lg:grid-cols-10 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
                  {returnProductBody(e)}
                  <div className="lg:col-span-1">
                    {e.isEnabled === true &&
                      <Button buttonSm
                        className="p-6"
                        hasIcon
                        icon={tempSelectedMainAdvertProduct.advertId === e.advertId ? <CheckIcon className="icon-sm" /> : <></>}
                        design={tempSelectedMainAdvertProduct.advertId === e.advertId ? "button-blue-400 text-white" : "button-blue-100 text-blue-400"}
                        text={tempSelectedMainAdvertProduct.advertId === e.advertId ? "" : "Seç"}
                        onClick={() => { setTempSelectedMainAdvertProduct(e); }} />
                    }
                  </div>
                </div>
              }}
              noRefreshButton
              sortOptions={sortOptions}
            />
          </div>
        }
      />
      {/* SELECT IDEA LIST */}
      <div className="mt-4">
        <Tabs2ForIdeas setSelectedListToApi={setSelectedIdeaListToApi} setSelectedList={setSelectedIdeaList} selectedList={selectedIdeaList} />
      </div>
    </div>
  )
}
