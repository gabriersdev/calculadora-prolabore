import {Button} from "./ui/button"
import moment from "moment";
import {useCallback, useEffect, useMemo, useState} from "react";
import FormGroup from "./FormGroup.jsx";
import $ from "jquery";

export default function PrintProlabore() {
  const [state, setState] = useState({
    "show": false,
    "CNPJ": "",
    "CPF": "",
    "enterprise-name": "",
    "person-name": "",
    "document-reference": moment(moment.now()).format("MM/YYYY")
  })
  
  const formFields = useMemo(() => [
    {
      type: "text",
      id: "CNPJ",
      placeholder: "00.000.000/0000-00",
      label: "CNPJ",
      options: {inputMode: "numeric"},
      mask: "CNPJ"
    },
    {
      type: "text",
      id: "enterprise-name",
      placeholder: "",
      label: "Razão Social",
    },
    {
      type: "text",
      id: "CPF",
      placeholder: "000.000.000-00",
      label: "CPF do sócio ou proprietário",
      options: {inputMode: "numeric"},
      mask: "CPF"
    },
    {
      type: "text",
      id: "person-name",
      placeholder: "",
      label: "Nome do sócio ou proprietário",
    },
    {
      type: "text",
      id: "document-reference",
      placeholder: "00/0000",
      label: "Referência",
      options: {inputMode: "numeric"},
      mask: "date-reference"
    },
  ], []);
  
  // TODO - separar isso do form e tal em outro componente
  useEffect(() => {
    console.log(new Date())
    
    const inputsCNPJ = $('[data-mask="CNPJ"]')
    const inputsCPF = $('[data-mask="CPF"]')
    const inputsDR = $('[data-mask="date-reference"]')
    
    inputsCNPJ.mask('00.000.000/0000-00', {
      reverse: true,
      placeholder: '00.000.000/0000-00'
    });
    
    inputsCPF.mask('00.000.000-00', {
      reverse: true,
      placeholder: '00.000.000-00',
    })
    
    inputsDR.mask('00/0000', {
      reverse: true,
      placeholder: '00/0000',
    })
    
    const inputs = [...inputsCNPJ, ...inputsCPF, ...inputsDR]
    
    inputs.forEach(input => {
      console.log(input);
      $(input).on("input", (e) => {
        console.log(e.target.value)
        setState((prev) => ({
          ...prev,
          [e.target.id]: e.target.value
        }))
      })
    })
    
    return () => {
      [inputsCNPJ, inputsCPF, inputsDR].forEach(i => {
        $(i).unmask();
        $(i).off("input");
      })
    }
  }, []);
  
  useEffect(() => {
    if (state.show) document.querySelector(`#CNPJ`).focus();
  }, [state.show]);
  
  const handleChange = useCallback((e) => {
    const {id, value} = e.target;
    setState((prev) => ({...prev, [id]: value,}));
  }, []);
  
  return (
    <>
      <Button type={"button"} className={"focus:outline-accent-foreground mt-4  text-[16px]"} onClick={() => {
        handleChange({target: {id: "show", value: !state.show}})
      }}>
        Imprimir
      </Button>
      
      {
        state.show ? (
          <form className={"mt-8 flex flex-col gap-2"}>
            <h2 className={"text-xl font-medium m-0 p-0"}>Dados do documento {JSON.stringify(new Date())}</h2>
            <fieldset className={"grid grid-cols-2 gap-4 auto-rows-auto max-w-[768px]:grid-cols-1"}>
              {
                formFields.map((field) => (
                  <div key={field.id} className={"mt-4"}>
                    <FormGroup params={{...field, options: (field.options ? {...field.options, required: true} : {required: true})}} state={state}
                               handleChange={handleChange}/>
                  </div>
                ))
              }
              <div className={"flex justify-end items-end"}>
                <Button type={"submit"} className={"w-56  text-[16px]"} onClick={() => {
                }}>
                  Continuar {"->"}
                </Button>
              </div>
            </fieldset>
          </form>
        ) : ""
      }
    </>
  )
}
