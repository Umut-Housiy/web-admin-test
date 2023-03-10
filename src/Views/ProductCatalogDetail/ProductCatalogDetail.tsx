import { FunctionComponent, useContext, useEffect, useState } from "react";
import { ProductDetail } from "./ProductDetail";
import { MemberCartList } from "./MemberCartList";
import { EvaluationList } from "./EvaluationList";
import { QuestionList } from "./QuestionList";
import { VariationList } from "./VariationList";
import { SellerList } from "./SellerList";
import { IdeaList } from "./IdeaList";
import { CampaignList } from "./CampaignList";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { AlertIcon, ChainIcon, ChevronRightIcon, CopyIcon, EditIcon, EyeIcon, EyeOffIcon, SeoIcon } from "../../Components/Icons";
import { Button } from "../../Components/Button";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { TabsTitle } from "../../Components/TabsTitle";
import { useStateEffect } from "../../Components/UseStateEffect"
import { CategoryPropertiesListModel, CategoryPropertyValueListModel, CategoryVariationsListModel, CategoryVariationValueListModel, ProductAdminDetailModel, ProductImageModel, ProductProcessModel } from "../../Models";
import ApiService from "../../Services/ApiService"
import { Modal } from "../../Components/Modal";
import { Image } from "../../Components/Image";
import { Label } from "../../Components/Label";
import { fraction } from "../../Services/Functions";

interface RouteParams {
  id: string
}

interface AdvertGropDataModel {
  name: string,
  value: string
}

interface LocationModel {
  tabId?: number,
  queryPage: number,
}

