import { FunctionComponent, useRef, useContext, useState } from "react"
import { Link, useHistory } from "react-router-dom";
import { Button } from "../Components/Button";
import { ChevronRightIcon, EditIcon, SeoIcon, TagIcon, TrashIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { Modal } from "../Components/Modal";
import { Table } from "../Components/Table"
import ApiService from "../Services/ApiService";
import { readPageQueryString } from "../Services/Functions";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

export const IdeaList: FunctionComponent = () => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const history = useHistory();

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const getIdeaList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getIdeaList(page, take, searchText, order);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
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

  const showDeleteModal = (item) => {
    context.showModal({
      type: "Question",
      title: "Fikri Sil",
      message: `${item.Name} isimli fikri silmek istediğinize emin misiniz?`,
      onClick: async () => {

        const _result = await ApiService.deleteIdea(item.Id);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Fikir başarıyla silindi",
            onClose: () => {
              context.hideModal();
              if (tableEl.current) {
                tableEl.current?.reload();
              }
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


  //#region Seo
  const [showSeoModal, setShowSeoModal] = useState<boolean>(false);

  const [seoId, setSeoId] = useState<number>(0);

  const [seoName, setSeoName] = useState<string>("");

  const [seoTitle, setSeoTitle] = useState<string>("");

  const [seoDescription, setSeoDescription] = useState<string>("");

  const handleOpenSeoModal = (item) => {
    setSeoId(item.Id ?? 0);
    setSeoName(item?.Name ?? "");
    setSeoTitle(item?.SeoTitle ?? "");
    setSeoDescription(item?.SeoDescription ?? "");
    setShowSeoModal(true);
  }

  const updateSingleIdeaSeo = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateSingleIdeaSeo(seoId, seoTitle, seoDescription);

    setProcessLoading(false);
    setShowSeoModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Seo bilgileri güncellenmiştir",
        onClose: () => {
          context.hideModal();
          if (tableEl.current) {
            tableEl.current?.reload();
          }
        }
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
        <h2 className="mb-5">Fikir Listesi</h2>
        <Table
          ref={tableEl}
          emptyListText={"Fikir Bulunamadı"}
          getDataFunction={getIdeaList}
          header={<div className="lg:grid-cols-12 flex items-start px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Fikir ID
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Fikir Adı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Kategori
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Ekleyen Profesyonel
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Oluşturulma Tarihi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Kullanılan Ürün Sayısı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Gelen Soru Sayısı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Görüntülenme Sayısı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Favoriye Eklenme Sayısı
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Durum
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Fikir ID:</span>
                <p className="p-sm">
                  {e.Id}
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Fikir Adı:</span>
                <p className="p-sm">
                  {e.Name}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Kategori:</span>
                <p className="p-sm">
                  {e.CategoryName}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Ekleyen Profesyonel:</span>
                <Link className="text-blue-400 underline font-medium text-sm" to={`/pro-profesyonel-detay/${e.ProId}`}>{e.StoreName}</Link>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Oluşturulma Tarihi:</span>
                <p className="p-sm">
                  {e.CreatedDate}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Kullanılan Ürün Sayısı:</span>
                <p className="p-sm">
                  {e.ProductCount}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Gelen Soru Sayısı:</span>
                <p className="p-sm">
                  {e.QuestionCount}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Görüntülenme Sayısı:</span>
                <p className="p-sm">
                  {e.ViewCount}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Favoriye Eklenme Sayısı:</span>
                <p className="p-sm">
                  {e.FavoriteCount}
                </p>
              </div>
              <div className="lg:col-span-2 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2">Durum: </span>
                  <p className={`${e.IsEnabled === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
                    {e.IsEnabled === true ? "Aktif" : "Pasif"}
                  </p>
                </div>
                <div className="text-gray-900 flex gap-2 items-center">
                  <Link className="hover:text-blue-400 cursor-pointer transition-all" to={{ pathname: `${"/proje-duzenle/" + e.Id}`, state: { IsIdeaApproved: true, queryPage: Number(readPageQueryString(window.location) ?? "1") } }} >
                    <EditIcon className="icon-sm " />
                  </Link>
                  <Link className="hover:text-blue-400 cursor-pointer transition-all" to={{ pathname: `${"/proje-detay/" + e.Id}`, state: { IsIdeaApproved: true, queryPage: Number(readPageQueryString(window.location) ?? "1"), tabId: 2 } }} >
                    <TagIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all transform rotate-90" />
                  </Link>
                  <SeoIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleOpenSeoModal(e); }} />
                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => showDeleteModal(e)} />
                  <Link className="hover:text-blue-400 cursor-pointer transition-all" to={{ pathname: `${"/proje-detay/" + e.Id}`, state: { IsIdeaApproved: true, queryPage: Number(readPageQueryString(window.location) ?? "1") } }} >
                    <ChevronRightIcon className="icon-sm " />
                  </Link>
                </div>
              </div>
            </div>
          }}
          page={Number(readPageQueryString(window.location) ?? "1")}
          setPageQueryString
        />
      </div>
      <Modal
        modalType="fixedSm"
        showModal={showSeoModal}
        onClose={() => { setShowSeoModal(false); }}
        title="SEO Bilgileri"
        body={
          <div>
            <Label withoutDots title="Proje Adı" className="mt-4" />
            <div className="text-sm text-gray-900">{seoName}</div>
            <Label isRequired withoutDots title="Title" className="mt-4" />
            <input className="form-input" type="text" value={seoTitle} onChange={(e) => { setSeoTitle(e.target.value); }} />
            <Label isRequired withoutDots title="Description" className="mt-4" />
            <input className="form-input" type="text" value={seoDescription} onChange={(e) => { setSeoDescription(e.target.value); }} />
          </div>
        }
        footer={
          <Button className="w-full" isLoading={processLoading} design="button-blue-400" text="Kaydet" onClick={() => { updateSingleIdeaSeo(); }}></Button>
        }
      />
    </div>
  )
}
