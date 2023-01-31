import { FunctionComponent, useContext, useEffect, useState } from "react"
import { EmptyList } from "../Components/EmptyList";
import { ChainLinkIcon, RefreshIcon } from "../Components/Icons";
import { Loading } from "../Components/Loading";
import { CategoryGeneralXMLData } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

export const XmlManagement: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [loading, setLoading] = useState<boolean>();

  const [xmlData, setXmlData] = useState<CategoryGeneralXMLData>();

  useEffect(() => {
    getCategoryXmlData();
  }, []);

  const getCategoryXmlData = async () => {
    setLoading(true);

    const _result = await ApiService.getCategoryXmlData();

    if (_result.succeeded === true) {
      setXmlData(_result.data);
      setLoading(false);
    }
    else {
      setLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }
  }

  const updateCategoryXmlData = async (CategoryId: number) => {

    const _result = await ApiService.updateCategoryXmlData(CategoryId);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "XML güncellendi",
        onClose: () => { context.hideModal(); getCategoryXmlData(); }
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

  const updateCimriXmlData = async () => {

    const _result = await ApiService.updateCimriXmlData();

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "XML güncellendi",
        onClose: () => { context.hideModal(); getCategoryXmlData(); }
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

  const handleJsDate = (JsTime) => {
    try {
      var time = new Date(JsTime);
      return time.toLocaleString() ?? "";
    }
    catch {
      return ""
    }
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="pb-5">XML Yönetimi</h2>
        <div className=" lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
          <div className="lg:col-span-3">
            <span className="p-sm-gray-400">
              Kategori Adı
            </span>
          </div>
          <div className="lg:col-span-3">
            <span className="p-sm-gray-400">
              XML Url
            </span>
          </div>
          <div className="lg:col-span-2">
            <span className="p-sm-gray-400">
              Son Güncelleme Tarihi
            </span>
          </div>
        </div>
        {
          loading ?
            <>
              <Loading width="w-full" height="h-20" />
              <Loading width="w-full" height="h-20" />
              <Loading width="w-full" height="h-20" />
              <Loading width="w-full" height="h-20" />
              <Loading width="w-full" height="h-20" />
            </>
            :
            <>
              {
                xmlData?.cimriXmlData?.xmlUrl &&
                <>
                  <div className="lg:grid-cols-8 px-2 border-b py-7 border-gray-200 hidden lg:grid flex gap-4 items-center">
                    <div className="lg:col-span-3 flex items-center">
                      <p className="p-sm">
                        {"Cimri XML"}
                      </p>
                    </div>
                    <div className="lg:col-span-3 flex items-center">
                      <p className="p-sm">
                        {xmlData.cimriXmlData.xmlUrl}
                      </p>
                    </div>
                    <div className="lg:col-span-2 flex items-center justify-between">
                      <p className="p-sm">
                        {handleJsDate(xmlData.cimriXmlData.LastUpdatedDateJSTime)}
                      </p>
                      <div className="flex items-center gap-2">
                        <RefreshIcon className="w-8 h-5 hover:hover:text-blue-400 cursor-pointer transition-all" onClick={() => { updateCimriXmlData(); }} />
                        <a href={xmlData.cimriXmlData.xmlUrl} download>
                          <ChainLinkIcon className="w-8 h-5 hover:hover:text-blue-400 cursor-pointer transition-all" />
                        </a>
                      </div>
                    </div>
                  </div>
                </>
              }
              {
                xmlData?.catList && (xmlData.catList?.length ?? 0) > 0 ?
                  <>
                    {
                      xmlData.catList.map((e, i) => (
                        <div key={"list" + i} className="lg:grid-cols-8 px-2 border-b py-7 border-gray-200 hidden lg:grid flex gap-4 items-center">
                          <div className="lg:col-span-3 flex items-center">
                            <p className="p-sm">
                              {e.CategoryName}
                            </p>
                          </div>
                          <div className="lg:col-span-3 flex items-center">
                            <p className="p-sm">
                              {e.xmlUrl}
                            </p>
                          </div>
                          <div className="lg:col-span-2 flex items-center justify-between">
                            <p className="p-sm">
                              {handleJsDate(e.LastUpdatedDateJSTime)}
                            </p>
                            <div className="flex items-center gap-2">
                              <RefreshIcon className="w-8 h-5 hover:hover:text-blue-400 cursor-pointer transition-all" onClick={() => { updateCategoryXmlData(e.CategoryId); }} />
                              <a href={e.xmlUrl} download>
                                <ChainLinkIcon className="w-8 h-5 hover:hover:text-blue-400 cursor-pointer transition-all" />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </>
                  :
                  <>
                    {
                      !xmlData?.cimriXmlData.xmlUrl &&
                      <div className="py-4">
                        <EmptyList text={"XML Verisi Bulunamadı"} />
                      </div>
                    }
                  </>
              }
            </>
        }
      </div>
    </div>
  )
}
