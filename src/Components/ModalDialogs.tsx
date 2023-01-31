import React, { FunctionComponent, useContext } from "react"
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { ErrorModal } from "./ErrorModal";
import { QuestionModal } from "./QuestionModal";
import { SuccessModal } from "./SuccessModal";

export const ModalDialogs: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  return (
    <>
      <ErrorModal
        modalType="fixedSm"
        title={context.displayModal?.title}
        errorMessage={context.displayModal?.message}
        showModal={context.displayModal !== null && context.displayModal?.type === "Error"}
        onClose={context.displayModal?.onClose}
        doubleButton={context.displayModal?.doubleButton}
        button1Func={context.displayModal?.button1Func}
        button2Func={context.displayModal?.button2Func}
        button1Text={context.displayModal?.button1Text}
        button2Text={context.displayModal?.button2Text}
      />
      <SuccessModal
        modalType="fixedSm"
        title={context.displayModal?.title}
        successMessage={context.displayModal?.message}
        showModal={context.displayModal !== null && context.displayModal?.type === "Success"}
        onClose={context.displayModal?.onClose}
        doubleButton={context.displayModal?.doubleButton}
        button1Func={context.displayModal?.button1Func}
        button2Func={context.displayModal?.button2Func}
        button1Text={context.displayModal?.button1Text}
        button2Text={context.displayModal?.button2Text}

      />
      <QuestionModal
        modalType="fixedSm"
        title={context.displayModal?.title}
        description={context.displayModal?.message}
        showModal={context.displayModal !== null && context.displayModal?.type === "Question"}
        onClose={context.displayModal?.onClose}
        onClickForFunction={context.displayModal?.onClickForFunction}
        onClick={context.displayModal?.onClick}
        doubleButton={context.displayModal?.doubleButton}
        button1Func={context.displayModal?.button1Func}
        button2Func={context.displayModal?.button2Func}
        button1Text={context.displayModal?.button1Text}
        button2Text={context.displayModal?.button2Text}
      />
    </>
  );
};
