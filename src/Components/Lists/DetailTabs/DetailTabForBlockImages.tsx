import { FunctionComponent, useContext, useRef, useState } from "react"
import { useHistory } from "react-router-dom";
import { BlockImagesMediaModel, DynamicListAddingMediaModel, DynamicListMediaModel } from "../../../Models";
import ApiService from "../../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../../Services/SharedContext";
import { Button } from "../../Button";
import { CheckIcon, ChevronRightIcon, PlusIcon, StarIcon, TrashIcon } from "../../Icons";
import { Table } from "../../Table";
import { Image } from "../../Image";
import { Modal } from "../../Modal";
import { Label } from "../../Label";
import { Dropzone } from "../../Dropzone";
import { SERVICES } from "../../../Services/Constants";

export interface DetailTabForBlockImagesProps {
  DynamicListId: number,
  shownType: number
}

export const DetailTabForBlockImages: FunctionComponent<DetailTabForBlockImagesProps> = (props: DetailTabForBlockImagesProps) => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const tableElModal = useRef<any>();

  const history = useHistory();

  const [showAddingModal, setShowAddingModal] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [tableItems, setTableItems] = useState<DynamicListMediaModel[]>([])

  const [mediaList, setMediaList] = useState<BlockImagesMediaModel[]>([]);

  const [warningText, setWarningText] = useState<boolean>(false);

  const [blockSeoUrl, setBlockUrl] = useState<string>("");

  const [blockTitle, setBlockTitle] = useState<string>("");

  const [blockDescription, setBlockDescription] = useState<string>("");;

  const [blockImages, setBlockImages] = useState<DynamicListAddingMediaModel[]>([])


  const getDynamicListItems = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getDynamicListItems(props.DynamicListId, page, take, searchText, order);

    if (_result.succeeded === true) {
      let _tempArray: DynamicListMediaModel[] = []
      _result.data.Data.map((item) => (
        _tempArray.push(item.Media)
      ))
      setTableItems(_tempArray)
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

  const handleAddTempList = (mediaList, blockSeoUrl, blockTitle, blockDescription) => {
    mediaList.map((item) => (
      blockImages.push(
        {
          PhotoUrl: item.FileUrl,
          RedirectUrl: blockSeoUrl,
          Title: blockTitle,
          Description: blockDescription,
        }
      )

    ))
    addItemToDynamicList()
  }

  const addItemToDynamicList = async () => {
    setProcessLoading(true);

    const _result = await ApiService.addItemToDynamicList(props.DynamicListId, [], blockImages)

    setShowAddingModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Görsel(ler) başarıyla eklendi",
        onClose: () => {
          context.hideModal();
          setProcessLoading(false);
          if (tableEl.current) {
            tableEl.current?.reload();
          }
          clearInput();
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

  const showDeleteModal = (item) => {
    context.showModal({
      type: "Question",
      title: "Görsel Sil",
      message: `Görseli listeden silmek istediğinize emin misiniz?`,
      onClick: async () => {
        const _result = await ApiService.deleteItemFromDynamicList(item.ItemId);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Görsel başarıyla silindi",
            onClose: () => {
              context.hideModal();
              if (tableEl.current) {
                tableEl.current?.reload();
              }
              clearInput();
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

  const returnBody = (item) => {
    return <><div className="lg:col-span-2 flex lg:block items-center flex items-center">
      <span className="p-sm-gray-700 lg:hidden mr-2">Görsel:</span>
      <div className={" w-full overflow-y-auto custom-scrollbar whitespace-nowrap"}>
        <Image src={item.PhotoUrl} key={"mediaList" + item.PhotoUrl} className="max-h-14 w-full mr-2 object-cover pr-1 " />
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
          {item.RedirectUrl}
        </p>
      </div>
      <div className="lg:col-span-2 flex lg:block items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Açıklama:</span>
        <p className="text-black-700 text-sm">
          {item.Description}
        </p>
      </div>
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
  const removePhotoFromUrl = (url) => {
    const newFiles = [...mediaList];
    setMediaList((newFiles || []).filter(x => x !== url));
  };

  const clearInput = () => {
    setBlockDescription("");
    setBlockTitle("");
    setBlockUrl("");
    setMediaList([]);
  }


  return (
    <>
      <Table
        ref={tableEl}
        emptyListText={"Liste Bulunamadı"}
        getDataFunction={getDynamicListItems}
        addNewButton={
          <Button buttonMd textTiny color="text-blue-400" className="w-72" design="button-blue-100" text="Yeni Blok Görsel Ekle" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { setShowAddingModal(true); clearInput(); }} />}
        header={returnHeader()}
        renderItem={(e, i) => {
          return <div key={"list" + i} className="lg:grid-cols-9 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
            {returnBody(e)}
            <div className="lg:col-span-1 flex justify-between items-center">
              <span className="p-sm-gray-700 lg:hidden mr-2">İşlemler: </span>
              <div className="text-gray-700 flex gap-2 items-center">
                <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => showDeleteModal(e)} />
              </div>
            </div>
          </div>
        }}
      />

      <Modal
        modalType="fixedSm"
        showModal={showAddingModal}
        onClose={() => { setShowAddingModal(false); setBlockImages([]) }}
        title="Yeni Blok Görsel Ekle"
        body=
        {
          <div className="">
            <Label title="Görsel" withoutDots isRequired />
            <Dropzone
              fileUploaderCss
              accept={["image"]}
              uploadUrl={SERVICES.API_ADMIN_DYNAMICLIST_URL + "/upload-dynamic-list-media"}
              addFiles={addFiles}
              maxFileSizeAsMB={10}
              maxFileCount={props.shownType === 7 ? 1 - ((mediaList?.length ?? 0) || (tableItems.length ?? 0)) : props.shownType === 8 ? 2 - ((mediaList?.length ?? 0) || (tableItems.length ?? 0)) : 25 - ((mediaList?.length ?? 0) || (tableItems.length ?? 0))}
            />
            {(mediaList.length && mediaList.length > 0) ?
              <div className={`${props.shownType === 7 ? "lg:grid-cols-1" : props.shownType === 8 ? "lg:grid-cols-2" : "lg:grid-cols-3"} grid gap-x-4`}>
                {mediaList.map((item) => (
                  <div className="relative">
                    <Image src={item.FileUrl} alt={item.FileName} key={"mediaList" + item.FileName + item.FileUrl} className="w-full max-h-88 object-cover" />
                    <div className="text-sm bg-white p-1 rounded-lg absolute top-1 cursor-pointer right-1" onClick={() => { removePhotoFromUrl(item) }} >
                      <TrashIcon className="icon-md text-red-400 inline-block" />
                    </div>
                  </div>

                ))}
              </div>
              :
              <></>
            }
            <Label className="mt-4" title="Yönlendireceği Sayfa (URL)" withoutDots />
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
          <Button design="button-blue-400 mt-4" text="Kaydet" block onClick={() => {
            mediaList.length === 0 ?
              setWarningText(true)
              :
              handleAddTempList(mediaList, blockSeoUrl, blockTitle, blockDescription)
          }} />
        }
      />
    </>
  )
}
