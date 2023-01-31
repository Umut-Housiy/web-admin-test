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
  IBAN?: boolean,
  clock?: boolean,
  loading?: boolean,
  percentage?: boolean,
  formInputMd?: boolean
}
export const InputWithMask: FunctionComponent<InputMaskProps> = (props: InputMaskProps) => {
  return (
    <>
      {props.loading ? <Loading inputSm /> :
        <InputMask
          mask={`${props.phone ? "(999) 999 99 99" : props.creditCard ? "9999 9999 9999 9999" : props.securtiyCode ? "9999" : props.clock ? "99 : 99" : props.IBAN ? "TR99 9999999999999999999999" : props.percentage && "%99"}`}
          className={`${props.disabled ? "pointer-events-none bg-gray-100" : "bg-white "} form-input text-sm `}
          maskChar={null}
          placeholder={`${props.phone ? "(___) ___ __ __" : props.creditCard ? "____ ____ ____ ____" : props.IBAN ? "__ ____ ____ ____ ____ ____ __" : props.clock ? "sa : dk" : props.securtiyCode ? "" : props.percentage && ""}`}
          type={`${props.phone ? "tel" : "text"}`}
          value={props.value}
          onChange={props.onChange}
        />
      }
    </>
  )
}
