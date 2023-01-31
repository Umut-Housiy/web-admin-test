import { FunctionComponent, useContext, useRef } from "react"
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "../Components/Icons";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Image } from "../Components/Image"
import { Table } from "../Components/Table";
import { SiteUserModel } from "../Models";
import { formatter, fraction, readPageQueryString } from "../Services/Functions"

export const SiteUserList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const getSiteUserList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSiteUserList(page, take, searchText, order);

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

  const handleJsDate = (JsTime) => {
    try {
      if (JsTime < 0) {
        return "-";
      }
      else {
        var time = new Date(JsTime);
        return time.toLocaleDateString() ?? "";
      }
    }
    catch {
      return ""
    }
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="pb-5">Üye Listesi</h2>
        <Table
          ref={tableEl}
          emptyListText={"Kategori Bulunamadı"}
          getDataFunction={getSiteUserList}
          header={
            <div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4 flex items-center">
              <div className="lg:col-span-2 flex items-center">
                <span className="p-sm-gray-400">
                  Üye Adı
                </span>
              </div>
              <div className="lg:col-span-2">
                <span className="p-sm-gray-400">
                  Üyelik Tarihi
                </span>
              </div>
              <div className="lg:col-span-2">
                <span className="p-sm-gray-400">
                  Telefon Numarası
                </span>
              </div>
              <div className="lg:col-span-2">
                <span className="p-sm-gray-400">
                  Doğum Tarihi
                </span>
              </div>
              <div className="lg:col-span-2">
                <span className="p-sm-gray-400">
                  Sepetindeki Ürün Sayısı
                </span>
              </div>
              <div className="lg:col-span-2">
                <span className="p-sm-gray-400">
                  Toplam Alışveriş Tutarı
                </span>
              </div>
            </div>
          }
          renderItem={(e: SiteUserModel, i) => {
            return <div className="lg:grid-cols-12 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center" key={i} >
              <div className="lg:col-span-2 gap-2 flex items-center">
                <Image src={e.UserPhoto ?? ""} alt={e.NameSurname} className="w-10 h-10 rounded-full object-cover" />
                <p className="p-sm">
                  {e.NameSurname}
                </p>
              </div>
              <div className="lg:col-span-2  flex lg:block items-center">
                <p className="p-sm">
                  {handleJsDate(e.CreatedDateJS)}
                </p>
              </div>
              <div className="lg:col-span-2  flex lg:block items-center">
                <p className="p-sm">
                  {e.PhonePreview ?? ""}
                </p>
              </div>
              <div className="lg:col-span-2  flex lg:block items-center">
                <p className="p-sm">
                  {handleJsDate(e.BirthDateJS)}
                </p>
              </div>
              <div className="lg:col-span-2  flex lg:block items-center">
                <p className="p-sm">
                  {e.CartProductCount}
                </p>
              </div>
              <div className="lg:col-span-2 flex justify-between">
                <p className="p-sm">
                  {e.TotalShoppingPrice % 1 === 0 ?
                    <>{fraction.format(e.TotalShoppingPrice)} TL </>
                    :
                    <>{formatter.format(e.TotalShoppingPrice)} TL</>
                  }
                </p>
                <div className="text-gray-700 flex gap-2 items-center">
                  <Link to={{ pathname: `${"/uye-detay/" + e.Id}`, state: { isEditActive: false, queryPage: Number(readPageQueryString(window.location) ?? "1") } }} >
                    <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400   cursor-pointer transition-all " />
                  </Link>
                </div>
              </div>
            </div>
          }}
          page={Number(readPageQueryString(window.location) ?? "1")}
          setPageQueryString
        />
      </div>
    </div>
  )
}
