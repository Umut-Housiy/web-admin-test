import { FunctionComponent, useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom";
import { Dropdown } from "../../Components/Dropdown";
import { HelpCircleIcon } from "../../Components/Icons";
import { Label } from "../../Components/Label";
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { Image } from "../../Components/Image";
import { TextArea } from "../../Components/TextArea";
import { ToggleButton } from "../../Components/ToggleButton";
import { useStateEffect } from "../../Components/UseStateEffect";
import { Button } from "../../Components/Button";
import ReactNumeric from 'react-numeric';
import { autonNumericOptions } from "../../Services/Functions";

interface RouteParams {
  id: string,
}

export const UpdateList: FunctionComponent = () => {

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
    { key: "10", value: "İçerik" },

  ]

  //ürün tipleri
  const shownTypeForProduct = [
    { key: "1", value: "Tip 1", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/urun-liste-tip-1.png" },
    { key: "2", value: "Tip 2", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/urun-liste-tip-2.png" },
    { key: "3", value: "Tip 3", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/urun-liste-tip-3.png" },
    { key: "4", value: "Tip 4", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/urun-liste-tip-4.png" },
    { key: "5", value: "Tip 5", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/urun-liste-tip-5.png" },
  ]
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
    { key: "15", value: "Tip 15", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-urun-liste-tip-15.png" },
  ]
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
    { key: "15", value: "Tip 15", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/kategori-pro-liste-tip-15.png" },
  ]

  //fikir tipleri
  const shownTypeForIdea = [
    { key: "1", value: "Tip 1", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/fikir-liste-tip-1.png" },
    { key: "2", value: "Tip 2", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/fikir-liste-tip-2.png" },
    { key: "3", value: "Tip 3", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/fikir-liste-tip-3.png" },
    { key: "4", value: "Tip 4", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/fikir-liste-tip-4.png" },
    { key: "5", value: "Tip 5", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/fikir-liste-tip-5.png" },
    { key: "12", value: "Tip 12", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/fikir-liste-tip-12.png" },
  ]
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
  ]

  //ürün-fikir tipleri
  const shownTypeForProductIdea = [
    { key: "6", value: "Tip 6", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/urun-fikir-liste-tip-6.png" },
  ]
  //blog tipleri
  const shownTypeForBlog = [
    { key: "1", value: "Tip 1", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/blog-liste-tip-1.png" },
    { key: "2", value: "Tip 2", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/blog-liste-tip-2.png" },
    { key: "3", value: "Tip 3", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/blog-liste-tip-3.png" },
    { key: "4", value: "Tip 4", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/blog-liste-tip-4.png" },
    { key: "5", value: "Tip 5", photo: "https://housiystrg.blob.core.windows.net/dynamiclist-media/blog-liste-tip-5.png" },
  ];;

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

  const params = useParams<RouteParams>();

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

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


  const [oneDaySellerPromotePrice, setOneDaySellerPromotePrice] = useState<number>(0);

  const [threeDaySellerPromotePrice, setThreeDaySellerPromotePrice] = useState<number>(0);

  const [sevenDaySellerPromotePrice, setSevenDaySellerPromotePrice] = useState<number>(0);

  const [fourteenDaySellerPromotePrice, setFourteenDaySellerPromotePrice] = useState<number>(0);

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
    getDynamicListDetail()
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
      setShownType(d.ShownType);
      setTitle(d.Title);
      setButtonTitle(d.ButtonTitle);
      setButtonUrl(d.ButtonUrl);
      setDescription(d.Description);
      setCanSellerPromote(d.CanSellerPromote);
      if (d.OneDaySellerPromotePrice === null) {
        setOneDaySellerPromotePrice(0);
      }
      else {
        setOneDaySellerPromotePrice(Number(d.OneDaySellerPromotePrice));
      }
      if (d.ThreeDaySellerPromotePrice === null) {
        setThreeDaySellerPromotePrice(0);
      }
      else {
        setThreeDaySellerPromotePrice(Number(d.ThreeDaySellerPromotePrice));
      }
      if (d.SevenDaySellerPromotePrice === null) {
        setSevenDaySellerPromotePrice(0);
      }
      else {
        setSevenDaySellerPromotePrice(Number(d.SevenDaySellerPromotePrice));
      }
      if (d.FourteenDaySellerPromotePrice === null) {
        setFourteenDaySellerPromotePrice(0);
      }
      else {
        setFourteenDaySellerPromotePrice(Number(d.FourteenDaySellerPromotePrice));
      }
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

  const updateDynamicList = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateDynamicList(Number(params.id), Number(selectedShownType.key), title, buttonTitle, buttonUrl, description, canSellerPromote, oneDaySellerPromotePrice === 0 ? "" : String(oneDaySellerPromotePrice),
      threeDaySellerPromotePrice === 0 ? "" : String(threeDaySellerPromotePrice),
      sevenDaySellerPromotePrice === 0 ? "" : String(sevenDaySellerPromotePrice),
      fourteenDaySellerPromotePrice === 0 ? "" : String(fourteenDaySellerPromotePrice),
    );

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi.",
        onClose: () => {
          context.hideModal(); history.push("/olusturulan-listeler"); setProcessLoading(false);
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

  return (
    <div className="content-wrapper mb-5">
      <div className="portlet-wrapper">
        <h2 className="mb-5">
          Liste Bilgilerini Düzenle
        </h2>
        <div className="w-2/3">
          <Label className="mt-4" title="Oluşturulacak Liste Türü" withoutDots isRequired />
          <Dropdown
            loading={loading}
            isDisabled={true}
            key="selectedListType"
            isDropDownOpen={currentOpenedFilterButton === "selectedListType"}
            onClick={() => { setCurrentOpenedFilterButton("selectedListType"); }}
            className="w-full text-black-700 text-sm"
            label={selectedType.value}
            items={listTypes}
            onItemSelected={item => { setSelectedType(item); }} />
        </div>

        <Label className="mt-4" title="Gösterim Tipi" withoutDots isRequired />
        <div className="flex items-center">
          <div className="w-2/3">
            <Dropdown
              isDisabled={selectedType.key === "8" ? true : false}
              loading={loading}
              key="shownType"
              isDropDownOpen={currentOpenedFilterButton === "shownType"}
              onClick={() => { setCurrentOpenedFilterButton("shownType"); }}
              className="w-full text-black-700 text-sm"
              label={selectedShownType.value}
              items={returnListTypes()}
              onItemSelected={item => { setSelectedShownType(item); setSelectedPhoto(item.photo ?? "") }} />

          </div>
          <div className="w-1/3">
            <a href="https://dummyimage.com/1440x487/d4ccd4/4a4c63&text=DOKUMAN-LINKI-GELECEK" target="_blank" className="flex text-red-400 ml-2">
              <HelpCircleIcon className="icon-sm mr-1" />
              <span className="text-sm font-medium">Gösterim Tipi Nedir?</span>
            </a>
          </div>
        </div>
        <div className="w-2/3">
          <Image src={selectedPhoto} key={selectedPhoto} className="w-full mt-4" />
          <Label className="mt-4" title="Liste Başlığı" withoutDots />
          <input className="form-input" placeholder="-" type="text" value={title} onChange={(e) => { setTitle(e.target.value); }} />
          <Label className="mt-4" title="Buton Başlığı" withoutDots />
          <input className="form-input" placeholder="-" type="text" value={buttonTitle} onChange={(e) => { setButtonTitle(e.target.value); }} />
          <Label className="mt-4" title="Buton Yönlendirme Linki" withoutDots />
          <input className="form-input" placeholder="-" type="text" value={buttonUrl} onChange={(e) => { setButtonUrl(e.target.value); }} />
          {selectedType.key !== "10" &&
            <>
              <Label className="mt-4" title="Açıklama" withoutDots />
              <TextArea
                setText={setDescription}
                text={description}
                placeholder="Liste açıklama metni giriniz."
                maxCount={2000}
              />
            </>
          }
          {(selectedType.key === "1" || selectedType.key === "3") &&
            <div className="flex mt-6 align-items-center">
              <div className="text-gray-900 text-sm font-medium">Sponsorlu eklenebilir</div>
              <div className="ml-auto">
                <ToggleButton onClick={() => { setCanSellerPromote(!canSellerPromote) }} defaultValue={canSellerPromote} />
              </div>
            </div>
          }
          {canSellerPromote === true &&
            <div className="lg:grid-cols-4 grid gap-3 mt-4">
              <div className="lg:col-span-1">
                <Label title="1 Günlük Ücret" withoutDots />
                <ReactNumeric
                  value={oneDaySellerPromotePrice}
                  preDefined={autonNumericOptions.TL}
                  onChange={(e, value: number) => { setOneDaySellerPromotePrice(value) }}
                  className={"form-input"}
                />
              </div>
              <div className="lg:col-span-1">
                <Label title="3 Günlük Ücret" withoutDots />
                <ReactNumeric
                  value={threeDaySellerPromotePrice}
                  preDefined={autonNumericOptions.TL}
                  onChange={(e, value: number) => { setThreeDaySellerPromotePrice(value) }}
                  className={"form-input"}
                />
              </div>
              <div className="lg:col-span-1">
                <Label title="7 Günlük Ücret" withoutDots />
                <ReactNumeric
                  value={sevenDaySellerPromotePrice}
                  preDefined={autonNumericOptions.TL}
                  onChange={(e, value: number) => { setSevenDaySellerPromotePrice(value) }}
                  className={"form-input"}
                />
              </div>
              <div className="lg:col-span-1">
                <Label title="14 Günlük Ücret" withoutDots />
                <ReactNumeric
                  value={fourteenDaySellerPromotePrice}
                  preDefined={autonNumericOptions.TL}
                  onChange={(e, value: number) => { setFourteenDaySellerPromotePrice(value) }}
                  className={"form-input"}
                />
              </div>

            </div>
          }
        </div>
        <div className="flex justify-end mt-4">
          <Button text="Vazgeç" design="button w-1/6 font-medium text-tiny text-gray-700" onClick={() => history.push('/olusturulan-listeler')} />
          <Button isLoading={processLoading} text="Değişiklikleri Kaydet" design="text-tiny button-blue-400 w-2/5" onClick={() => updateDynamicList()} />

        </div>
      </div>
    </div >

  )
}
