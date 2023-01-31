import { FunctionComponent, useContext, useEffect, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { Button } from "../../Components/Button";
import { ChevronRightIcon, EditIcon, TrashIcon } from "../../Components/Icons";
import { useStateEffect } from "../../Components/UseStateEffect";
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { Image } from "../../Components/Image";
import { Label } from "../../Components/Label";
import { TabsTitle } from "../../Components/TabsTitle";
import { DetailTabForProduct } from "../../Components/Lists/DetailTabs/DetailTabForProduct";
import { DetailTabForProductCategory } from "../../Components/Lists/DetailTabs/DetailTabForProductCategory";
import { DetailTabForProfessional } from "../../Components/Lists/DetailTabs/DetailTabForProfessional";
import { DetailTabForPofessionalCategory } from "../../Components/Lists/DetailTabs/DetailTabForProfessionalCategory";
import { DetailTabForIdea } from "../../Components/Lists/DetailTabs/DetailTabsForIdea";
import { DetailTabForIdeaCategory } from "../../Components/Lists/DetailTabs/DetailTabForIdeaCategory";
import { DetailTabForBlog } from "../../Components/Lists/DetailTabs/DetailTabForBlog";
import { DetailTabForBlockImages } from "../../Components/Lists/DetailTabs/DetailTabForBlockImages";
import { DetailTab3Placement } from "../../Components/Lists/DetailTabs/DetailTab3Placement";
import { Loading } from "../../Components/Loading";
import { DetailTabForContent } from "../../Components/Lists/DetailTabs/DetailTabForContent";

interface RouteParams {
  id: string
}
interface LocationModel {
  queryPage: number,
}

export const ListDetail: FunctionComponent = () => {
  const listTypes = [
    { key: "1", value: "Ürün" },
    { key: "2", value: "Kategori (Ürün)" },
    { key: "3", value: "Profesyonel" },
    { key: "4", value: "Kategori (Profesyonel)" },
    { key: "5", value: "Fikir" },
    { key: "9", value: "Kategori (Fikir)" },
    { key: "6", value: "Ürün-Fikir" },
    { key: "7", value: "Blog" },
    { key: "8", value: "Blok Görsel" },
    { key: "10", value: "İçerik" }
  ];

  //ürün tipleri
  const shownTypeForProduct = [
    { key: "1", value: "Tip 1", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/urun-liste-tip-1.png" },
    { key: "2", value: "Tip 2", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/urun-liste-tip-2.png" },
    { key: "3", value: "Tip 3", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/urun-liste-tip-3.png" },
    { key: "4", value: "Tip 4", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/urun-liste-tip-4.png" },
    { key: "5", value: "Tip 5", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/urun-liste-tip-5.png" },
  ];

  //kategori(ürün) tipleri
  const shownTypeForProductCategory = [
    { key: "1", value: "Tip 1", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-urun-liste-tip-1.png" },
    { key: "2", value: "Tip 2", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-urun-liste-tip-2.png" },
    { key: "3", value: "Tip 3", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-urun-liste-tip-3.png" },
    { key: "4", value: "Tip 4", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-urun-liste-tip-4.png" },
    { key: "5", value: "Tip 5", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-urun-liste-tip-5.png" },
    { key: "9", value: "Tip 9", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-urun-liste-tip-9.png" },
    { key: "10", value: "Tip 10", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-urun-liste-tip-10.png" },
    { key: "11", value: "Tip 11", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-urun-liste-tip-11.png" },
  ];

  //profesyonel tipleri
  const shownTypeForProfessional = [
    { key: "1", value: "Tip 1", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/pro-liste-tip-1.png" },
    { key: "2", value: "Tip 2", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/pro-liste-tip-2.png" },
    { key: "3", value: "Tip 3", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/pro-liste-tip-3.png" },
    { key: "4", value: "Tip 4", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/pro-liste-tip-4.png" },
    { key: "5", value: "Tip 5", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/pro-liste-tip-5.png" },
  ];

  //kategori(profesyonel) tipleri
  const shownTypeForProfessionalCategory = [
    { key: "1", value: "Tip 1", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-pro-liste-tip-1.png" },
    { key: "2", value: "Tip 2", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-pro-liste-tip-2.png" },
    { key: "3", value: "Tip 3", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-pro-liste-tip-3.png" },
    { key: "4", value: "Tip 4", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-pro-liste-tip-4.png" },
    { key: "5", value: "Tip 5", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-pro-liste-tip-5.png" },
    { key: "9", value: "Tip 9", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-pro-liste-tip-9.png" },
    { key: "10", value: "Tip 10", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-pro-liste-tip-10.png" },
    { key: "11", value: "Tip 11", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-pro-liste-tip-11.png" },
  ];

  //fikir tipleri
  const shownTypeForIdea = [
    { key: "1", value: "Tip 1", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/fikir-liste-tip-1.png" },
    { key: "2", value: "Tip 2", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/fikir-liste-tip-2.png" },
    { key: "3", value: "Tip 3", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/fikir-liste-tip-3.png" },
    { key: "4", value: "Tip 4", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/fikir-liste-tip-4.png" },
    { key: "5", value: "Tip 5", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/fikir-liste-tip-5.png" },
    { key: "12", value: "Tip 12", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/fikir-liste-tip-12.png" },
  ];

  //kategori(fikir) tipleri
  const shownTypeForIdeaCategory = [
    { key: "1", value: "Tip 1", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-fikir-liste-tip-1.png" },
    { key: "2", value: "Tip 2", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-fikir-liste-tip-2.png" },
    { key: "3", value: "Tip 3", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-fikir-liste-tip-3.png" },
    { key: "4", value: "Tip 4", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-fikir-liste-tip-4.png" },
    { key: "5", value: "Tip 5", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-fikir-liste-tip-5.png" },
    { key: "9", value: "Tip 9", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-fikir-liste-tip-9.png" },
    { key: "10", value: "Tip 10", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-fikir-liste-tip-10.png" },
    { key: "11", value: "Tip 11", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-fikir-liste-tip-11.png" },
  ];

  //ürün-fikir tipleri
  const shownTypeForProductIdea = [
    { key: "6", value: "Tip 6", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/urun-fikir-liste-tip-6.png" },
  ];

  //blog tipleri
  const shownTypeForBlog = [
    { key: "1", value: "Tip 1", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/blog-liste-tip-1.png" },
    { key: "2", value: "Tip 2", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/blog-liste-tip-2.png" },
    { key: "3", value: "Tip 3", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/blog-liste-tip-3.png" },
    { key: "4", value: "Tip 4", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/blog-liste-tip-4.png" },
    { key: "5", value: "Tip 5", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/blog-liste-tip-5.png" },
  ];

  //blok görsel tipleri
  const shownTypeForBlockImage = [
    { key: "1", value: "Tip 1", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/blog-gorsel-liste-tip-1.png" },
    { key: "2", value: "Tip 2", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/blog-gorsel-liste-tip-2.png" },
    { key: "3", value: "Tip 3", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/blog-gorsel-liste-tip-3.png" },
    { key: "4", value: "Tip 4", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/blog-gorsel-liste-tip-4.png" },
    { key: "5", value: "Tip 5", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/blog-gorsel-liste-tip-5.png" },
    { key: "7", value: "Tip 7", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/blog-gorsel-liste-tip-7.png" },
    { key: "8", value: "Tip 8", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/blog-gorsel-liste-tip-8.png" },
  ]

  // icerik tipleri
  const shownTypeForContent = [
    { key: "13", value: "Tip 13", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/icerik-liste-tip-13.png" },
    { key: "14", value: "Tip 14", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/icerik-liste-tip-14.png" },
  ]

  const tabsLink = [
    { id: 1, name: "Liste Bilgileri" },
    { id: 2, name: "Liste İçeriği" },
    { id: 3, name: "Liste Yerleşimleri" }
  ];
  const [selectedTabsId, setSelectedTabsId] = useState<number>(1);

  const params = useParams<RouteParams>();

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const location = useLocation<LocationModel>();

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [selectedType, setSelectedType] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz" })

  const [shownType, setShownType] = useState<number>(0);

  const [selectedShownType, setSelectedShownType] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz" })

  const [selectedPhoto, setSelectedPhoto] = useState<string>("");

  const [title, setTitle] = useState<string>("");

  const [buttonTitle, setButtonTitle] = useState<string>("");

  const [buttonUrl, setButtonUrl] = useState<string>("");

  const [description, setDescription] = useState<string>("");

  const [canSellerPromote, setCanSellerPromote] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [oneDaySellerPromotePrice, setOneDaySellerPromotePrice] = useState<string>("");

  const [threeDaySellerPromotePrice, setThreeDaySellerPromotePrice] = useState<string>("");

  const [sevenDaySellerPromotePrice, setSevenDaySellerPromotePrice] = useState<string>("");

  const [fourteenDaySellerPromotePrice, setFourteenDaySellerPromotePrice] = useState<string>("");

  const [productName, setProductName] = useState<string>("");

  const [productPhoto, setProductPhoto] = useState<string>("");

  const [productBarcode, setProductBarcode] = useState<string>("");

  const [productId, setProductId] = useState<number>(0);

  const returnListTypes = () => {
    switch (Number(selectedType.key)) {
      case 1: return shownTypeForProduct
      case 2: return shownTypeForProductCategory
      case 3: return shownTypeForProfessional
      case 4: return shownTypeForProfessionalCategory
      case 5: return shownTypeForIdea
      case 9: return shownTypeForIdeaCategory
      case 6: return shownTypeForProductIdea
      case 7: return shownTypeForBlog
      case 8: return shownTypeForBlockImage
      case 10: return shownTypeForContent
    }
  }

  useEffect(() => {
    getDynamicListDetail();
  }, []);

  useStateEffect(() => {
    returnListTypes()
  }, [selectedType]);

  useStateEffect(() => {
    setSelectedShownType(
      {
        key: returnListTypes()?.find(i => i.key === String(shownType))?.key ?? "0",
        value: returnListTypes()?.find(i => i.key === String(shownType))?.value ?? "Seçiniz"
      }
    )
    setSelectedPhoto(returnListTypes()?.find(i => i.key === String(shownType))?.photo ?? "")

  }, [shownType]);


  const getDynamicListDetail = async () => {
    setLoading(true);

    const _result = await ApiService.getDynamicListDetail(Number(params.id))

    if (_result.succeeded === true) {
      const d = _result.data
      setSelectedType(listTypes.find(i => i.key === String(d.Type)) ?? { key: "0", value: "Seçiniz" })
      setShownType(d.ShownType)
      setTitle(d.Title)
      setButtonTitle(d.ButtonTitle)
      setButtonUrl(d.ButtonUrl)
      setDescription(d.Description)
      setCanSellerPromote(d.CanSellerPromote);
      if (d.OneDaySellerPromotePrice === null) {
        setOneDaySellerPromotePrice("");
      }
      else {
        setOneDaySellerPromotePrice(d.OneDaySellerPromotePrice);
      }
      if (d.ThreeDaySellerPromotePrice === null) {
        setThreeDaySellerPromotePrice("");
      }
      else {
        setThreeDaySellerPromotePrice(d.ThreeDaySellerPromotePrice);
      }
      if (d.SevenDaySellerPromotePrice === null) {
        setSevenDaySellerPromotePrice("");
      }
      else {
        setSevenDaySellerPromotePrice(d.SevenDaySellerPromotePrice);
      }
      if (d.FourteenDaySellerPromotePrice === null) {
        setFourteenDaySellerPromotePrice("");
      }
      else {
        setFourteenDaySellerPromotePrice(d.FourteenDaySellerPromotePrice);
      }
      setProductName(d.ProductName)
      setProductPhoto(d.ProductPhoto)
      setProductBarcode(d.ProductBarcode)
      setProductId(d.ProductId)
      setLoading(false);
    }
    else {
      setLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push('/olusturulan-listeler') }
      });
    }
  }

  const showDeleteModal = () => {
    context.showModal({
      type: "Question",
      title: "Listeyi Sil",
      message: `Listeyi silmek istediğinize emin misiniz?`,
      onClick: async () => {
        const _result = await ApiService.deleteDynamicList(Number(params.id));

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Liste başarıyla silindi",
            onClose: () => {
              context.hideModal();
              history.push('/olusturulan-listeler')
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
    if (selectedTabsId === 2) {
      returnTabs2();
    }
  }, [selectedTabsId])


  const returnTabs2 = () => {
    switch (Number(selectedType.key)) {
      case 1: return <DetailTabForProduct DynamicListId={Number(params.id)} />
      case 2: return <DetailTabForProductCategory DynamicListId={Number(params.id)} />
      case 3: return <DetailTabForProfessional DynamicListId={Number(params.id)} />
      case 4: return <DetailTabForPofessionalCategory DynamicListId={Number(params.id)} />
      case 5: return <DetailTabForIdea DynamicListId={Number(params.id)} />
      case 9: return <DetailTabForIdeaCategory DynamicListId={Number(params.id)} />
      case 6: return <DetailTabForIdea DynamicListId={Number(params.id)} />
      case 7: return <DetailTabForBlog DynamicListId={Number(params.id)} />
      case 8: return <DetailTabForBlockImages shownType={shownType} DynamicListId={Number(params.id)} />
      case 10: return <DetailTabForContent DynamicListId={Number(params.id)} />
    }
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to={`${location.state?.queryPage !== 1 ? `/olusturulan-listeler?sayfa=${location.state?.queryPage ?? 1}` : "/olusturulan-listeler"}`} className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            Oluşturulan Listeler
          </div>
        </Link>
        <div className="flex justify-between mb-4">
          <h2>Liste Detayı</h2>
          <div className="flex gap-2">
            <Button buttonMd onClick={() => history.push(`/liste-duzenle/${params.id}`)} hasIcon icon={<EditIcon className="icon-sm mr-2" />} text="Liste Bilgilerini Düzenle" design="button-blue-400 px-4 " />
            <Button buttonMd onClick={() => showDeleteModal()} hasIcon icon={<TrashIcon className="icon-sm mr-2" />} text="Listeyi Sil" design="button-gray-100 px-4 " />
          </div>
        </div>
        <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id) }} />
        {selectedTabsId === 1 ?
          <>
            {loading === true ? <Loading height="h-40" width="w-1/3" className="my-4" /> :
              <Image src={selectedPhoto} key={selectedPhoto} className="w-full my-4 max-h-40" />
            }
            <div className="w-2/5">
              <Label loading={loading} title="Oluşturulan Liste Türü" desc={selectedType.value} />
              <Label loading={loading} title="Gösterim Tipi" desc={selectedShownType.value} />
              <Label loading={loading} title="Liste Başlığı" desc={title !== "" ? title : "-"} />
              <Label loading={loading} title="Buton Başlığı" desc={buttonTitle !== "" ? buttonTitle : "-"} />
              <Label loading={loading} title="Buton URL" desc={buttonUrl !== "" ? buttonUrl : "-"} />
              <Label loading={loading} title="Sponsorlu Eklenebilir" desc={canSellerPromote === true ? "Evet" : "Hayır"} />
              <Label loading={loading} title="Açıklama" desc={description !== "" ? description : "-"} />
              {canSellerPromote === true &&
                <>
                  <Label loading={loading} title="1 Günlük Ücreti" desc={oneDaySellerPromotePrice} endCharacter="₺" />
                  <Label loading={loading} title="3 Günlük Ücreti" desc={threeDaySellerPromotePrice} endCharacter="₺" />
                  <Label loading={loading} title="7 Günlük Ücreti" desc={sevenDaySellerPromotePrice} endCharacter="₺" />
                  <Label loading={loading} title="14 Günlük Ücreti" desc={fourteenDaySellerPromotePrice} endCharacter="₺" />
                </>
              }
            </div>
            {(selectedType.key === "6") &&
              <div className="w-1/2">
                <h4 className="my-4">İlişkili Ana Ürün</h4>
                <div className=" lg:grid-cols-5 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                  <div className="lg:col-span-2 flex items-center">
                    <span className="text-sm text-gray-700 font-medium">
                      Ürün Adı
                    </span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="text-sm text-gray-700 font-medium">
                      Barkod
                    </span>
                  </div>
                </div>
                <div className="lg:grid-cols-5 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
                  <div className="lg:col-span-2 flex lg:block items-center flex items-center">
                    <span className="text-sm text-gray-700 font-medium lg:hidden mr-2">Ürün Adı</span>
                    <div className="flex items-center">
                      <Image key={productId} src={productName} alt={productPhoto} className="w-12 h-12 mr-2 max-h-12 min-h-12 object-contain" />
                      <span className="font-medium text-sm text-gray-900 line-clamp-2 block ">
                        {productName}
                      </span>
                    </div>
                  </div>
                  <div className="lg:col-span-2 flex lg:block items-center">
                    <span className="text-sm text-gray-700 font-medium lg:hidden mr-2"> Barkod</span>
                    <p className="p-sm font-medium">
                      {productBarcode}
                    </p>
                  </div>
                  <div className="lg:col-span-1 flex lg:block items-center">
                    <ChevronRightIcon className="icon-md" onClick={() => history.push(`/urun-ilan-detay/${productId}`)} />
                  </div>
                </div>
              </div>
            }
          </>
          : selectedTabsId === 2 ?
            returnTabs2()
            : selectedTabsId === 3 &&
            <>
              <DetailTab3Placement DynamicListId={Number(params.id)} />
            </>
        }
      </div>
    </div>
  )
}