export const ProductCatalogDetail: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const params = useParams<RouteParams>();

  const location = useLocation<LocationModel>();

  const [loading, setLoading] = useState<boolean>(true);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [productProcessType, setProductProcessType] = useState<string>("");

  const [showMergeProductSelectModal, setShowMergeProductSelectModal] = useState<boolean>(false);

  const [showMergeProductModal, setShowMergeProductModal] = useState<boolean>(false);

  const [showTransferProductSelectModal, setShowTransferProductSelectModal] = useState<boolean>(false);

  const [showTransferProductModal, setShowTransferProductModal] = useState<boolean>(false);

  const [checkBarcode, setCheckBarcode] = useState<string>("");

  const [processProduct, setProcessProduct] = useState<ProductProcessModel>();

  const [selectedTabsId, setSelectedTabsId] = useState<number>(location.state?.tabId ?? 1);

  const tabsLink = [
    { id: 1, name: "??r??n Detay??" },
    { id: 2, name: "Sepete Ekleyen ??yeler" },
    { id: 3, name: "De??erlendirmeler" },
    { id: 4, name: "Soru & Cevaplar" },
    { id: 5, name: "??r??ne Ait Di??er Varyasyonlar" },
    { id: 6, name: "Bu ??r??n?? Satan Sat??c??lar" },
    { id: 7, name: "??r??n??n Kullan??ld?????? Fikirler" },
    { id: 8, name: "??r??n Kampanyalar??" }
  ];

  const [productDetail, setProductDetail] = useState<ProductAdminDetailModel>();

  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const [categoryId, setCategoryId] = useState<number>(0);

  const [mediaList, setMediaList] = useState<ProductImageModel[]>([]);

  const [categoryVariations, setCategoryVariations] = useState<CategoryVariationsListModel[]>([]);

  const [selectedVariations, setselectedVariations] = useState<CategoryVariationValueListModel[]>([]);

  const [categoryProperties, setCategoryProperties] = useState<CategoryPropertiesListModel[]>([]);

  const [selectedProperties, setselectedProperties] = useState<CategoryPropertyValueListModel[]>([]);

  const [groupData, setGroupData] = useState<AdvertGropDataModel[]>([]);

  useEffect(() => {
    getProductDetailForAdmin();
  }, []);

  useStateEffect(() => {
    setCheckBarcode("");
  }, [showMergeProductSelectModal, showTransferProductSelectModal]);

  useStateEffect(async () => {
    var result = await ApiService.getCategoryVariations(categoryId);
    if (result.succeeded) {
      setCategoryVariations(result.data);
    }

    var resultProperties = await ApiService.getCategoryProperties(categoryId);
    if (resultProperties.succeeded) {
      setCategoryProperties(resultProperties.data);
    }
  }, [categoryId]);

  const getProductDetailForAdmin = async () => {
    setLoading(true);
    setProcessLoading(true);

    const _result = await ApiService.getProductDetailForAdmin(Number(params.id ?? "0"));

    if (_result.succeeded === true) {

      setIsEnabled(_result.data.IsEnabled);
      setCategoryId(_result.data.CategoryId);
      setProductDetail(_result.data);
      setMediaList(_result.data.Images);
      try { setselectedVariations(JSON.parse(_result.data.Variations) ?? []); } catch { }
      try { setselectedProperties(JSON.parse(_result.data.Properties) ?? []); } catch { }
      try { setGroupData(JSON.parse(_result.data.GroupData) ?? []); } catch { }

      setLoading(false);
      setProcessLoading(false);
    }
    else {
      setLoading(false);
      setProcessLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push("/urun-ilan-listesi"); }
      });
    }
  }

  const changeProductStatus = () => {
    context.showModal({
      type: "Question",
      title: isEnabled ? "??r??n?? Pasifle??tir" : "??r??n?? Aktifle??tir",
      message: isEnabled ? "??r??n pasifle??tirilecek. Emin misiniz ?" : "??r??n aktifle??tirilecek. Emin misiniz ?",
      onClick: async () => {
        const _result = await ApiService.changeProductStatus(Number(params.id ?? "0"), !isEnabled);

        context.hideModal();

        if (_result.succeeded === true) {
          setIsEnabled(!isEnabled);
          context.showModal({
            type: "Success",
            title: "??r??n durumu de??i??tirildi",
            onClose: () => { context.hideModal(); }
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

  const startMergeProcess = () => {
    setProductProcessType("Merge");
    setShowMergeProductSelectModal(true);
  }

  const startTransferProcess = () => {
    setProductProcessType("Transfer");
    setShowTransferProductSelectModal(true);
  }

  const checkBarcodeExist = async () => {

    setShowMergeProductSelectModal(false);
    setShowTransferProductSelectModal(false);

    if (checkBarcode === "") {
      context.showModal({
        type: "Error",
        message: "L??tfen ikinci ??r??ne ait barkod no giriniz.",
        onClose: () => { context.hideModal(); }
      });
      return;
    }

    setProcessLoading(true);

    const _result = await ApiService.checkBarcodeForProduct(checkBarcode);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      setProcessProduct(_result.data);
      if (productProcessType === "Merge") {
        setShowMergeProductModal(true);
      }
      else if (productProcessType === "Transfer") {
        setShowTransferProductModal(true);
      }
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }

  }

  const mergeProduct = async () => {
    setShowMergeProductModal(false);
    setProcessLoading(true);

    const _result = await ApiService.mergeProduct(processProduct?.Id ?? 0, Number(params.id ?? "0"));

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "??r??n birle??tirildi.",
        onClose: () => { context.hideModal(); }
      });

    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }
  }

  const transferProduct = async () => {
    setShowTransferProductModal(false);
    setProcessLoading(true);

    const _result = await ApiService.changeProductBarcode(productDetail?.ProductId ?? 0, "", processProduct?.ModelNo ?? "");

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "??r??n transfer edildi.",
        onClose: () => { context.hideModal(); }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }
  }

  //#region Seo
  const [showSeoModal, setShowSeoModal] = useState<boolean>(false);

  const [seoTitle, setSeoTitle] = useState<string>("");

  const [seoDescription, setSeoDescription] = useState<string>("");

  const handleOpenSeoModal = () => {
    setSeoTitle(productDetail?.SeoTitle ?? "");
    setSeoDescription(productDetail?.SeoDescription ?? "");
    setShowSeoModal(true);
  }

  const updateSingleProductSeo = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateSingleProductSeo(Number(params.id ?? "0"), seoTitle, seoDescription);

    setProcessLoading(false);
    setShowSeoModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Seo bilgileri g??ncellenmi??tir",
        onClose: () => { context.hideModal(); getProductDetailForAdmin(); }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setShowSeoModal(true); }
      });
    }
  }
  //#endregion

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to={`${location.state?.queryPage !== 1 ? `/urun-katalogu?sayfa=${location.state?.queryPage ?? 1}` : "/urun-katalogu"}`} className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            ??r??n Katalogu
          </div>
        </Link>
        <div className="flex gap-2 align-items-center mb-6">
          <h2>??r??n Bilgisi</h2>
          <Button isLoading={processLoading} textTiny className="w-60 ml-auto" buttonSm design="button-blue-400" text="??r??n Bilgileri D??zenle" hasIcon icon={<EditIcon className="icon-sm mr-2" />} onClick={() => { history.push(`/urun-duzenle/${Number(params.id ?? "0")}`); }} />
          <Button isLoading={processLoading} textTiny className="w-48 text-blue-400" buttonSm design="button-blue-100" text="??r??n?? Birle??tir" hasIcon icon={<ChainIcon className="icon-sm mr-2" />} onClick={() => { startMergeProcess(); }} />
          <Button isLoading={processLoading} textTiny className="w-48 text-blue-400" buttonSm design="button-blue-100" text="??r??n?? Transfer Et" hasIcon icon={<CopyIcon className="icon-sm mr-2" />} onClick={() => { startTransferProcess(); }} />
          <Button isLoading={processLoading} textTiny className="w-36" buttonSm design="button-gray-100" text={"SEO"} hasIcon icon={<SeoIcon className="icon-sm mr-2" />} onClick={() => { handleOpenSeoModal(); }} />
          <Button isLoading={processLoading} textTiny className="w-60" buttonSm design="button-gray-100" text={isEnabled ? "??r??n?? Pasife Al" : "??r??n?? Aktifle??tir"} hasIcon icon={!isEnabled ? <EyeOffIcon className="icon-sm mr-2" /> : <EyeIcon className="icon-sm mr-2" />} onClick={() => { changeProductStatus(); }} />
        </div>
        <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id); }} />
        {
          selectedTabsId === 1 ?
            <>
              <ProductDetail loading={loading} productDetail={productDetail} IsEnabled={isEnabled} mediaList={mediaList} categoryFeatures={categoryProperties} categoryVariations={categoryVariations} productFeatures={selectedProperties} productVariations={selectedVariations} groupData={groupData} />
            </>
            :
            selectedTabsId === 2 ?
              <>
                <MemberCartList productId={Number(params.id ?? "0")} />
              </>
              :
              selectedTabsId === 3 ?
                <>
                  <EvaluationList id={Number(params.id ?? "0")} />
                </>
                :
                selectedTabsId === 4 ?
                  <>
                    <QuestionList productId={Number(params.id ?? "0")} />
                  </>
                  :
                  selectedTabsId === 5 ?
                    <>
                      <VariationList productId={Number(params.id ?? "0")} />
                    </>
                    :
                    selectedTabsId === 6 ?
                      <>
                        <SellerList productId={Number(params.id ?? "0")} />
                      </>
                      :
                      selectedTabsId === 7 ?
                        <>
                          <IdeaList productId={Number(params.id ?? "0")} />
                        </>
                        :
                        selectedTabsId === 8 ?
                          <>
                            <CampaignList productId={Number(params.id ?? "0")} />
                          </>
                          :
                          <></>
        }
      </div>
      <Modal
        modalType="fixedMd"
        showModal={showMergeProductSelectModal}
        onClose={() => { setShowMergeProductSelectModal(false); }}
        title="??r??n Birle??tir"
        body={
          <>
            <div>
              <div className="text-sm font-medium text-gray-700">Se??ili ??r??n - 1</div>
              <div className="w-full flex gap-4">
                <Image className="w-32 h-32 object-contain my-auto" src={productDetail?.ProductMainPhoto ?? ""} alt={productDetail?.ProductName ?? "-"} />
                <div className="w-full">
                  <div className="mt-2 text-sm font-medium text-gray-900">{productDetail?.ProductName}</div>
                  <div className="mt-2 text-sm text-gray-900">{"Barkod No: " + productDetail?.BarcodeNo}</div>
                  <div className="mt-2 text-sm text-gray-900">{"Model No: " + productDetail?.ModelNo}</div>
                  <div className="mt-2 pt-2 text-sm text-gray-900 border-t border-gray-300">{"BUYBOX Fiyat?? (KDV Dahil): " + fraction.format(productDetail?.BuyboxPrice ?? 0) + " TL"}</div>
                </div>
              </div>
              <div className="mt-2 py-2 border-t border-gray-300">
                <Label title="Birle??tirilecek ??r??n Barkod Numaras??" withoutDots />
                <input className="form-input" placeholder="??kinci ??r??ne ait barkod no giriniz" value={checkBarcode} onChange={(e) => { setCheckBarcode(e.target.value); }} />
              </div>
            </div>
          </>
        }
        footer={
          <div className="w-full flex gap-2 pt-2">
            <Button isLoading={processLoading} textTiny className="w-1/2" design="button-gray-100" text="Vazge??" onClick={() => { setShowMergeProductSelectModal(false); }} />
            <Button isLoading={processLoading} textTiny className="w-1/2 " design="button-blue-400" text="Birle??tirme ????lemini Ba??lat" onClick={() => { checkBarcodeExist(); }} />
          </div>
        }
      />
      <Modal
        modalType="fixedMd"
        showModal={showMergeProductModal}
        onClose={() => { setShowMergeProductModal(false); }}
        title="??r??n Birle??tir"
        body={
          <>
            <div>
              <div className="text-sm text-gray-900">
                Se??ili ??r??nler birle??tirilecektir. Bu birle??tirme sonucunda ??r??nler tek ??r??n olarak ??r??n katalo??una eklenecektir. Bu i??lemi onayl??yor musunuz?
              </div>
              <div className="text-sm text-red-400 flex gap-2 my-6">
                <AlertIcon className="icon-sm" />
                <div>Bu i??lem geri al??namaz.</div>
              </div>
              <div className="mb-4">
                <h4>Birle??tirilecek ??r??nler</h4>
              </div>
              <div className="w-full flex gap-4">
                <div className="w-1/2 border-t border-gray-300 pt-4">
                  <div className="text-sm font-medium text-gray-700">Se??ili ??r??n - 1</div>
                  <div className="w-full flex gap-4">
                    <Image className="w-32 h-32 object-contain my-auto" src={productDetail?.ProductMainPhoto ?? ""} alt={productDetail?.ProductName ?? "-"} />
                    <div className="w-full">
                      <div className="mt-2 text-sm font-medium text-gray-900">{productDetail?.ProductName}</div>
                      <div className="mt-2 text-sm text-gray-900">{"Barkod No: " + productDetail?.BarcodeNo}</div>
                      <div className="mt-2 text-sm text-gray-900">{"Model No: " + productDetail?.ModelNo}</div>
                      <div className="mt-2 pt-2 text-sm text-gray-900 border-t border-gray-300">{"BUYBOX Fiyat?? (KDV Dahil): " + fraction.format(productDetail?.BuyboxPrice ?? 0) + " TL"}</div>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 border-t border-gray-300 pt-4">
                  <div className="text-sm font-medium text-gray-700">Se??ili ??r??n - 2</div>
                  <div className="w-full flex gap-4">
                    <Image className="w-32 h-32 object-contain my-auto" src={processProduct?.MainPhotoUrl ?? ""} alt={processProduct?.Name ?? "-"} />
                    <div className="w-full">
                      <div className="mt-2 text-sm font-medium text-gray-900">{processProduct?.Name}</div>
                      <div className="mt-2 text-sm text-gray-900">{"Barkod No: " + processProduct?.BarcodeNo}</div>
                      <div className="mt-2 text-sm text-gray-900">{"Model No: " + processProduct?.ModelNo}</div>
                      <div className="mt-2 pt-2 text-sm text-gray-900 border-t border-gray-300">{"BUYBOX Fiyat?? (KDV Dahil): " + fraction.format(processProduct?.BuyboxPrice ?? 0) + " TL"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
        footer={
          <div className="w-full flex gap-2 pt-2">
            <Button isLoading={processLoading} textTiny className="w-1/2" design="button-gray-100" text="Vazge??" onClick={() => { setShowMergeProductModal(false); }} />
            <Button isLoading={processLoading} textTiny className="w-1/2 " design="button-blue-400" text="Onayla ve Birle??tir" onClick={() => { mergeProduct(); }} />
          </div>
        }
      />
      <Modal
        modalType="fixedMd"
        showModal={showTransferProductSelectModal}
        onClose={() => { setShowTransferProductSelectModal(false); }}
        title="??r??n Transfer Et"
        body={
          <>
            <div>
              <div className="text-sm font-medium text-gray-700">Se??ili ??r??n - 1</div>
              <div className="w-full flex gap-4">
                <Image className="w-32 h-32 object-contain my-auto" src={productDetail?.ProductMainPhoto ?? ""} alt={productDetail?.ProductName ?? "-"} />
                <div className="w-full">
                  <div className="mt-2 text-sm font-medium text-gray-900">{productDetail?.ProductName}</div>
                  <div className="mt-2 text-sm text-gray-900">{"Barkod No: " + productDetail?.BarcodeNo}</div>
                  <div className="mt-2 text-sm text-gray-900">{"Model No: " + productDetail?.ModelNo}</div>
                  <div className="mt-2 pt-2 text-sm text-gray-900 border-t border-gray-300">{"BUYBOX Fiyat?? (KDV Dahil): " + productDetail?.BuyboxPrice + " TL"}</div>
                </div>
              </div>
              <div className="mt-2 py-2 border-t border-gray-300">
                <Label title="Se??ili ??r??ne transfer edilecek ??r??n??n barkodunu giriniz." withoutDots />
                <input className="form-input" placeholder="??kinci ??r??ne ait barkod no giriniz" value={checkBarcode} onChange={(e) => { setCheckBarcode(e.target.value); }} />
              </div>
            </div>
          </>
        }
        footer={
          <div className="w-full flex gap-2 pt-2">
            <Button isLoading={processLoading} textTiny className="w-1/2" design="button-gray-100" text="Vazge??" onClick={() => { setShowTransferProductSelectModal(false); }} />
            <Button isLoading={processLoading} textTiny className="w-1/2 " design="button-blue-400" text="Transfer ????lemini Ba??lat" onClick={() => { checkBarcodeExist(); }} />
          </div>
        }
      />
      <Modal
        modalType="fixedMd"
        showModal={showTransferProductModal}
        onClose={() => { setShowTransferProductModal(false); }}
        title="??r??n Transfer Et"
        body={
          <>
            <div>
              <div className="text-sm text-gray-900">
                Se??ili ikinci ??r??n birinci ??r??ne varyasyon olarak eklenecektir.
              </div>
              <div className="text-sm text-red-400 flex gap-2 my-6">
                <AlertIcon className="icon-sm" />
                <div>Bu i??lem geri al??namaz.</div>
              </div>
              <div className="mb-4">
                <h4>Birle??tirilecek ??r??nler</h4>
              </div>
              <div className="w-full flex gap-4">
                <div className="w-1/2 border-t border-gray-300 pt-4">
                  <div className="text-sm font-medium text-gray-700">Se??ili ??r??n - 1</div>
                  <div className="w-full flex gap-4">
                    <Image className="w-32 h-32 object-contain my-auto" src={productDetail?.ProductMainPhoto ?? ""} alt={productDetail?.ProductName ?? "-"} />
                    <div className="w-full">
                      <div className="mt-2 text-sm font-medium text-gray-900">{productDetail?.ProductName}</div>
                      <div className="mt-2 text-sm text-gray-900">{"Barkod No: " + productDetail?.BarcodeNo}</div>
                      <div className="mt-2 text-sm text-gray-900">{"Model No: " + productDetail?.ModelNo}</div>
                      <div className="mt-2 pt-2 text-sm text-gray-900 border-t border-gray-300">{"BUYBOX Fiyat?? (KDV Dahil): " + fraction.format(productDetail?.BuyboxPrice ?? 0) + " TL"}</div>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 border-t border-gray-300 pt-4">
                  <div className="text-sm font-medium text-gray-700">Se??ili ??r??n - 2</div>
                  <div className="w-full flex gap-4">
                    <Image className="w-32 h-32 object-contain my-auto" src={processProduct?.MainPhotoUrl ?? ""} alt={processProduct?.Name ?? "-"} />
                    <div className="w-full">
                      <div className="mt-2 text-sm font-medium text-gray-900">{processProduct?.Name}</div>
                      <div className="mt-2 text-sm text-gray-900">{"Barkod No: " + processProduct?.BarcodeNo}</div>
                      <div className="mt-2 text-sm text-gray-900">{"Model No: " + processProduct?.ModelNo}</div>
                      <div className="mt-2 pt-2 text-sm text-gray-900 border-t border-gray-300">{"BUYBOX Fiyat?? (KDV Dahil): " + fraction.format(processProduct?.BuyboxPrice ?? 0) + " TL"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
        footer={
          <div className="w-full flex gap-2 pt-2">
            <Button isLoading={processLoading} textTiny className="w-1/2" design="button-gray-100" text="Vazge??" onClick={() => { setShowTransferProductModal(false); }} />
            <Button isLoading={processLoading} textTiny className="w-1/2 " design="button-blue-400" text="Onayla ve Transfer Et" onClick={() => { transferProduct(); }} />
          </div>
        }
      />
      <Modal
        modalType="fixedSm"
        showModal={showSeoModal}
        onClose={() => { setShowSeoModal(false); }}
        title="SEO Bilgileri"
        body={
          <div>
            <Label withoutDots title="??r??n Ad??" className="mt-4" />
            <div className="text-sm text-gray-900">{productDetail?.Name}</div>
            <Label isRequired withoutDots title="Title" className="mt-4" />
            <input className="form-input" type="text" value={seoTitle} onChange={(e) => { setSeoTitle(e.target.value); }} />
            <Label isRequired withoutDots title="Description" className="mt-4" />
            <input className="form-input" type="text" value={seoDescription} onChange={(e) => { setSeoDescription(e.target.value); }} />
          </div>
        }
        footer={
          <Button className="w-full" isLoading={processLoading} design="button-blue-400" text="Kaydet" onClick={() => { updateSingleProductSeo(); }}></Button>
        }
      />
    </div>
  )
}
