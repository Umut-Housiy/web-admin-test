import { FunctionComponent, useContext, useRef } from "react"
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { Link, useHistory } from "react-router-dom";
import ApiService from "../../Services/ApiService";
import { Table } from "../../Components/Table";
import { DiscountCouponModel } from "../../Models";
import { ChevronRightIcon, TrashIcon } from "../../Components/Icons";
import { formatter, fraction } from "../../Services/Functions";

interface DiscountCouponsProps {
  UserId: number,
}

export const DiscountCoupons: FunctionComponent<DiscountCouponsProps> = (props: DiscountCouponsProps) => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const history = useHistory();

  const getUsersDiscountCouponListForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getUsersDiscountCouponListForAdmin(props.UserId, page, take, searchText, order);

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

  const removeDiscountCoupon = (item) => {
    context.showModal({
      type: "Question",
      title: "Kupon Sil",
      message: "İndirim kuponu silinecek. Emin misiniz?",
      onClick: async () => {
        const _result = await ApiService.removeDiscountCoupon(item.Id);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Kupon başarıyla silindi",
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
    <Table
      ref={tableEl}
      emptyListText={"Kupon Bulunamadı"}
      getDataFunction={getUsersDiscountCouponListForAdmin}
      header={
        <div className=" lg:grid-cols-5 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4 flex items-center">
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Kupon Kodu
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Kupon Adı
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Min. Tutar
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Geçerlilik Tarihi
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Kupon Bedeli
            </span>
          </div>
        </div>
      }
      renderItem={(e: DiscountCouponModel, i) => {
        return <div className="lg:grid-cols-5 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center" key={i} >
          <div className="lg:col-span-1 gap-2 flex items-center">
            <p className="p-sm">
              {e.Code}
            </p>
          </div>
          <div className="lg:col-span-1 flex items-center ">
            <p className="p-sm">
              {e.Title}
            </p>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <p className="p-sm">
              {e.MinimumCartPrice % 1 === 0 ?
                <>{fraction.format(e.MinimumCartPrice)} TL </>
                :
                <>{formatter.format(e.MinimumCartPrice)} TL</>
              }
            </p>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <p className="p-sm">
              {handleJsDate(e.StartDateJS) + "-" + handleJsDate(e.EndDateJS)}
            </p>
          </div>
          <div className="lg:col-span-1 flex items-center justify-between">
            <p className="p-sm">
              {e.Discount % 1 === 0 ?
                <>{fraction.format(e.Discount)} TL </>
                :
                <>{formatter.format(e.Discount)} TL</>
              }
            </p>
            <div className="flex gap-2 items-center">
              <TrashIcon className="w-8 h-5 hover:hover:text-blue-400 cursor-pointer transition-all cursor-pointer" onClick={() => { removeDiscountCoupon(e); }} />
              <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400 cursor-pointer transition-all cursor-pointer" onClick={() => { history.push("/indirim-kuponu-duzenle/" + e.Id); }} />
            </div>
          </div>
        </div>
      }}
    />
  )
}
