import { FunctionComponent } from "react"
import InputMask from 'react-input-mask';
import { Loading } from "./Loading";

interface InputMaskProps {
  phone?: boolean
  creditCard?: boolean
  securtiyCode?: boolean
  value: string,
  onChange: any;
  disabled?: boolean,
  clock?: boolean,
  IBAN?: boolean,
  loading?: boolean,
  expiryDate?: boolean,
  isAmex?: boolean,
  isAmexCvv?: boolean,
  placeholder?: string,
  welcome?: boolean,
  className?: string,
  idForLabel?: string
}
export const InputWithMaskFloating: FunctionComponent<InputMaskProps> = (props: InputMaskProps) => {
  return (
    <>
      {props.loading ? <Loading inputSm /> :

        <div className={`${props.className ? props.className : ""} grid w-full`}>
          <label htmlFor={props.idForLabel} className="floating-label-wrapper-just-left  just-right-radius">
            <InputMask
              id={props.idForLabel}
              mask={`${props.phone ? "(999) 999 99 99" : props.creditCard ? "9999 9999 9999 9999" : props.isAmex ? "9999 999999 99999" : props.securtiyCode ? "9999" : props.clock ? "99 : 99" : props.IBAN ? "TR99 9999 9999 9999 9999 9999 99" : props.expiryDate ? "99 / 99" : props.isAmexCvv && "9999"}`}
              className={`${props.disabled ? "pointer-events-none bg-gray-100" : "bg-white "} ${props.welcome ? "floating-label-input" : "form-input-sm"} text-sm `}
              maskChar={null}
              placeholder={`${props.placeholder ? props.placeholder : props.phone ? "(___) ___ __ __" : props.creditCard ? "____ ____ ____ ____" : props.isAmex ? "---- ------ -----" : props.isAmexCvv ? "----" : props.IBAN ? "__ ____ ____ ____ ____ ____ __" : props.clock ? "sa : dk" : props.securtiyCode ? "" : props.expiryDate ? "ay / yıl" : ""}`}
              type={`${props.phone ? "tel" : "text"}`}
              value={props.value}
              onChange={props.onChange}
            />
            <span className="floating-label">Telefon Numaranız</span>
          </label>
        </div>

      }
    </>
  )
}
