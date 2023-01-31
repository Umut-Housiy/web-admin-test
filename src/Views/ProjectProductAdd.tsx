import { FunctionComponent, useContext, useEffect, useState } from "react"
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { Button } from "../Components/Button";
import { ActiveTag, AlertIcon, CloseIcon, DeleteTagIcon, EmptySearchIcon, PassiveTag, QuestionMarkIcon, SearchIcon, SearchIconLg, TagIcon, TrashIcon } from "../Components/Icons";
import { Loading } from "../Components/Loading";
import { RateStars } from "../Components/RateStars";
import { SearchBar } from "../Components/SearchBar";
import { SliderForDetails } from "../Components/SliderForDetails";
import { TabsTitle } from "../Components/TabsTitle";
import { ProductModelForProject, ProImageListModel, ProjectMediaModel, ProjectProductInnerModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { formatter, fraction } from "../Services/Functions";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ImageMapper, ImagePinModel } from "../Components/ImageMapper";
import { useStateEffect } from "../Components/UseStateEffect";
import { EmptyList } from "../Components/EmptyList";

interface RouteParams {
  id: string,
}

interface LocationModel {
  IsIdeaApproved: boolean
}

export const ProjectProductAdd: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const params = useParams<RouteParams>();

  const location = useLocation<LocationModel>();

  const [loading, setLoading] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [IsIdeaApproved, setIsIdeaApproved] = useState<boolean>(location.state?.IsIdeaApproved === undefined ? false : location.state?.IsIdeaApproved);

  const [mediaList, setMediaList] = useState<ProjectMediaModel[]>([]);

  const [searchText, setSearchText] = useState<string>("");

  const [searchUrl, setSearchUrl] = useState<string>("");

  const [isSeached, setIsSearched] = useState<boolean>(false);

  const [searchedProducts, setSearchedProducts] = useState<ProductModelForProject[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<ProductModelForProject>();

  const [selectedCancelProduct, setSelectedCancelProduct] = useState<ProductModelForProject>();

  const [selectedProductList, setSelectedProductList] = useState<ProductModelForProject[]>([]);

  const [initialProductList, setInitialProductList] = useState<ProductModelForProject[]>([]);

  const [isPinSelectOpen, setisPinSelectOpen] = useState<boolean>(true);

  const [pinData, setPinData] = useState<string>("");

  const [pinExtarnalData, setPinExtarnalData] = useState<{ ProductId: number }>({ ProductId: 0 });

  const [activePinId, setActivePinId] = useState<number>(0);

  useEffect(() => {
    if (!selectedProduct) {
      setisPinSelectOpen(false);
      setPinExtarnalData({ ProductId: 0 });
    }
    else {
      setPinExtarnalData({ ProductId: selectedProduct.ProductId });
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (!selectedCancelProduct) {
      setisPinSelectOpen(false);
      setPinExtarnalData({ ProductId: 0 });
    }
    else {
      setPinExtarnalData({ ProductId: selectedCancelProduct.ProductId });
    }
  }, [selectedCancelProduct]);

  const tabsLink = [
    { id: 1, name: "Ürün Seç" },
    { id: 2, name: "Eklediğim Ürünler" },
  ];

  const [selectedTabsId, setSelectedTabsId] = useState<number>(1);

  useEffect(() => {
    getProjectDetail();
  }, [])

  const getProjectDetail = async () => {
    setLoading(true);
    if (IsIdeaApproved === true) {
      var _result = await ApiService.getIdeaDetail(Number(params.id));
    }
    else {
      var _result = await ApiService.getProjectDetail(Number(params.id));
    }

    if (_result.succeeded === true) {
      const x = _result.data;

      let tempList = selectedProductList;
      x.Products?.forEach((item) => {
        let tempItem: ProductModelForProject = {
          ProjectProductId: item.ProjectProductId,
          ProductId: item.ProductId,
          PinLocation: item.PinLocation,
          ProductPhoto: item.ProductPhoto,
          ProductTitle: item.ProductTitle,
          ProductPrice: item.ProductPrice,
          DiscountedPrice: item.DiscountedPrice,
          AdvertRate: item.AdvertRate,
          AdvertId: item.AdvertId,
          Category: "",
          BarcodeNo: "",
          ModelNo: "",
          Brand: "",
          ProductVariation: item.ProductVariation,
          ProductProperty: item.ProductProperty,
          RawVariationData: item.RawVariationData,
          ProductSeoUrl: item.ProductSeoUrl
        }
        tempList.push(tempItem);
      });
      setSelectedProductList(JSON.parse(JSON.stringify(tempList)));
      setInitialProductList(JSON.parse(JSON.stringify(tempList)));
      setMediaList(x.MediaList);
      if (x.MediaList && x.MediaList.length > 0) {
        let tempList: any[] = [];
        x.MediaList.forEach((item) => {
          let tempList2: any[] = [];
          if (!item.PinMap || item.PinMap === "") {
            tempList2 = [];
          }
          else {
            tempList2 = JSON.parse(item.PinMap);
          }
          if (tempList2 && tempList2.length > 0) {
            tempList2.forEach((item2) => {
              tempList.push(item2);
            })
          }
        })
        setPinData(JSON.stringify(tempList));
      }
      setLoading(false);
    }
    else {
      setLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal();
          if (location.state?.IsIdeaApproved === true) {
            history.push("/fikir-listesi")
          }
          else {
            history.push("/onaylanan-projeler")
          }
        }
      });
    }
  }

  const searchProductsForProject = async () => {
    setProcessLoading(true);

    var _result = await ApiService.searchProductsForProject(searchText, searchUrl);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      setIsSearched(true);
      setSearchUrl("");
      setSearchText("");
      let tempList: ProductModelForProject[] = [];
      _result.data.forEach((item) => {
        if (selectedProductList.find(x => x.ProductId === item.ProductId) === undefined) {
          tempList.push(item);
        }
      })
      setSearchedProducts(tempList);
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal();
          setIsSearched(false);
          setSearchedProducts(JSON.parse(JSON.stringify([])));
        }
      });
    }
  }

  const saveProductToProject = async () => {
    setProcessLoading(true);

    var _result = await ApiService.saveProductToProject(Number(params.id ?? "0"), selectedProductList.map((item) => { return { ProductId: item.ProductId, PinLocation: item.PinLocation } }), mediaList.map((item) => { return { MediaId: item.MediaId, PinLocations: item.PinMap } }));

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Ürünler Eklendi",
        onClose: () => {
          context.hideModal();
          setSelectedProductList(JSON.parse(JSON.stringify([])));
          history.push(`/proje-detay/${params.id}`);
        }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal();
          setIsSearched(false);
        }
      });
    }
  }

  const handleClearSearch = () => {
    setIsSearched(false);
    setSearchedProducts(JSON.parse(JSON.stringify([])));
    setSearchUrl("");
    setSearchText("");
  }

  const handleAddSelectedProductList = (item) => {
    let tempList = selectedProductList;
    tempList.push(item);
    setSelectedProductList(JSON.parse(JSON.stringify(tempList)));
    //
    let tempSearchList = searchedProducts.filter(x => x.ProductId !== item.ProductId);
    setSearchedProducts(JSON.parse(JSON.stringify(tempSearchList)));
    //
    setSelectedTabsId(2);
  }

  const handleRemoveSelectedProductList = (item) => {
    let tempList = selectedProductList.filter(x => x.ProductId != item.ProductId);
    setSelectedProductList(JSON.parse(JSON.stringify(tempList)));
    //
    handleRemoveTags(item.ProductId);
  }

  useStateEffect(() => {
    let tempPinDataList: any[] = JSON.parse(pinData);
    let tempFilesList: ProjectMediaModel[] = mediaList;

    if (tempFilesList && tempFilesList.length > 0) {
      if (tempPinDataList && tempPinDataList.length > 0) {
        tempFilesList.forEach((item) => {
          if (!tempPinDataList.find(x => x.imageUrl === item.FileUrl)) {
            item.PinMap = "[]";
          }
        })
        tempPinDataList.forEach((item) => {
          let tempFileItem: (ProjectMediaModel | undefined) = tempFilesList.find(x => x.FileUrl === item.imageUrl);
          if (tempFileItem) {
            let tempPinMapList: any[] = [];
            if (!tempFileItem.PinMap || tempFileItem.PinMap === "") {
              tempPinMapList = [];
            }
            else {
              tempPinMapList = [];
              JSON.parse(tempFileItem.PinMap).forEach((temptTempMapItem) => {
                if (tempPinDataList.find(x => x.id == temptTempMapItem.id)) {
                  tempPinMapList.push(temptTempMapItem);
                }
              });
            }
            if (!tempPinMapList.find(x => x.id === item.id)) {
              tempPinMapList.push(item);
            }
            tempFileItem.PinMap = JSON.stringify(tempPinMapList);
          }
        });
        setMediaList(JSON.parse(JSON.stringify(tempFilesList)));
      }
      else {
        tempFilesList.forEach((fileItem) => {
          fileItem.PinMap = "[]";
        })
        setMediaList(JSON.parse(JSON.stringify(tempFilesList)));
      }
    }
  }, [pinData])

  const handleRemoveTags = (selectedProductId) => {
    let tempList: any[] = JSON.parse(pinData).filter(x => x.externalData.ProductId === selectedProductId);
    let tempPinData: any[] = JSON.parse(pinData);
    if (tempList && tempList.length > 0 && tempPinData && tempPinData.length > 0) {
      let tempFilesList: ProjectMediaModel[] = mediaList;
      tempPinData.forEach((item) => {
        let tempFileItem: (ProjectMediaModel | undefined) = tempFilesList.find(x => x.FileUrl === item.imageUrl);
        if (tempFileItem) {
          let tempPinMapList: any[] = JSON.parse(tempFileItem.PinMap).filter(x => x.externalData.ProductId !== selectedProductId);
          tempFileItem.PinMap = JSON.stringify(tempPinMapList);
        }
      });
      tempList.forEach((item) => {
        tempPinData = tempPinData.filter(x => x.id !== item.id);
      })
    }
    setPinData(JSON.stringify(tempPinData));
  }

  const pinMenu = (pin: ImagePinModel, updatePinsFunc: (pin: ImagePinModel) => void) => {

    let pinProduct: (ProductModelForProject | undefined) = selectedProductList.find(x => x.ProductId === pin.externalData.ProductId);

    return (
      <>
        {
          (pinProduct) ?
            <div className="p-4 bg-white w-64 cursor-pointer relative rounded-md" >
              <img className="w-full h-36 object-contain " src={pinProduct?.ProductPhoto} alt={pinProduct?.ProductTitle} />
              <div className="text-tiny font-medium text-gray-900 my-2">{pinProduct?.ProductTitle}</div>
              <div className="text-sm text-gray-700 font-medium flex flex-wrap gap-1 mb-2">
                {
                  (pinProduct && pinProduct.ProductVariation && pinProduct.ProductVariation.length > 0) &&
                  pinProduct.ProductVariation.map((variationitem, index) => {
                    if (index < (pinProduct?.ProductVariation?.length ?? 0) - 1) {
                      return (
                        <div>{variationitem.Value + ","}</div>
                      )
                    }
                    else {
                      return (
                        <div>{variationitem.Value}</div>
                      )
                    }
                  })
                }
              </div>
              <RateStars className="h-4 text-yellow-600" rateValue={pinProduct?.AdvertRate ?? 0} numberColor={"text-yellow-600"} />
              {
                (pinProduct?.DiscountedPrice ?? 0) > 0 ?
                  <div className="flex items-center gap-1 mt-2">
                    <div className="text-tiny text-gray-700">
                      <del>
                        {(pinProduct?.ProductPrice ?? 0) % 1 === 0 ?
                          <>{fraction.format((pinProduct?.ProductPrice ?? 0))} TL </>
                          :
                          <>{formatter.format((pinProduct?.ProductPrice ?? 0))} TL</>
                        }
                      </del>
                    </div>
                    <div className="text-base text-black-400 font-medium">
                      {(pinProduct?.DiscountedPrice ?? 0) % 1 === 0 ?
                        <>{fraction.format((pinProduct?.DiscountedPrice ?? 0))} TL </>
                        :
                        <>{formatter.format((pinProduct?.DiscountedPrice ?? 0))} TL</>
                      }
                    </div>
                  </div>
                  :
                  <div className="flex items-center gap-1 mt-2">
                    <div className="text-base text-black-400 font-medium">
                      {(pinProduct?.ProductPrice ?? 0) % 1 === 0 ?
                        <>{fraction.format((pinProduct?.ProductPrice ?? 0))} TL </>
                        :
                        <>{formatter.format((pinProduct?.ProductPrice ?? 0))} TL</>
                      }
                    </div>
                  </div>
              }
              {
                isPinSelectOpen &&
                <Button design={"bg-gray-200 text-gray-900 w-full mt-4"} buttonSm text={"Etiketi Kaldır"} hasIcon icon={<DeleteTagIcon className="text-gray-900 icon-sm mr-2" />} onClick={() => {
                  setPinData(JSON.stringify(JSON.parse(pinData).filter(x => x.id !== pin.id)));
                }} />
              }
            </div>
            :
            selectedProduct ?
              <>
                <div className="p-4 bg-white w-64 cursor-pointer relative rounded-md" >
                  <img className="w-full h-36 object-contain " src={selectedProduct?.ProductPhoto} alt={selectedProduct?.ProductTitle} />
                  <div className="text-tiny font-medium text-gray-900 my-2">{selectedProduct?.ProductTitle}</div>
                  <div className="text-sm text-gray-700 font-medium flex flex-wrap gap-1 mb-2">
                    {
                      selectedProduct.ProductVariation && selectedProduct.ProductVariation.length > 0 &&
                      selectedProduct.ProductVariation.map((variationitem, index) => {
                        if (index < selectedProduct.ProductVariation.length - 1) {
                          return (
                            <div>{variationitem.Value + ","}</div>
                          )
                        }
                        else {
                          return (
                            <div>{variationitem.Value}</div>
                          )
                        }
                      })
                    }
                  </div>
                  <RateStars className="h-4 text-yellow-600" rateValue={selectedProduct?.AdvertRate ?? 0} numberColor={"text-yellow-600"} />
                  {
                    (selectedProduct?.DiscountedPrice ?? 0) > 0 ?
                      <div className="flex items-center gap-1 mt-2">
                        <div className="text-tiny text-gray-700">
                          <del>
                            {(selectedProduct?.ProductPrice ?? 0) % 1 === 0 ?
                              <>{fraction.format((selectedProduct?.ProductPrice ?? 0))} TL </>
                              :
                              <>{formatter.format((selectedProduct?.ProductPrice ?? 0))} TL</>
                            }
                          </del>
                        </div>
                        <div className="text-base text-black-400 font-medium">
                          {(selectedProduct?.DiscountedPrice ?? 0) % 1 === 0 ?
                            <>{fraction.format((selectedProduct?.DiscountedPrice ?? 0))} TL </>
                            :
                            <>{formatter.format((selectedProduct?.DiscountedPrice ?? 0))} TL</>
                          }
                        </div>
                      </div>
                      :
                      <div className="flex items-center gap-1 mt-2">
                        <div className="text-base text-black-400 font-medium">
                          {(selectedProduct?.ProductPrice ?? 0) % 1 === 0 ?
                            <>{fraction.format((selectedProduct?.ProductPrice ?? 0))} TL </>
                            :
                            <>{formatter.format((selectedProduct?.ProductPrice ?? 0))} TL</>
                          }
                        </div>
                      </div>
                  }
                  {
                    isPinSelectOpen &&
                    <Button design={"bg-gray-200 text-gray-900 w-full mt-4"} buttonSm text={"Etiketi Kaldır"} hasIcon icon={<DeleteTagIcon className="text-gray-900 icon-sm mr-2" />} onClick={() => {
                      setPinData(JSON.stringify(JSON.parse(pinData).filter(x => x.id !== pin.id)));
                    }} />
                  }
                </div>
              </>
              :
              <>
                {
                  isPinSelectOpen &&
                  <div className="p-4 bg-white w-64 cursor-pointer relative rounded-md" >
                    <Button design={"bg-gray-200 text-gray-900 w-full mt-4"} buttonSm text={"Etiketi Kaldır"} hasIcon icon={<DeleteTagIcon className="text-gray-900 icon-sm mr-2" />} onClick={() => {
                      setPinData(JSON.stringify(JSON.parse(pinData).filter(x => x.id !== pin.id)));
                    }} />
                  </div>
                }

              </>
        }
      </>
    )
  }

  return (
    <div className="content-wrapper">
      {
        activePinId > 0 &&
        <div className="fixed top-0 left-0 bg-black-400 w-full h-full z-40 opacity-0" onClick={() => { setActivePinId(0); }}></div>
      }
      <div className="portlet-wrapper ">
        <h2 className="mb-5">Projeye Ürün Ekle</h2>
        <div className="grid lg:grid-cols-5 max-w-screen gap-6 mt-5">
          <div className="lg:col-span-3">
            {loading ?
              <Loading width="w-full" height="h-screen" />
              :
              <>
                <SliderForDetails
                  navigator={
                    mediaList.map((item, index) => (
                      <div className="focus:outline-none">
                        <img src={item.FileUrl} className="mx-auto min-w-28" alt={item.FileName} />
                      </div>
                    ))
                  }>
                  {mediaList.map((item, index) => (
                    <ImageMapper
                      activePinId={activePinId}
                      setActivePinId={setActivePinId}
                      imageUrl={item.FileUrl}
                      imageMaxHeightInPx={600}
                      imageMaxWidthInPx={600}
                      isReadOnly={!isPinSelectOpen}
                      data={pinData}
                      setData={setPinData}
                      newPinExternalData={pinExtarnalData}
                      pinMenu={pinMenu}
                      pinMenuClassNames={"rounded-md z-50 shadow-sm"}
                      activePin={<ActiveTag />}
                      pasivePin={<PassiveTag />}
                      containerDivClassNames="mx-auto"
                    />
                  ))}
                </SliderForDetails>
              </>
            }
          </div>
          {
            loading ?
              <div className="lg:col-span-2">
                <Loading width="w-full" height="h-screen" />
              </div>
              :
              <>
                {
                  selectedProduct !== undefined ?
                    <>
                      <div className="lg:col-span-2 bg-gray-100 rounded-lg relative z-30">
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="text-base text-gray-900 font-medium">Seçili Ürünü Ekle</div>
                            <CloseIcon className="icon-sm text-gray-900 cursor-pointer" onClick={() => { handleRemoveTags(selectedProduct.ProductId); setSelectedProduct(undefined); }} />
                          </div>
                          <div className="mt-2 mb-5 text-sm text-gray-700">
                            Bu ürünü projeye eklemek istiyor musunuz? Ürünü tagle butonuna basarak görsel üzerinde taglemek istediğiniz alanı seçtikten sonra projeye ekle butonuna basarak ürünü kaydedebilirsiniz.
                          </div>
                          <div className="w-full bg-white rounded-md flex items-center mx-auto p-2 mb-4 gap-4">
                            <img className="w-20 h-20 min-w-20 min-h-20 object-contain " src={selectedProduct.ProductPhoto} alt={selectedProduct.ProductTitle} />
                            <div>
                              <div className="text-tiny font-medium text-gray-900 my-2">{selectedProduct.ProductTitle}</div>
                              <RateStars className="h-4 text-yellow-600" rateValue={selectedProduct.AdvertRate} numberColor={"text-yellow-600"} />
                              <div className="text-sm text-gray-700 font-medium flex flex-wrap gap-1 mb-2">
                                {
                                  selectedProduct.ProductVariation && selectedProduct.ProductVariation.length > 0 &&
                                  selectedProduct.ProductVariation.map((variationitem, index) => {
                                    if (index < selectedProduct.ProductVariation.length - 1) {
                                      return (
                                        <div>{variationitem.Value + ","}</div>
                                      )
                                    }
                                    else {
                                      return (
                                        <div>{variationitem.Value}</div>
                                      )
                                    }
                                  })
                                }
                              </div>
                              {
                                selectedProduct.DiscountedPrice > 0 ?
                                  <div className="flex items-center gap-1 mt-2">
                                    <div className="text-tiny text-gray-700">
                                      <del>
                                        {selectedProduct.ProductPrice % 1 === 0 ?
                                          <>{fraction.format(selectedProduct.ProductPrice)} TL </>
                                          :
                                          <>{formatter.format(selectedProduct.ProductPrice)} TL</>
                                        }
                                      </del>
                                    </div>
                                    <div className="text-base text-black-400 font-medium">
                                      {selectedProduct.DiscountedPrice % 1 === 0 ?
                                        <>{fraction.format(selectedProduct.DiscountedPrice)} TL </>
                                        :
                                        <>{formatter.format(selectedProduct.DiscountedPrice)} TL</>
                                      }
                                    </div>
                                  </div>
                                  :
                                  <div className="flex items-center gap-1 mt-2">
                                    <div className="text-base text-black-400 font-medium">
                                      {selectedProduct.ProductPrice % 1 === 0 ?
                                        <>{fraction.format(selectedProduct.ProductPrice)} TL </>
                                        :
                                        <>{formatter.format(selectedProduct.ProductPrice)} TL</>
                                      }
                                    </div>
                                  </div>
                              }
                            </div>
                          </div>
                          {
                            !isPinSelectOpen ?
                              <>
                                <Button isLoading={processLoading} onClick={() => { setisPinSelectOpen(true); }} design="button bg-black-400  mb-2 text-white transition-colors duration-300" hasIcon icon={<TagIcon className="text-white icon-sm mr-2" />} block text="Ürünü Etiketle" />
                                <Button isLoading={processLoading} onClick={() => { handleAddSelectedProductList(selectedProduct); setSelectedProduct(undefined); handleClearSearch(); }} design="button bg-blue-400 hover:bg-blue-600 text-white transition-colors duration-300" block text="Projeye Ekle" />
                              </>
                              :
                              <>
                                <Button isLoading={processLoading} onClick={() => { setisPinSelectOpen(false); }} design="button bg-blue-400 hover:bg-blue-600 mb-2 text-white transition-colors duration-300" hasIcon icon={<TagIcon className="text-white icon-sm mr-2" />} block text="Tamamla" />
                              </>
                          }
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                              <QuestionMarkIcon className="icon-sm text-blue-400" />
                              <div className="text-tiny text-black-400 font-medium">Ürün ekleme nasıl çalışır?</div>
                            </div>
                            <div className="text-sm text-gray-900 mt-4">Projenize eklemek istediğiniz ürünleri ürün adı, barkod no veya ürün url’si kullanarak arama yaparak bulabilirsiniz.</div>
                            <div className="text-sm text-gray-900 mt-4">Seçtiğiniz ürün için "Ürünü Etiketle" butonuna basarak görsel üzerinde etiket eklemek istediğiniz noktalara tıklayın ve daha sonra "Tamamla" butonuna basarak ürün etiketlerinizi kaydedin.</div>
                            <div className="text-sm text-gray-900 mt-4">Eklediğiniz ürün etiketlerini "Ürünü Etiketle" butonuna bastıktan sonra etiket üzerine tıklandığında açılan ürün kartında bulunan "Etiketi Kaldır" butonuna basarak silebilirsiniz.</div>
                            <div className="text-sm text-gray-900 mt-4">Herhangi bir etiketleme yapmadan projeye eklenen ürünler proje görselleri üzerinde gösterilmez ancak projede kullanılan ürünler listesinde görüntülenir.</div>
                          </div>
                        </div>
                      </div>
                    </>
                    :
                    selectedCancelProduct !== undefined ?
                      <>
                        <div className="lg:col-span-2 bg-gray-100 rounded-lg relative z-30">
                          <div className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="text-base text-gray-900 font-medium">Ürün Bilgileri</div>
                              <CloseIcon className="icon-sm text-gray-900 cursor-pointer" onClick={() => { setSelectedCancelProduct(undefined); }} />
                            </div>
                            <div className="w-full flex items-center gap-4 mx-auto bg-white rounded-md p-2 my-4">
                              <img className="w-20 h-20 min-w-20 min-h-20 object-contain " src={selectedCancelProduct.ProductPhoto} alt={selectedCancelProduct.ProductTitle} />
                              <div>
                                <div className="text-tiny font-medium text-gray-900 my-2">{selectedCancelProduct.ProductTitle}</div>
                                <RateStars className="h-4 text-yellow-600" rateValue={selectedCancelProduct.AdvertRate} numberColor={"text-yellow-600"} />
                                <div className="text-sm text-gray-700 font-medium flex flex-wrap gap-1 mb-2">
                                  {
                                    selectedCancelProduct.ProductVariation && selectedCancelProduct.ProductVariation.length > 0 &&
                                    selectedCancelProduct.ProductVariation.map((variationitem, index) => {
                                      if (index < selectedCancelProduct.ProductVariation.length - 1) {
                                        return (
                                          <div>{variationitem.Value + ","}</div>
                                        )
                                      }
                                      else {
                                        return (
                                          <div>{variationitem.Value}</div>
                                        )
                                      }
                                    })
                                  }
                                </div>
                                {
                                  selectedCancelProduct.DiscountedPrice > 0 ?
                                    <div className="flex items-center gap-1 mt-2">
                                      <div className="text-tiny text-gray-700">
                                        <del>
                                          {selectedCancelProduct.ProductPrice % 1 === 0 ?
                                            <>{fraction.format(selectedCancelProduct.ProductPrice)} TL </>
                                            :
                                            <>{formatter.format(selectedCancelProduct.ProductPrice)} TL</>
                                          }
                                        </del>
                                      </div>
                                      <div className="text-base text-black-400 font-medium">
                                        {selectedCancelProduct.DiscountedPrice % 1 === 0 ?
                                          <>{fraction.format(selectedCancelProduct.DiscountedPrice)} TL </>
                                          :
                                          <>{formatter.format(selectedCancelProduct.DiscountedPrice)} TL</>
                                        }
                                      </div>
                                    </div>
                                    :
                                    <div className="flex items-center gap-1 mt-2">
                                      <div className="text-base text-black-400 font-medium">
                                        {selectedCancelProduct.ProductPrice % 1 === 0 ?
                                          <>{fraction.format(selectedCancelProduct.ProductPrice)} TL </>
                                          :
                                          <>{formatter.format(selectedCancelProduct.ProductPrice)} TL</>
                                        }
                                      </div>
                                    </div>
                                }
                              </div>
                            </div>
                            {
                              !isPinSelectOpen ?
                                <>
                                  <Button isLoading={processLoading} onClick={() => { setisPinSelectOpen(true); }} design="button bg-black-400  mb-2 text-white transition-colors duration-300" hasIcon icon={<TagIcon className="text-white icon-sm mr-2" />} block text="Ürünü Etiketle" />
                                  <Button isLoading={processLoading} onClick={() => { handleRemoveSelectedProductList(selectedCancelProduct); setSelectedCancelProduct(undefined); }} design="button bg-gray-200 hover:bg-gray-300 text-gray-900 transition-colors duration-300" className="relative z-10" hasIcon icon={<TrashIcon className="icon-sm mr-2" />} block text="Ürünü Projeden Kaldır" />
                                </>
                                :
                                <>
                                  <Button isLoading={processLoading} onClick={() => { setisPinSelectOpen(false); setSelectedCancelProduct(undefined); }} design="button bg-blue-400 hover:bg-gray-600 mb-2 text-white transition-colors duration-300" hasIcon icon={<TagIcon className="text-white icon-sm mr-2" />} block text="Tamamla" />
                                </>
                            }
                          </div>
                        </div>
                      </>
                      :
                      <>
                        <div className="lg:col-span-2 bg-gray-100 rounded-lg relative z-30">
                          {
                            isSeached ?
                              <>
                                <div className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="text-base text-gray-900 font-medium">Arama Sonuçları</div>
                                    <div className="flex items-center gap-1 bg-gray-300 hover:bg-gray-400 duration-300 text-gray-900 p-2 cursor-pointer rounded-md" onClick={() => { handleClearSearch(); }}>
                                      <CloseIcon className="w-3 h-3" />
                                      <div className="text-gray-900 font-medium text-sm select-none">Temizle</div>
                                    </div>
                                  </div>
                                  {
                                    searchedProducts.length > 0 ?
                                      <div className={`mt-4 pt-4 border-t border-gray-200 h-80vh overflow-y-auto custom-scrollbar pr-2`}>
                                        <div className="flex flex-col gap-2">
                                          {
                                            searchedProducts.map((item) => (
                                              <div className="w-full p-4 cursor-pointer flex bg-white items-center gap-4 rounded-md" onClick={() => { setSelectedProduct(item); }}>
                                                <img className="h-20 w-20 object-contain " src={item.ProductPhoto} alt={item.ProductTitle} />
                                                <div>
                                                  <div className="text-tiny font-medium text-gray-900 my-2">{item.ProductTitle}</div>
                                                  <div className="text-sm text-gray-700 font-medium flex flex-wrap gap-1 mb-2">
                                                    {
                                                      item.ProductVariation && item.ProductVariation.length > 0 &&
                                                      item.ProductVariation.map((variationitem, index) => {
                                                        if (index < item.ProductVariation.length - 1) {
                                                          return (
                                                            <div>{variationitem.Value + ","}</div>
                                                          )
                                                        }
                                                        else {
                                                          return (
                                                            <div>{variationitem.Value}</div>
                                                          )
                                                        }
                                                      })
                                                    }
                                                  </div>
                                                  <RateStars className="h-4 text-yellow-600" rateValue={item.AdvertRate} numberColor={"text-yellow-600"} />
                                                  {
                                                    item.DiscountedPrice > 0 ?
                                                      <div className="flex items-center gap-1 mt-2">
                                                        <div className="text-tiny text-gray-700">
                                                          <del>
                                                            {item.ProductPrice % 1 === 0 ?
                                                              <>{fraction.format(item.ProductPrice)} TL </>
                                                              :
                                                              <>{formatter.format(item.ProductPrice)} TL</>
                                                            }
                                                          </del>
                                                        </div>
                                                        <div className="text-base text-black-400 font-medium">
                                                          {item.DiscountedPrice % 1 === 0 ?
                                                            <>{fraction.format(item.DiscountedPrice)} TL </>
                                                            :
                                                            <>{formatter.format(item.DiscountedPrice)} TL</>
                                                          }
                                                        </div>
                                                      </div>
                                                      :
                                                      <div className="flex items-center gap-1 mt-2">
                                                        <div className="text-base text-black-400 font-medium">
                                                          {item.ProductPrice % 1 === 0 ?
                                                            <>{fraction.format(item.ProductPrice)} TL </>
                                                            :
                                                            <>{formatter.format(item.ProductPrice)} TL</>
                                                          }
                                                        </div>
                                                      </div>
                                                  }
                                                </div>
                                              </div>
                                            ))
                                          }
                                        </div>
                                      </div>
                                      :
                                      <>
                                        {
                                          !isSeached &&
                                          <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="flex items-center gap-2">
                                              <QuestionMarkIcon className="icon-sm text-blue-400" />
                                              <div className="text-tiny text-black-400 font-medium">Ürün ekleme nasıl çalışır?</div>
                                            </div>
                                            <div className="text-sm text-gray-900 mt-4">Projenize eklemek istediğiniz ürünleri ürün adı, barkod no veya ürün url’si kullanarak arama yaparak bulabilirsiniz.</div>
                                            <div className="text-sm text-gray-900 mt-4">Seçtiğiniz ürün için "Ürünü Etiketle" butonuna basarak görsel üzerinde etiket eklemek istediğiniz noktalara tıklayın ve daha sonra "Tamamla" butonuna basarak ürün etiketlerinizi kaydedin.</div>
                                            <div className="text-sm text-gray-900 mt-4">Eklediğiniz ürün etiketlerini "Ürünü Etiketle" butonuna bastıktan sonra etiket üzerine tıklandığında açılan ürün kartında bulunan "Etiketi Kaldır" butonuna basarak silebilirsiniz.</div>
                                            <div className="text-sm text-gray-900 mt-4">Herhangi bir etiketleme yapmadan projeye eklenen ürünler proje görselleri üzerinde gösterilmez ancak projede kullanılan ürünler listesinde görüntülenir.</div>
                                          </div>
                                        }
                                      </>
                                  }
                                  {
                                    (isSeached && searchedProducts.length === 0) &&
                                    <>
                                      <div className="text-center mt-6 py-6">
                                        <EmptySearchIcon className=" w-20 h-20 mx-auto" />
                                        <div className="text-tiny font-medium text-gray-900 mt-4">Aradığınız ürün bulunamadı</div>
                                        <div className="text-sm font-medium text-gray-900 mt-4">Farklı bir barkod numarası veya URL bağlantısı ile tekrar arama yapmayı deneyeilirsiniz.</div>
                                        <Button design={"button-blue-400 w-4/5 mt-4"} text={"Tekrar Arama Yap"} onClick={() => { handleClearSearch(); }} />
                                      </div>
                                    </>
                                  }
                                </div>
                              </>
                              :
                              <>
                                <div className="p-4">
                                  <div className="text-base text-gray-900 font-medium">Ürün Ekle</div>
                                  <div className="mt-2 mb-5 text-sm text-gray-700">Housiy üzerinden satın alınabilen ürünlerden bu projede kullandıklarınızı veya benzerlerini ekleyebilirisniz.</div>
                                  <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id); }} />
                                  {
                                    selectedTabsId === 1 ?
                                      <div className="mt-4">
                                        <SearchBar value={searchText} onChange={(e) => { setSearchText(e.target.value); }} notButton iconColor="text-gray-700" className="mb-4" placeholder="Ürün adı veya barkod numarası ile arama yapabilirsiniz" />
                                        <SearchBar value={searchUrl} onChange={(e) => { setSearchUrl(e.target.value); }} notButton iconColor="text-gray-700" className="mb-4" placeholder="URL ile ürün ekle" />
                                        <Button isLoading={processLoading} isDisabled={((searchText && searchText !== "") || (searchUrl && searchUrl !== "")) ? false : true} onClick={() => { searchProductsForProject(); }} design={`${((searchText && searchText !== "") || (searchUrl && searchUrl !== "")) ? "bg-blue-400 hover:bg-blue-600" : "bg-gray-700 hover:bg-gray-900"} button  text-white transition-colors duration-300 select-none`} block text="Arama Yap" />
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                          <div className="flex items-center gap-2">
                                            <QuestionMarkIcon className="icon-sm text-blue-400" />
                                            <div className="text-tiny text-black-400 font-medium">Ürün ekleme nasıl çalışır?</div>
                                          </div>
                                          <div className="text-sm text-gray-900 mt-4">Projenize eklemek istediğiniz ürünleri ürün adı, barkod no veya ürün url’si kullanarak arama yaparak bulabilirsiniz.</div>
                                          <div className="text-sm text-gray-900 mt-4">Seçtiğiniz ürün için "Ürünü Etiketle" butonuna basarak görsel üzerinde etiket eklemek istediğiniz noktalara tıklayın ve daha sonra "Tamamla" butonuna basarak ürün etiketlerinizi kaydedin.</div>
                                          <div className="text-sm text-gray-900 mt-4">Eklediğiniz ürün etiketlerini "Ürünü Etiketle" butonuna bastıktan sonra etiket üzerine tıklandığında açılan ürün kartında bulunan "Etiketi Kaldır" butonuna basarak silebilirsiniz.</div>
                                          <div className="text-sm text-gray-900 mt-4">Herhangi bir etiketleme yapmadan projeye eklenen ürünler proje görselleri üzerinde gösterilmez ancak projede kullanılan ürünler listesinde görüntülenir.</div>
                                        </div>
                                      </div>
                                      :
                                      <div className="mt-4">
                                        {selectedProductList.length === 0 ?
                                          <EmptyList text="Henüz hiç ürün eklemediniz" />
                                          :
                                          <div className={`h-60vh flex flex-col gap-2 overflow-y-auto custom-scrollbar ${selectedProductList.length > 2 ? "pr-4" : ""}`}>
                                            {
                                              selectedProductList.map((item) => (
                                                <div className="w-full bg-white flex items-center gap-2 p-2 rounded-md cursor-pointer" onClick={() => { setSelectedCancelProduct(item); }} >
                                                  <img className="w-20 h-20 min-w-20 min-h-20 object-contain" src={item.ProductPhoto} alt={item.ProductTitle} />
                                                  <div>
                                                    <div className="text-tiny font-medium text-gray-900 my-2">{item.ProductTitle}</div>
                                                    <div className="text-sm text-gray-700 font-medium flex flex-wrap gap-1 mb-2">
                                                      {
                                                        item.ProductVariation && item.ProductVariation.length > 0 &&
                                                        item.ProductVariation.map((variationitem, index) => {
                                                          if (index < item.ProductVariation.length - 1) {
                                                            return (
                                                              <div>{variationitem.Value + ","}</div>
                                                            )
                                                          }
                                                          else {
                                                            return (
                                                              <div>{variationitem.Value}</div>
                                                            )
                                                          }
                                                        })
                                                      }
                                                    </div>
                                                    <RateStars className="h-4 text-yellow-600" rateValue={item.AdvertRate} numberColor={"text-yellow-600"} />
                                                    {
                                                      item.DiscountedPrice > 0 ?
                                                        <div className="flex items-center gap-1 mt-2">
                                                          <div className="text-tiny text-gray-700">
                                                            <del>
                                                              {item.ProductPrice % 1 === 0 ?
                                                                <>{fraction.format(item.ProductPrice)} TL </>
                                                                :
                                                                <>{formatter.format(item.ProductPrice)} TL</>
                                                              }
                                                            </del>
                                                          </div>
                                                          <div className="text-base text-black-400 font-medium">
                                                            {item.DiscountedPrice % 1 === 0 ?
                                                              <>{fraction.format(item.DiscountedPrice)} TL </>
                                                              :
                                                              <>{formatter.format(item.DiscountedPrice)} TL</>
                                                            }
                                                          </div>
                                                        </div>
                                                        :
                                                        <div className="flex items-center gap-1 mt-2">
                                                          <div className="text-base text-black-400 font-medium">
                                                            {item.ProductPrice % 1 === 0 ?
                                                              <>{fraction.format(item.ProductPrice)} TL </>
                                                              :
                                                              <>{formatter.format(item.ProductPrice)} TL</>
                                                            }
                                                          </div>
                                                        </div>
                                                    }
                                                  </div>
                                                </div>
                                              ))
                                            }
                                          </div>
                                        }
                                      </div>
                                  }
                                </div>
                              </>
                          }
                        </div>
                      </>
                }
              </>
          }
        </div>
        <div className="flex pt-8">
          <Link className={`${processLoading ? "pointer-events-none" : ""}  ml-auto`} to={{ pathname: `${"/proje-detay/" + (params.id)}`, state: { IsIdeaApproved: IsIdeaApproved } }} >
            <Button isLoading={processLoading} textTiny className="w-24" text="Vazgeç" color="text-gray-400" />
          </Link>
          <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { saveProductToProject(); }} />
        </div>
      </div>
    </div >
  );
}
