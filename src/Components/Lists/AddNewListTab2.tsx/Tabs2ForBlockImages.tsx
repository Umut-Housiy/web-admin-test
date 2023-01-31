import { FunctionComponent, useRef, useState, useContext } from "react";

import { BlockImagesMediaModel, BlockImagesModel, ItemModel } from "../../../Models";
import { SharedContext, SharedContextProviderValueModel } from "../../../Services/SharedContext";
import { Button } from "../../Button";
import { InfoIcon, PlusIcon, TrashIcon } from "../../Icons";
import { Modal } from "../../Modal";
import { useStateEffect } from "../../UseStateEffect";
import { Image } from "../../Image";
import { SERVICES } from "../../../Services/Constants";
import { Dropzone } from "../../Dropzone";
import { Label } from "../../Label";

export interface Tabs2ForBlockImagesProps {
  setSelectedListToApi: (e: ItemModel[]) => void,
  setSelectedItem: (e: BlockImagesModel[]) => void,
  blockImages: BlockImagesModel[],
  shownType: number
}

export const Tabs2ForBlockImages: FunctionComponent<Tabs2ForBlockImagesProps> = (props: Tabs2ForBlockImagesProps) => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const [showModal, setShowModal] = useState<boolean>(false);

  const [blockImages, setBlockImages] = useState<BlockImagesModel[]>(props.blockImages ?? []);

  const [selectedListToApi, setSelectedListToApi] = useState<ItemModel[]>([]);

  const [mediaList, setMediaList] = useState<BlockImagesMediaModel[]>([]);

  const [blockSeoUrl, setBlockUrl] = useState<string>("");

  const [blockTitle, setBlockTitle] = useState<string>("");

  const [blockDescription, setBlockDescription] = useState<string>("");

  const [warningText, setWarningText] = useState<boolean>(false);

  const handleAddTempList = (mediaList, blockSeoUrl, blockTitle, blockDescription) => {
    setShowModal(false);
    mediaList.map((item) => (
      blockImages.push(
        {
          PhotoUrl: item.FileUrl,
          SeoUrl: blockSeoUrl,
          Title: blockTitle,
          Description: blockDescription,
        }
      )
    ))
    setBlockImages([...blockImages]);
    clearInput();
  }

  useStateEffect(() => {
    returnBody()
  }, [blockImages])

  useStateEffect(() => {
    let _currentArray: ItemModel[] = []
    blockImages.map((item) => (
      _currentArray.push({
        ItemId: 0,
        PhotoUrl: item.PhotoUrl,
        RedirectUrl: item.SeoUrl,
        Title: item.Title,
        Description: item.Description,
        IsIdeaMainProduct: false
      })
    ));
    setSelectedListToApi(_currentArray);
  }, [blockImages]);


  useStateEffect(() => {
    props.setSelectedListToApi(selectedListToApi);
    props.setSelectedItem(blockImages)
  }, [selectedListToApi]);

  const returnHeader = () => {
    return <div className=" lg:grid-cols-9 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
      <div className="lg:col-span-2">
        <span className="p-sm-gray-400">
          Görsel
        </span>
      </div>
      <div className="lg:col-span-2">
        <span className="p-sm-gray-400">
          Başlık
        </span>
      </div>
      <div className="lg:col-span-2">
        <span className="p-sm-gray-400">
          URL
        </span>
      </div>
      <div className="lg:col-span-2">
        <span className="p-sm-gray-400">
          Açıklama
        </span>
      </div>

    </div>
  }
  const removeBlockImages = (photoUrl) => {
    setBlockImages(blockImages.filter(i => i.PhotoUrl !== photoUrl));
  }

  const returnBody = () => {
    return <>{blockImages.map((item) => (
      <div className="lg:grid-cols-9 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
        <div className="lg:col-span-2 flex lg:block items-center flex items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Görsel:</span>
          <div className={" w-full overflow-y-auto custom-scrollbar whitespace-nowrap"}>
            <Image src={item.PhotoUrl} key={"mediaList" + item.SeoUrl} className="max-h-14 w-full mr-2 object-cover pr-1 " />
          </div>
        </div>
        <div className="lg:col-span-2 flex lg:block items-center flex items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Başlık:</span>
          <p className="text-black-700 text-sm">
            {item.Title}
          </p>
        </div>
        <div className="lg:col-span-2 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">URL:</span>
          <p className="text-black-700 text-sm">
            {item.SeoUrl}
          </p>
        </div>
        <div className="lg:col-span-2 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Açıklama:</span>
          <p className="text-black-700 text-sm">
            {item.Description}
          </p>
        </div>
        <div className="lg:col-span-1">
          <TrashIcon className="icon-sm mr-2" onClick={() => removeBlockImages(item.PhotoUrl)}
          />
        </div>
      </div>
    ))}

    </>
  }

  const addFiles = (e) => {
    let tempData: { FileName: string, FileUrl: string }[] = [];
    for (let i = 0; i < e.length; i++) {
      const element = e[i];
      tempData.push({ FileName: element.FileName, FileUrl: element.FileUrl })
    }
    setMediaList([...mediaList, ...tempData]);
    setWarningText(false)
  }

  const clearInput = () => {
    setMediaList([]);
    setBlockUrl("");
    setBlockTitle("");
    setBlockDescription("")
  }

  const removePhotoFromUrl = (url) => {
    const newFiles = [...mediaList];
    setMediaList((newFiles || []).filter(x => x !== url));
  };


  return (
    <div>
      <h4 className="mb-4">Öne Çıkarılacak Blok Görsel Listesi</h4>
      <Button textTiny text="Blok Görsel Ekle" hasIcon icon={<PlusIcon className="icon-sm mr-2 " />} design="button-blue-100 text-blue-400 w-60 mb-4" onClick={() => { setShowModal(true); clearInput() }} />

      {returnHeader()}

      {returnBody()}

      <Modal
        modalType="fixedSm"
        showModal={showModal}
        onClose={() => {
          setShowModal(false);
          // setSelectedItem(selectedItem)
          clearInput()
        }}
        title="Yeni Blok Görsel Ekle"
        body=
        {
          <div className="">
            <Label title="Görsel" withoutDots isRequired />
            {(props.shownType === 7 || props.shownType === 8) &&
              <div className="flex items-center mb-2.5 gap-x-2">
                <InfoIcon className="icon-sm text-red-400 transform -rotate-180" />
                <p className="text-type-11-medium  text-gray-700">Yükleyeceğiniz görsel <span className="text-black-400">
                  {props.shownType === 7 ? "9/2 " : "9/4 "} </span> oranında olmalıdır</p>
              </div>
            }
            <Dropzone
              fileUploaderCss
              accept={["image"]}
              uploadUrl={SERVICES.API_ADMIN_DYNAMICLIST_URL + "/upload-dynamic-list-media"}
              addFiles={addFiles}
              maxFileSizeAsMB={10}
              maxFileCount={props.shownType === 7 ? 1 - ((mediaList?.length ?? 0) || (blockImages.length ?? 0)) : props.shownType === 8 ? 2 - ((mediaList?.length ?? 0) || (blockImages.length ?? 0)) : 25 - ((mediaList?.length ?? 0) || (blockImages.length ?? 0))}
            />
            {(mediaList.length && mediaList.length > 0) ?
              <div className={`${props.shownType === 7 ? "lg:grid-cols-1" : props.shownType === 8 ? "lg:grid-cols-2" : "lg:grid-cols-3"} grid gap-x-4`}>
                {mediaList.map((item) => (
                  <div className="relative">
                    <Image src={item.FileUrl} alt={item.FileName} key={"mediaList" + item.FileUrl} className="w-full max-h-88 object-cover" />
                    <div className="text-sm bg-white p-1 rounded-lg absolute top-1 cursor-pointer right-1" onClick={() => { removePhotoFromUrl(item) }} >
                      <TrashIcon className="icon-md text-red-400 inline-block" />
                    </div>
                  </div>

                ))}
              </div>
              :
              <></>
            }
            <Label className="mt-4" title="Yönlendireceği Sayfa (URL)" withoutDots isRequired />
            <input className="form-input" type="text" value={blockSeoUrl} onChange={(e) => { setBlockUrl(e.target.value); }} />
            <Label className="mt-4" title="Blok Başlığı" withoutDots />
            <input className="form-input" type="text" value={blockTitle} placeholder="-" onChange={(e) => { setBlockTitle(e.target.value); }} />
            <Label className="mt-4" title="Açıklama" withoutDots />
            <input className="form-input" type="text" placeholder="Açıklama" value={blockDescription} onChange={(e) => { setBlockDescription(e.target.value); }} />
            {warningText === true &&
              <span className="text-red-400 font-medium text-sm">*Lütfen resim yükleyiniz...</span>
            }

          </div>
        }
        footer={
          <>
            <Button design="button-blue-400 mt-4" text="Kaydet" block onClick={() => {
              mediaList.length === 0 ?
                setWarningText(true)
                :
                handleAddTempList(mediaList, blockSeoUrl, blockTitle, blockDescription)
            }} />
          </>
        }
      />
    </div>
  )
}
