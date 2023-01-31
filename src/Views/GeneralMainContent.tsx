import { FunctionComponent, useContext, useRef, useState } from "react"
import { EditIcon, PlusIcon, TrashIcon } from "../Components/Icons";
import { SidebarLinks } from "../Components/SiderbarLinks";
import { Image } from "../Components/Image";
import { Table } from "../Components/Table";
import { Button } from "../Components/Button";
import { useHistory, useParams } from "react-router-dom";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import ApiService from "../Services/ApiService";

interface RouteParams {
  tabId: string,
}

export const GeneralMainContent: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const params = useParams<RouteParams>();

  const sidebarLinks = [
    {
      id: 1,
      title: "1. Slider Yönetimi",
    },
    {
      id: 2,
      title: "2. Tanıtım Bilgileri",
    },
    {
      id: 3,
      title: "3. Kullanıcı Yorumları",
    },
  ];

  const history = useHistory();

  const [selectedTabsId, setSelectedTabsId] = useState<number>(Number(params?.tabId ?? 1) > 3 ? 1 : Number(params?.tabId ?? 1));

  const sliderTableEl = useRef<any>();

  const promotionTableEl = useRef<any>();

  const commentTableEl = useRef<any>();

  const sortOptions = [
    { key: "1", value: "Yeniden Eskiye" },
    { key: "2", value: "Eskiden Yeniye" },
    { key: "3", value: "Sıraya göre azalan" },
    { key: "4", value: "Sıraya göre artan" }
  ];

  const getSliderList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getLoginSliderList(page, take, searchText, order, -1, -1);

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

  const getPromotionList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getPromotionInfoList(page, take, searchText, order, -1, -1);

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

  const getCommentList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getTestimonialList(page, take, searchText, order, -1, -1);

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

  const removeGeneralContent = (ContentId) => {
    context.showModal({
      type: "Question",
      title: "İçerik Sil",
      message: "Seçili içerik silinecek. Emin misiniz?",
      onClick: async () => {
        const _result = await ApiService.removeGeneralContent(ContentId);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "İçerik başarıyla silindi",
            onClose: () => { context.hideModal(); }
          });
          if (sliderTableEl.current) {
            sliderTableEl.current?.reload();
          }
          if (promotionTableEl.current) {
            promotionTableEl.current?.reload();
          }
          if (commentTableEl.current) {
            commentTableEl.current?.reload();
          }
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

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="pb-4 border-b border-gray-200">Anasayfa İçerikleri</h2>
        <div className="grid lg:grid-cols-4 border-r border-gray-200">
          <div className="lg:col-span-1 py-4 pr-4">
            <SidebarLinks list={sidebarLinks} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id) }} />
          </div>
          <div className="lg:col-span-3 px-5 border-l border-gray-200">
            {
              selectedTabsId === 1 ?
                <div className="py-6">
                  <h2 className="pb-4 border-b border-gray-200">Slider Listesi</h2>
                  <Table
                    ref={sliderTableEl}
                    key={"table_1"}
                    emptyListText={"Slider Bulunamadı"}
                    getDataFunction={getSliderList}
                    addNewButton={
                      <Button buttonMd textTiny color="text-white" className="w-64" design="button-blue-400" text="Yeni Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { history.push("/genel-slider-duzenle"); }} />}
                    header={<div className=" lg:grid-cols-5 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                      <div className="lg:col-span-1 flex items-center">
                        <span className="p-sm-gray-400">
                          Görsel
                        </span>
                      </div>
                      <div className="lg:col-span-1 flex items-center">
                        <span className="p-sm-gray-400">
                          Üst Başlık
                        </span>
                      </div>
                      <div className="lg:col-span-1">
                        <span className="p-sm-gray-400">
                          Başlık
                        </span>
                      </div>
                      <div className="lg:col-span-1">
                        <span className="p-sm-gray-400">
                          Yerleşim Alanı
                        </span>
                      </div>
                      <div className="lg:col-span-1">
                        <span className="p-sm-gray-400">
                          Durum
                        </span>
                      </div>
                    </div>}
                    renderItem={(e, i) => {
                      return <div key={"list" + i} className="lg:grid-cols-5 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
                        <div className="lg:col-span-1 flex items-center">
                          <Image src={e.PhotoUrl} alt={e.SubTitle} className="w-32 h-14 object-cover" />
                        </div>
                        <div className="lg:col-span-1">
                          <p className="p-sm">
                            {e.Title}
                          </p>
                        </div>
                        <div className="lg:col-span-1">
                          <p className="p-sm">
                            {e.SubTitle}
                          </p>
                        </div>
                        <div className="lg:col-span-1">
                          <p className="p-sm">
                            {e.ShowOnWebsite ? " Web" : ""}
                            {e.ShowOnMobilWeb && `${e.ShowOnWebsite ? "," : ""} Mobil Web`}
                            {e.ShowOnApp && `${e.ShowOnMobilWeb ? "," : ""} Mobil Uygulama`}
                          </p>
                        </div>
                        <div className="lg:col-span-1 flex justify-between">
                          <p className={`${e.IsEnabled === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
                            {e.IsEnabled === true ? "Aktif" : "Pasif"}
                          </p>
                          <div className="text-gray-700 flex gap-2 items-center">
                            <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={() => { history.push(`/genel-slider-duzenle/${e.Id}`); }} />
                            <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { removeGeneralContent(e.Id); }} />
                          </div>
                        </div>
                      </div>
                    }}
                    sortOptions={sortOptions}
                  />
                </div>
                :
                selectedTabsId === 2 ?
                  <div className="py-6">
                    <h2 className="pb-4 border-b border-gray-200">Tanıtım Bilgileri</h2>
                    <Table
                      ref={promotionTableEl}
                      key={"table_2"}
                      emptyListText={"Tanıtım Bulunamadı"}
                      getDataFunction={getPromotionList}
                      addNewButton={
                        <Button buttonMd textTiny color="text-white" className="w-64" design="button-blue-400" text="Yeni Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { history.push("/genel-tanitim-duzenle"); }} />}
                      header={<div className=" lg:grid-cols-7 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                        <div className="lg:col-span-1 flex items-center">
                          <span className="p-sm-gray-400">
                            Gösterim Sırası
                          </span>
                        </div>
                        <div className="lg:col-span-3 flex items-center">
                          <span className="p-sm-gray-400">
                            Kategori
                          </span>
                        </div>
                        <div className="lg:col-span-3">
                          <span className="p-sm-gray-400">
                            Başlık
                          </span>
                        </div>
                      </div>}
                      renderItem={(e, i) => {
                        return <div key={"list" + i} className="lg:grid-cols-7 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
                          <div className="lg:col-span-1">
                            <p className="p-sm">
                              {e.OrderBy}
                            </p>
                          </div>
                          <div className="lg:col-span-3">
                            <p className="p-sm">
                              {e.WhereToShow == 1 ? "Housiy Satıcı" : "Housiy Profesyonel"}
                            </p>
                          </div>
                          <div className="lg:col-span-3 flex justify-between">
                            <p className="p-sm">
                              {e.Title}
                            </p>
                            <div className="text-gray-700 flex gap-2 items-center">
                              <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={() => { history.push(`/genel-tanitim-duzenle/${e.Id}`); }} />
                              <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { removeGeneralContent(e.Id); }} />
                            </div>
                          </div>
                        </div>
                      }}
                      sortOptions={sortOptions}
                    />
                  </div>
                  :
                  selectedTabsId === 3 ?
                    <div className="py-6">
                      <h2 className="pb-4 border-b border-gray-200">Kullanıcı Yorumları</h2>
                      <Table
                        ref={commentTableEl}
                        key={"table_3"}
                        emptyListText={"Yorum Bulunamadı"}
                        getDataFunction={getCommentList}
                        addNewButton={
                          <Button buttonMd textTiny color="text-white" className="w-64" design="button-blue-400" text="Yeni Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { history.push("/genel-yorum-duzenle"); }} />}
                        header={<div className=" lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                          <div className="lg:col-span-1 flex items-center">
                            <span className="p-sm-gray-400">
                              Gösterim Sırası
                            </span>
                          </div>
                          <div className="lg:col-span-1 flex items-center">
                            <span className="p-sm-gray-400">
                              Görsel
                            </span>
                          </div>
                          <div className="lg:col-span-2">
                            <span className="p-sm-gray-400">
                              İsim Soyisim
                            </span>
                          </div>
                          <div className="lg:col-span-2">
                            <span className="p-sm-gray-400">
                              Ünvan/Pozisyon
                            </span>
                          </div>
                          <div className="lg:col-span-2">
                            <span className="p-sm-gray-400">
                              Firma
                            </span>
                          </div>
                        </div>}
                        renderItem={(e, i) => {
                          return <div key={"list" + i} className="lg:grid-cols-8 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
                            <div className="lg:col-span-1 flex items-center">
                              <p className="p-sm">
                                {e.OrderBy}
                              </p>
                            </div>
                            <div className="lg:col-span-1">
                              <Image src={e.PhotoUrl} alt={e.NameSurname} className="w-12 h-12 object-cover rounded-full" />
                            </div>
                            <div className="lg:col-span-2">
                              <p className="p-sm">
                                {e.NameSurname}
                              </p>
                            </div>
                            <div className="lg:col-span-2">
                              <p className="p-sm">
                                {e.Title}
                              </p>
                            </div>
                            <div className="lg:col-span-2 flex justify-between">
                              <p className="p-sm">
                                {e.CompanyName}
                              </p>
                              <div className="text-gray-700 flex gap-2 items-center">
                                <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={() => { history.push(`/genel-yorum-duzenle/${e.Id}`); }} />
                                <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { removeGeneralContent(e.Id); }} />
                              </div>
                            </div>
                          </div>
                        }}
                        sortOptions={sortOptions}
                      />
                    </div>
                    :
                    <></>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
