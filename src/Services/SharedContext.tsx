import { createContext, useEffect, useState } from "react";
import secureStorage from "./SecureStorage";

export type ErrorModalModel = {
  type: "Error";
  title?: string;
  message?: string;
  onClose?: () => void;
  onClickForFunction?: () => void;
  onClick?: () => Promise<boolean>;
  doubleButton?: boolean,
  button1Text?: string,
  button2Text?: string,
  button1Func?: () => void,
  button2Func?: () => void
}

export type SuccessModalModel = {
  type: "Success";
  title?: string;
  message?: string;
  onClose?: () => void;
  onClickForFunction?: () => void;
  onClick?: () => Promise<boolean>;
  doubleButton?: boolean,
  button1Text?: string,
  button2Text?: string,
  button1Func?: () => void,
  button2Func?: () => void
}

export type QuestionModalModel = {
  type: "Question";
  title?: string;
  message?: string;
  onClose?: () => void;
  onClickForFunction?: () => void;
  onClick?: () => Promise<boolean>,
  confirmButtonTitle?: string,
  cancelButtonTitle?: string,
  doubleButton?: boolean,
  button1Text?: string,
  button2Text?: string,
  button1Func?: () => void,
  button2Func?: () => void,
}

export type ModalModel = ErrorModalModel | SuccessModalModel | QuestionModalModel;

export type SharedContextProviderValueModel = {
  appTitle?: string;
  displayModal?: ModalModel | undefined;
  showModal: (data: ModalModel) => void;
  hideModal: () => void;
  badge?: number,
  setbadge?: (e: number) => void,
  GetPagedNotification?: (page: number, take: number) => NotificationObject[],
  SetNotification?: (notificationList: NotificationObject[], badge: number) => void,
  notificationList?: NotificationObject[],
  AddNotification?: (notification: NotificationObject) => void,
  ClearBadge?: () => void,
  MarkAsReadNotification?: (id: string) => void,
  MarkAllAsReadNotification?: () => void,
  RemoveNotification?: (id: string) => void,
  RemoveAllNotification?: () => void,
  IsLoggedIn?: () => boolean,
  currentUser: any,
  setCurrentUser: (e: any) => void,
  accessToken: string,
  setAccessToken: (e: string) => void
}
export type NotificationObject = {
  id: string,
  cleanMessage: string
  htmlMessage: string
  title: string
  extendedData: any
  date: Date
  shownDate: string
  url: string
  readed: boolean
}

export const SharedContextProvider = (props) => {

  const [displayModal, setDisplayModal] = useState<ModalModel>();

  const [notificationList, setnotificationList] = useState<NotificationObject[]>([]);

  const [badge, setbadge] = useState<number>(0);

  const [currentUser, setCurrentUser] = useState<any>(secureStorage.getItem("CurrentUser"));

  const [accessToken, setAccessToken] = useState<string>(secureStorage.getItem("AccessToken"));

  useEffect(() => {
    secureStorage.setItem("CurrentUser", currentUser);
  }, [currentUser]);

  useEffect(() => {
    secureStorage.setItem("AccessToken", accessToken);
  }, [accessToken]);

  const IsLoggedIn = () => {
    if (currentUser?.Id && currentUser?.Id > 0 && accessToken)
      return true;
    else
      return false;
  }

  const GetPagedNotification = (page, take) => {
    return (notificationList || []).slice((page - 1) * take, (page - 1) * take + take);
  };

  const SetNotification = (_notificationList, _badge) => {
    setnotificationList(_notificationList || []);
    setbadge(_badge || 0);
  };

  const AddNotification = (notification: NotificationObject) => {
    // audio.play();
    var temp = [notification].concat(notificationList || []);
    setnotificationList(temp);
    setbadge(badge + 1);
  };

  const ClearBadge = () => {
    // ApiBase.Post({
    //   url: `${Constant.GENERAL_API_URL}/mark-all-as-read-notification`,
    //   body: JSON.stringify({}),
    //   successFunction: (e) => { },
    //   errorFunction: (e) => { }
    // });
    setbadge(0);
  };

  const MarkAsReadNotification = (id) => {
    let tempList = notificationList;
    for (let i = 0; i < tempList.length; i++) {
      if (tempList[i].id === id) {
        tempList[i].readed = true;
      }
    }
    setnotificationList(tempList);
    setbadge(0);
  };

  const MarkAllAsReadNotification = () => {
    let tempList = notificationList;
    for (let i = 0; i < tempList.length; i++) {
      tempList[i].readed = true;
    }
    setnotificationList(tempList);
    setbadge(0);
  };

  const RemoveNotification = (id) => {
    let tempList = notificationList;
    for (let i = 0; i < tempList.length; i++) {
      let index = 0;
      if (tempList[i].id === id) {
        index = i;
      }
      if (index > 0) {
        tempList.splice(index, 1);
      }
    }
    setnotificationList(tempList);
    setbadge(0);
  };

  const RemoveAllNotification = () => {
    setnotificationList([]);
    setbadge(0);
  };

  const sharedContextProviderValue: SharedContextProviderValueModel = {
    appTitle: "Housiy",
    displayModal: displayModal,
    showModal: (data: ModalModel) => {
      setDisplayModal(data);
    },
    hideModal: () => {
      setDisplayModal(undefined);
    },
    badge,
    setbadge,
    GetPagedNotification,
    SetNotification,
    notificationList: notificationList,
    AddNotification,
    ClearBadge,
    MarkAsReadNotification,
    MarkAllAsReadNotification,
    RemoveNotification,
    RemoveAllNotification,
    IsLoggedIn,
    currentUser,
    setCurrentUser,
    accessToken,
    setAccessToken
  };

  return (
    <SharedContext.Provider value={sharedContextProviderValue}>{props.children}</SharedContext.Provider>
  );

}

export const SharedContext = createContext({} as SharedContextProviderValueModel);
