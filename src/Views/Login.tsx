import { FunctionComponent, useState, useContext } from "react"
import { useHistory } from "react-router"
import secureStorage from "../Services/SecureStorage"
import KeyImage from '../Assets/key-image.svg'
import { Button } from "../Components/Button"
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext"
import ApiService from "../Services/ApiService"
import { FloatingInput } from "../Components/FloatingInput"

export const Login: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [userName, setUserName] = useState<string>("");

  const [password, setPassword] = useState<string>("");

  const _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      LoginFunc();
    }
  }

  const LoginFunc = async () => {
    setProcessLoading(true);

    if (userName === "" || password === "") {
      context.showModal({
        type: "Error",
        message: "Lütfen tüm alanlari doldurunuz!",
        onClose: () => { setProcessLoading(false); context.hideModal(); }
      });
    }
    else {
      const _result = await ApiService.loginUser(userName, password);

      if (_result.succeeded === true) {
        await secureStorage.setItem("AccessToken", _result.data.Token);
        context.setAccessToken(_result.data.Token);
        const _me = await ApiService.Me();
        context.setCurrentUser(_me.data);
        setProcessLoading(false);
        history.push('/');
      }
      else {
        context.showModal({
          type: "Error",
          message: _result.message,
          onClose: () => { setProcessLoading(false); context.hideModal(); }
        });
      }
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="border-b bg-white">
        <div className="container mx-auto lg:px-24 px-3">
          <img src={"https://housiystrg.blob.core.windows.net/generalmedia/housiy_logo_v1.png"} alt="housiy" className="w-32 h-16 object-contain mx-auto" />
        </div>
      </div>
      <div className="flex flex-1 h-full">
        <div className="lg:w-3/5 w-full bg-white lg:h-screen h-auto lg:pb-0 pb-8 flex flex-col">

          <div className="container mx-auto lg:px-24 px-3 flex-1 flex items-center flex-col justify-center">
            <div className="lg:min-w-520 lg:max-w-520 w-full px-6 lg:px-0">
              <h2 className="text-2xl text-black-400 leading-10 font-medium mb-8">Housiy Admin Panele Hoşgeldiniz!</h2>
              <FloatingInput className="mb-4" label="Kullanıcı Adı" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
              <FloatingInput password className="my-4" label="Şifreniz" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { _handleKeyDown(e); }} />
              <Button text="Giriş Yap" isLoading={processLoading} block design="bg-blue-400" color={"text-white"} onClick={() => { LoginFunc() }} />
            </div>
          </div>
        </div>
        <div className="lg:w-2/5 hidden bg-blue-100 h-screen lg:flex flex-col items-center justify-center relative">
          <img src={KeyImage} alt="housiy" className="w-full h-full object-contain" />
          <div className="text-xs text-gray-900 text-center lg:text-right">©2021 - Housiy | Tüm hakları saklıdır.</div>

        </div>
      </div>
    </div>
  )
}
