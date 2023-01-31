import { FunctionComponent, useContext, useEffect, useState } from "react";
import { ProductDetail } from "./ProductDetail";
import { SellInformation } from "./SellInformation";
import { CampaignList } from "./CampaignList";
import { OtherSellerList } from "./OtherSellerList";
import { QuestionList } from "./QuestionList";
import { SellerVariationList } from "./SellerVariationList";
import { EvaluationList } from "./EvaluationList";
import { MemberCartList } from "./MemberCartList";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { ChevronRightIcon, EditIcon, EyeOffIcon, EyeIcon, MagnifyGlassIcon } from "../../Components/Icons";
import { Button } from "../../Components/Button";
import { TabsTitle } from "../../Components/TabsTitle";
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { CategoryPropertiesListModel, CategoryPropertyValueListModel, CategoryVariationsListModel, CategoryVariationValueListModel, ProductAdminDetailModel, ProductImageModel } from "../../Models";
import { useStateEffect } from "../../Components/UseStateEffect";

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

export const ProductAdvertDetail: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const location = useLocation<LocationModel>();

  const history = useHistory();

  const params = useParams<RouteParams>();

  const [loading, setLoading] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [showProduct, setShowProduct] = useState<boolean>(false);

  const [selectedTabsId, setSelectedTabsId] = useState<number>(location.state?.tabId ?? 1);

  const tabsLink = [
    { id: 1, name: "Ürün Detayı" },
    { id: 2, name: "Satış Bilgileri" },
    { id: 3, name: "Sepete ekleyen Üyeler" },
    { id: 4, name: "Değerlendirmeler" },
    { id: 5, name: "Soru & Cevaplar" },
    { id: 6, name: "Satıcıya Ait Diğer Varyasyonlar" },
    { id: 7, name: "Bu Ürünü Satan Diğer Satıcılar" },
    { id: 8, name: "Ürün Kampanyaları" }
  ];

  const [advertDetail, setAdvertDetail] = useState<ProductAdminDetailModel>();

  const [categoryId, setCategoryId] = useState<number>(0);

  const [mediaList, setMediaList] = useState<ProductImageModel[]>([]);

  const [categoryVariations, setCategoryVariations] = useState<CategoryVariationsListModel[]>([]);

  const [selectedVariations, setselectedVariations] = useState<CategoryVariationValueListModel[]>([]);

  const [categoryProperties, setCategoryProperties] = useState<CategoryPropertiesListModel[]>([]);

  const [selectedProperties, setselectedProperties] = useState<CategoryPropertyValueListModel[]>([]);

  const [groupData, setGroupData] = useState<AdvertGropDataModel[]>([]);

  useEffect(() => {
    getAdvertDetailForAdmin();
  }, []);

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

  const getAdvertDetailForAdmin = async () => {
    setLoading(true);
    setProcessLoading(true);

    const _result = await ApiService.getAdvertDetailForAdmin(Number(params.id ?? "0"));

    if (_result.succeeded === true) {

      setCategoryId(_result.data.CategoryId);
      setAdvertDetail(_result.data);
      setShowProduct(_result.data.AdvertDetail.ShowProduct);
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

  const suspendAdvert = () => {
    context.showModal({
      type: "Question",
      title: showProduct ? "Pasifleştir" : "Aktifleştir",
      message: showProduct ? "İlanı pasif duruma geçirmek istediğinizden emin misiniz?" : "İlanı aktif duruma geçirmek istediğinizden emin misiniz?",
      onClick: async () => {
        const _result = await ApiService.suspendAdvert(Number(params.id ?? "0"), !showProduct);

        context.hideModal();

        if (_result.succeeded === true) {
          setShowProduct(!showProduct);
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
      onClose: () => { context.hideModal(); }
    })
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to={`${location.state?.queryPage !== 1 ? `/urun-ilan-listesi?sayfa=${location.state?.queryPage ?? 1}` : "/urun-ilan-listesi"}`} className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            Ürün İlan Listesi
          </div>
        </Link>
        <div className="flex gap-2 align-items-center mb-6">
          <h2>Ürün İlan Bilgisi</h2>
          <Button isLoading={processLoading} textTiny className="ml-auto w-48 text-blue-400" buttonSm design="button-blue-100" text="Ürünü İncele" hasIcon icon={<MagnifyGlassIcon className="icon-sm mr-2" />} onClick={() => { history.push(`/urun-detay/${advertDetail?.ProductId}`); }} />
          <Button isLoading={processLoading} textTiny className="w-60 " buttonSm design="button-blue-400" text="İlan Bilgileri Düzenle" hasIcon icon={<EditIcon className="icon-sm mr-2" />} onClick={() => { history.push(`/urun-ilan-duzenle/${Number(params.id ?? "0")}`); }} />
          <Button isLoading={processLoading} textTiny className="w-60" buttonSm design="button-gray-100" text={showProduct ? "İlanı Pasife Al" : "İlanı Aktifleştir"} hasIcon icon={
            showProduct ?
              <EyeOffIcon className="icon-sm mr-2" />
              :
              <EyeIcon className="icon-sm mr-2" />
          } onClick={() => { suspendAdvert(); }} />
        </div>
        <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id); }} />
        {
          selectedTabsId === 1 ?
            <>
              <ProductDetail loading={loading} advertDetail={advertDetail} mediaList={mediaList} categoryFeatures={categoryProperties} categoryVariations={categoryVariations} advertFeatures={selectedProperties} advertVariations={selectedVariations} groupData={groupData} />
            </>
            :
            selectedTabsId === 2 ?
              <>
                <SellInformation loading={loading} advertDetail={advertDetail} showProduct={showProduct} />
              </>
              :
              selectedTabsId === 3 ?
                <>
                  <MemberCartList advertId={Number(params.id ?? 0)} />
                </>
                :
                selectedTabsId === 4 ?
                  <>
                    <EvaluationList id={Number(params.id ?? 0)} />
                  </>
                  :
                  selectedTabsId === 5 ?
                    <>
                      <QuestionList advertId={Number(params.id ?? 0)} />
                    </>
                    :
                    selectedTabsId === 6 ?
                      <>
                        <SellerVariationList advertId={Number(params.id ?? 0)} />
                      </>
                      :
                      selectedTabsId === 7 ?
                        <>
                          <OtherSellerList advertId={Number(params.id ?? 0)} />
                        </>
                        :
                        selectedTabsId === 8 ?
                          <>
                            <CampaignList advertId={Number(params.id ?? 0)} />
                          </>
                          :
                          <></>
        }
      </div>
    </div>
  )
}
