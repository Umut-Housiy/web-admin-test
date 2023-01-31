import { FunctionComponent, useState } from "react"

import { Dropdown } from "../Dropdown"
import { Label } from "../Label"
import { Image } from "../Image"
import { TextArea } from "../TextArea"
import { HelpCircleIcon } from "../Icons"
import { Button } from "../Button"
import { ToggleButton } from "../ToggleButton"
import { useStateEffect } from "../UseStateEffect"
import ReactNumeric from 'react-numeric';
import { autonNumericOptions } from "../../Services/Functions"

export interface AddNewListTab1Props {
  selectedListType: number,
  setTabs1Data: (e: Tab1DataModel) => void,
  setChangeStep: (e: number) => void

  //
  tabs1Data: Tab1DataModel
}

export interface Tab1DataModel {
  shownType: number,
  listTitle?: string,
  buttonTitle?: string,
  buttonLink?: string,
  description?: string,
  canSellerPromote?: boolean,
  oneDayPrice: string,
  threeDayPrice: string,
  sevenDayPrice: string,
  fourteenDayPrice: string,
}

export const AddNewListTab1: FunctionComponent<AddNewListTab1Props> = (props: AddNewListTab1Props) => {

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
  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");


  const [listTitle, setListTitle] = useState<string>(props.tabs1Data.listTitle ?? "");

  const [buttonTitle, setButtonTitle] = useState<string>(props.tabs1Data.buttonTitle ?? "");

  const [buttonLink, setButtonLink] = useState<string>(props.tabs1Data.buttonLink ?? "");

  const [description, setDescription] = useState<string>(props.tabs1Data.description ?? "");

  const [canSellerPromote, setCanSellerPromote] = useState<boolean>(props.tabs1Data.canSellerPromote ?? false);

  const [oneDayPrice, setOneDayPrice] = useState<number>(props.tabs1Data.oneDayPrice === "" ? 0 : Number(props.tabs1Data.oneDayPrice));

  const [threeDayPrice, setThreeDayPrice] = useState<number>(props.tabs1Data.threeDayPrice === "" ? 0 : Number(props.tabs1Data.threeDayPrice));

  const [sevenDayPrice, setSevenDayPrice] = useState<number>(props.tabs1Data.sevenDayPrice === "" ? 0 : Number(props.tabs1Data.sevenDayPrice));

  const [fourteenDayPrice, setFourteenDayPrice] = useState<number>(props.tabs1Data.fourteenDayPrice === "" ? 0 : Number(props.tabs1Data.fourteenDayPrice));


  const returnListTypes = () => {
    switch (props.selectedListType) {
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
  const [selectedShownType, setSelectedShownType] = useState<{ key: string, value: string }>(
    {
      key: returnListTypes()?.find(i => i.key === String(props.tabs1Data.shownType))?.key ?? "0",
      value: returnListTypes()?.find(i => i.key === String(props.tabs1Data.shownType))?.value ?? "Seçiniz"
    });

  const [selectedPhoto, setSelectedPhoto] = useState<string>(returnListTypes()?.find(i => i.key === String(props.tabs1Data.shownType))?.photo ?? "");


  useStateEffect(() => {
    setSelectedShownType({ key: "0", value: "Seçiniz..." });
    setListTitle("");
    setButtonLink("");
    setButtonTitle("");
    setDescription("");
  }, [props.selectedListType]);

  return (
    <div>
      <Label className="mt-4" title="Gösterim Tipi" withoutDots isRequired />
      <div className="flex items-center">
        <div className="w-2/3">
          <Dropdown
            key="selectedListType"
            isDropDownOpen={currentOpenedFilterButton === "selectedListType"}
            onClick={() => { setCurrentOpenedFilterButton("selectedListType"); }}
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

      {selectedShownType.key !== "0" &&
        <div className="w-full">
          <div className="w-2/3">
            <Image src={selectedPhoto} key={selectedPhoto} className="w-full mt-4" />
            <Label className="mt-4" title="Liste Başlığı" withoutDots />
            <input className="form-input" placeholder="-" type="text" value={listTitle} onChange={(e) => { setListTitle(e.target.value); }} />
            <Label className="mt-4" title="Buton Başlığı" withoutDots />
            <input className="form-input" placeholder="-" type="text" value={buttonTitle} onChange={(e) => { setButtonTitle(e.target.value); }} />
            <Label className="mt-4" title="Buton Yönlendirme Linki" withoutDots />
            <input className="form-input" placeholder="-" type="text" value={buttonLink} onChange={(e) => { setButtonLink(e.target.value); }} />

            {props.selectedListType === 10 ? <></> : <>
              <Label className="mt-4" title="Açıklama" withoutDots />
              <TextArea
                setText={setDescription}
                text={description}
                placeholder="Liste açıklama metni giriniz."
                maxCount={2000}
              />
            </>
            }
            {(props.selectedListType === 1 || props.selectedListType === 3) &&
              <>
                <div className="flex mt-6 align-items-center">
                  <div className="text-gray-900 text-sm font-medium">Sponsorlu eklenebilir</div>
                  <div className="ml-auto">
                    <ToggleButton onClick={() => { setCanSellerPromote(!canSellerPromote) }} defaultValue={canSellerPromote} />
                  </div>
                </div>
                {canSellerPromote === true &&
                  <div className="lg:grid-cols-4 grid gap-3 mt-4">
                    <div className="lg:col-span-1">
                      <Label title="1 Günlük Ücret" withoutDots />
                      <ReactNumeric
                        value={oneDayPrice}
                        preDefined={autonNumericOptions.TL}
                        onChange={(e, value: number) => { setOneDayPrice(value) }}
                        className={"form-input"}
                      />
                    </div>
                    <div className="lg:col-span-1">
                      <Label title="3 Günlük Ücret" withoutDots />
                      <ReactNumeric
                        value={threeDayPrice}
                        preDefined={autonNumericOptions.TL}
                        onChange={(e, value: number) => { setThreeDayPrice(value) }}
                        className={"form-input"}
                      />
                    </div>
                    <div className="lg:col-span-1">
                      <Label title="7 Günlük Ücret" withoutDots />
                      <ReactNumeric
                        value={sevenDayPrice}
                        preDefined={autonNumericOptions.TL}
                        onChange={(e, value: number) => { setSevenDayPrice(value) }}
                        className={"form-input"}
                      />
                    </div>
                    <div className="lg:col-span-1">
                      <Label title="14 Günlük Ücret" withoutDots />
                      <ReactNumeric
                        value={fourteenDayPrice}
                        preDefined={autonNumericOptions.TL}
                        onChange={(e, value: number) => { setFourteenDayPrice(value) }}
                        className={"form-input"}
                      />
                    </div>

                  </div>
                }
              </>
            }
          </div>

          <div className="text-right mt-5">
            <Button text="Kaydet ve Sonraki" design="button-blue-400 w-2/5" onClick={() => {
              props.setTabs1Data(
                {
                  shownType: Number(selectedShownType.key), listTitle: listTitle, buttonTitle: buttonTitle, buttonLink: buttonLink, description: description, canSellerPromote: canSellerPromote,
                  oneDayPrice: oneDayPrice === 0 ? "" : String(oneDayPrice),
                  threeDayPrice: threeDayPrice === 0 ? "" : String(threeDayPrice),
                  sevenDayPrice: sevenDayPrice === 0 ? "" : String(sevenDayPrice),
                  fourteenDayPrice: fourteenDayPrice === 0 ? "" : String(fourteenDayPrice)
                }
              );
              props.setChangeStep(2);
            }
            }
            />
          </div>
        </div>
      }
    </div>
  )
}
