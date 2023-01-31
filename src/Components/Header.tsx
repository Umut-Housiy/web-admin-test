import { FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ApiService from "../Services/ApiService";
import { SharedContextProviderValueModel, SharedContext } from "../Services/SharedContext";
import { EmptyList } from "./EmptyList";
import { BellIcon, ChevronDownIcon, CloseIcon, NotificationIcon, SignoutIcon } from "./Icons";
import { SearchBarHeader } from "./SearchBarHeader";
import { useStateEffect } from "./UseStateEffect";
import { useWebSocket } from "./useWebSocket";

export const Header: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const adminInfo = {
    pictureUrl: "https://picsum.photos/id/237/300/300",
    currentUserName: context.currentUser?.Username,
  };

  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const [refsocketValue] = useState(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useWebSocket("A" + context.currentUser?.Id);
  });

  const socket = useRef(refsocketValue);

  const getNotifications = async () => {
    const result = await ApiService.getNotifications();

    if (result.succeeded) {
      context.SetNotification?.(result.data.notifications, result.data.badge);
    }
  }

  const markAsReadNotificationFunc = async (notificationId) => {
    await ApiService.markAsReadNotification(notificationId);
  }

  const markAllAsReadNotificationFunc = async () => {
    await ApiService.markAllAsReadNotification();

    if (context.MarkAllAsReadNotification) {
      context.MarkAllAsReadNotification();
    }
  }

  const removeAllNotificationFunc = async () => {
    await ApiService.removeAllNotification();

    if (context.RemoveAllNotification) {
      context.RemoveAllNotification();
    }
  }

  useEffect(() => {
    if (context.IsLoggedIn?.()) {
      socket.current.on("notification", (notification) => {
        context.AddNotification?.(notification);
      });
      socket.current.on("notification-markasread", (id) => {
        context.MarkAsReadNotification?.(id);
      });
      socket.current.on("notification-markallasread", () => {
        context.MarkAllAsReadNotification?.();
      });
      socket.current.on("notification-remove", (id) => {
        context.RemoveNotification?.(id);
      });
      socket.current.on("notification-removeall", () => {
        context.RemoveAllNotification?.();
      });

      getNotifications();
    }
  }, [])

  const getDate = () => {
    let currentDate = new Date();
    const monthName = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"][currentDate.getMonth()];
    let dayName = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'][currentDate.getDay()]
    return currentDate.getDate() + ' ' + monthName + ' ' + currentDate.getFullYear() + ', ' + dayName;
  }

  const [showNotificationBox, setShowNotificationBox] = useState<boolean>(false);

  const [notificationPage, setNotificationPage] = useState<number>(1);

  useStateEffect(() => {
    setNotificationPage(1);
  }, [showNotificationBox]);

  return (
    <>
      <div className="fixed top-0 right-0 left-16 py-4 bg-white z-60">
        <div className="flex pr-6">
          <img src={"https://housiystrg.blob.core.windows.net/generalmedia/housiy_logo_v1.png"} alt="housiy" onClick={() => { history.push("/"); }} className="pl-2 h-8 my-auto cursor-pointer" />
          <SearchBarHeader />
          <div className="flex">
            <div className="flex items-center">
              <div className="flex flex-col mr-6">
                <h4>Hoşgeldiniz</h4>
                <p className="p-sm-gray-700">{getDate()}</p>
              </div>
              <div className="relative mr-6">
                {(context.notificationList?.some(e => e.readed == false) === true) ?
                  <NotificationIcon className="icon-md cursor-pointer" onClick={() => { setShowNotificationBox(!showNotificationBox); }} />
                  :
                  <BellIcon className="icon-md cursor-pointer text-gray-900" onClick={() => { setShowNotificationBox(!showNotificationBox); }} />
                }
                {
                  showNotificationBox &&
                  <>
                    <div className="fixed w-full h-full top-0 left-0 bg-black-400 opacity-0 z-50" onClick={() => { setShowNotificationBox(false); }}></div>
                    <div className="absolute w-96  bg-white rounded-lg shadow-md -bottom-96 -left-96 transform translate-x-48 ml-2.5 -mb-4 z-60 border border-gray-200">
                      <div className="absolute top-0 w-4 h-4  transform rotate-45 -translate-y-2 inset-x-1/2 -translate-x-1/2 bg-white border-t border-l border-gray-200"></div>
                      <div className="h-96 overflow-y-auto custom-scrollbar">
                        <div className="p-4">
                          <div className="flex items-center border-b border-gray-200 pb-4 justify-between">
                            <div className="text-tiny text-black-400 font-medium">Bildirimler</div>
                            <CloseIcon className="icon-sm text-gray-700 cursor-pointer" onClick={() => { setShowNotificationBox(false); }} />
                          </div>
                          {(context?.GetPagedNotification && context.GetPagedNotification(1, 10).length > 0) ?
                            <div className="flex items-center border-b border-gray-200 mt-4 pb-4 justify-between">
                              <div className="text-sm text-blue-400 font-medium cursor-pointer" onClick={() => { markAllAsReadNotificationFunc(); }}>Tümünü Okundu Olarak İşaretle</div>
                              <div className="text-sm text-gray-700 font-medium cursor-pointer" onClick={() => { removeAllNotificationFunc(); }}>Tümünü Sil</div>
                            </div>
                            :
                            <></>
                          }
                          <div className="mt-4">
                            {(context?.GetPagedNotification && context.GetPagedNotification(1, notificationPage <= 2 ? (10 * notificationPage) : 200).length > 0) ?
                              <>
                                {
                                  context.GetPagedNotification(1, notificationPage <= 2 ? (10 * notificationPage) : 200).map((item) => (
                                    <Link to={item.url} className="flex items-center gap-2 mt-4 cursor-pointer" onClick={() => {
                                      if (context.MarkAsReadNotification) {
                                        context.MarkAsReadNotification(item.id)
                                      }
                                      markAsReadNotificationFunc(item.id);
                                      setShowNotificationBox(false);
                                    }}>
                                      {
                                        item.readed ?
                                          <div className="w-2 h-2 min-w-2 min-h-2 bg-gray-400 rounded-full"></div>
                                          :
                                          <div className="w-2 h-2 min-w-2 min-h-2 bg-red-400 rounded-full"></div>
                                      }
                                      <div>
                                        <div className={`${item.readed ? "text-gray-400" : "text-black-400"} font-medium text-sm hover:text-blue-400 duration-300`}>{item.htmlMessage + "..."}</div>
                                        <div className="text-gray-700 text-sm mt-1">{item.shownDate}</div>
                                      </div>
                                    </Link>
                                  ))
                                }
                                {
                                  notificationPage <= 2 &&
                                  <div className="text-blue-400 text-sm font-medium mt-4 text-center cursor-pointer" onClick={() => { setNotificationPage(notificationPage + 1); }}>Daha Fazla Yükle</div>
                                }
                              </>
                              :
                              <>
                                <EmptyList text={"Bildirim Yok"} />
                              </>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                }
              </div>
            </div>
            <div className="relative z-30">
              <div className="flex items-center p-1.5 border rounded-lg border-gray-200  w-56 cursor-pointer hover:bg-gray-100" onClick={() => { setShowDropdown(!showDropdown) }}>
                <img src={adminInfo.pictureUrl} alt={adminInfo.pictureUrl} className="h-8 w-8 border border-gray-200 rounded-full object-contain" />
                <div className="flex flex-col ml-3">
                  <p className="p-sm">{adminInfo.currentUserName}</p>
                  <p className="p-sm font-medium">Admin</p>
                </div>
                <ChevronDownIcon className={`${showDropdown ? "transform -rotate-180" : ""} transition-all ease-in icon-sm text-gray-700 ml-auto`} />
              </div>
              {showDropdown &&
                <div className="absolute top-12 right-0 left-0	bg-white  pb-1 px-2 border border-gray-200 rounded-b-md">
                  <div className="text-gray-900 flex p-3 hover:text-red-400 transition duration-200 ease-out cursor-pointer">
                    <SignoutIcon className="icon-sm" />
                    <span
                      className="ml-2  text-sm font-medium"
                      onClick={() => {
                        context.setAccessToken("");
                        context.setCurrentUser(null);
                        window.location.href = "/giris-yap";
                      }}
                    >Çıkış Yap</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      {showDropdown &&
        <div className="absolute inset-0 opacity-50 z-10" onClick={() => { setShowDropdown(false) }}></div>
      }
    </>
  )
}
