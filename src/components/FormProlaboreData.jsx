import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import $ from "jquery";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import FormGroup from "./FormGroup.jsx";
import {Button} from "./ui/button.js";
import moment from "moment";
import PropTypes from "prop-types";
import {Theme as Context} from "./Calculator.jsx"
import Util from "../util/Util.js";

const UseFormProlaboreData = ({setState}) => {
  document.querySelector(`#CNPJ`).focus();
  
  const inputsCNPJ = $('[data-mask="CNPJ"]')
  const inputsCPF = $('[data-mask="CPF"]')
  const inputsDR = $('[data-mask="date-reference"]')
  
  inputsCNPJ.mask('00.000.000/0000-00', {
    reverse: true,
    placeholder: '00.000.000/0000-00'
  });
  
  inputsCPF.mask('000.000.000-00', {
    reverse: true,
    placeholder: '000.000.000-00',
  })
  
  inputsDR.mask('00/0000', {
    reverse: true,
    placeholder: '00/0000',
  })
  
  const inputs = [...inputsCNPJ, ...inputsCPF, ...inputsDR]
  
  inputs.forEach(input => {
    $(input).on("input", (e) => {
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
}

export default function FormProlaboreData() {
  const context = useContext(Context);
  const {resultsCalculate} = context
  
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
  
  useEffect(() => {
    UseFormProlaboreData({setState})
  }, []);
  
  const handleChange = useCallback((e) => {
    const {id, value} = e.target;
    setState((prev) => ({...prev, [id]: value,}));
  }, []);
  
  const handlePrint = useCallback((e) => {
    const lenghtForValues = Object.values(state).filter(o => typeof o === "string").map(o => (o || "").trim().length)
    const existsEmptyValue = ![undefined, null].includes(lenghtForValues.find(l => l === 0))
    
    const form = e.target.tagName === "form" ? e.target : e.target.closest("form");
    const inputs = Array.from(form.querySelectorAll("input[required]"))
    let mess = ""
    let inputTargetId = ""
    
    inputs.forEach(input => {
      input.setCustomValidity("")
    });
    
    if (existsEmptyValue) {
      inputs.find(i => i.value.trim().length === 0).setCustomValidity("Você precisa preencher este campo!");
      return;
    } else if (state.CPF.match(/\d/g).length !== 11) {
      mess = "O CPF deve ter 11 dígitos, todos númericos!"
      inputTargetId = "CPF"
    } else if (state.CNPJ.match(/\d/g).length !== 14) {
      mess = "O CNPJ deve ter 14 dígitos, todos númericos"
      inputTargetId = "CNPJ"
    } else if (state["document-reference"].match(/\d/g).length !== 6) {
      mess = "A referência precisa seguir o padrão 00/0000 - dois dígitos para o mês, seguido de 4 para o ano"
      inputTargetId = "document-reference"
    } else if (!Util.verifyCPF(state.CPF)) {
      mess = "O CPF informado não é válido! Gentileza verifique."
      inputTargetId = "CPF"
    } else if (!Util.verifyCNPJ(state.CNPJ)) {
      mess = "O CNPJ informado não é válido! Gentileza verifique."
      inputTargetId = "CNPJ"
    }
    else {
      mess = ""
      inputTargetId = ""
    }
    
    if (mess) {
      alert(mess)
      const input = inputs.find(i => i.id === inputTargetId)
      if (input) input.setCustomValidity(mess)
      return;
    }
    
    e.preventDefault();
    
    if (!resultsCalculate) {
      alert("Resultados não foram recebidos!")
      return;
    }
    
    const doc = new jsPDF()
    const personName = `${(state["person-name"] || "").toUpperCase()}`
    const enterpriseName = `${(state["enterprise-name"] || "").toUpperCase()}`
    const liquidSallary = resultsCalculate.find(r => r[0].toLowerCase() === "líquido")[3]
    
    autoTable(doc, {
      head: [["CPF", "Sócio/Administrador", "Referência"]],
      body: [[state.CPF, personName, state["document-reference"]]],
      startY: 40,
      styles: {headStyle: {fillColor: [255, 255, 255], textColor: [0, 0, 0]}, alternateRowStyles: {fillColor: [255, 255, 255]}, tableLineColor: [0, 0, 0], tableLineWidth: 0.1,},
    })
    
    autoTable(doc, {
      head: [[' ', 'Alíquota', 'Alíquota real', 'Valor']],
      body: resultsCalculate,
      startY: 60,
      pageBreak: "auto",
      styles: {headStyles: {fillColor: [124, 95, 240]}, alternateRowStyles: {fillColor: [231, 215, 252]}, tableLineColor: [124, 95, 240], tableLineWidth: 0.1,}
    })
    
    doc.text(`${enterpriseName}`, 10, 20);
    doc.text(`${state.CNPJ}`, 10, 30);
    doc.text(`Eu, ${personName}, recebi a quantia ${liquidSallary ? `de ${liquidSallary}` : 'descrita acima'} \nreferente ao serviço prestado como sócio/administrador da empresa \n${enterpriseName} em ${new Date(moment.now()).toLocaleDateString("pt-BR", {day: "numeric", month: "long", year: "numeric"})}.`, 10, 110,);
    doc.text(`___________________________________`, 10, 140);
    doc.text(`${personName}, CPF ${state.CPF}`, 10, 150);
    
    doc.save(`Prolabore-V${(new Date().getTime())}`);
  }, [resultsCalculate, state])
  
  return (
    <form className={"mt-8 flex flex-col gap-2"}>
      <h2 className={"text-xl font-medium m-0 p-0 text-white"}>Dados do documento</h2>
      <fieldset className={"grid grid-cols-2 gap-4 auto-rows-auto max-w-[768px]:grid-cols-1"}>
        {
          formFields.map((field) => (
            <div key={field.id} className={"mt-4"}>
              <FormGroup
                params={{...field, options: (field.options ? {...field.options, required: true} : {required: true})}}
                state={state} handleChange={handleChange}/>
            </div>
          ))
        }
        <div className={"flex justify-end items-end"}>
          <Button type={"submit"} className={"w-56  text-[16px]"} onClick={handlePrint}>
            Continuar {"->"}
          </Button>
        </div>
      </fieldset>
    </form>
  )
}

UseFormProlaboreData.propTypes = {
  setState: PropTypes.func.isRequired
}