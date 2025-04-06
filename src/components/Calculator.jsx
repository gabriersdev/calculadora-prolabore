import PropTypes from "prop-types";
import {useCallback, useEffect, useMemo, useRef, useState, createContext} from "react";
import $ from "jquery";

import config from "../data/config.js";
import ClassCalculator from "../classes/Calculator.js";

import {Input} from "./ui/input.js";
import FormGroup from "./FormGroup.jsx";
import {Button} from "./ui/button.js";

import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "./ui/table.js";
import PrintProlabore from "./PrintProlabore.jsx";

const Theme = createContext({});

const RenderResults = ({state}) => {
  const formatCondition = useCallback((index) => {
    return index === state.result.length - 1 ? "font-bold" : ""
  }, [state.result.length]);
  
  const handleCopy = useCallback((text) => {
    navigator.clipboard.writeText(text.replace(/[(R$)\s]/g, "")).then(() => {
      alert("Copiado!")
    }).catch((e) => {
      console.log(e)
      alert("Erro!" + " " + e.message)
    })
  }, [])
  
  return (
    <div className="flex gap-1 flex-col mt-8">
      <h2 className={"text-zinc-400"}>Resultado</h2>
      <Table>
        <TableCaption>
          <span className={"text-zinc-400"}>Cálculo do pró-labore.</span>
        </TableCaption>
        <TableHeader>
          <TableRow className={"border-b-accent-foreground hover:bg-inherit"}>
            <TableHead>#</TableHead>
            <TableHead>Alíquota</TableHead>
            <TableHead>Alíquota real</TableHead>
            <TableHead className="text-right">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={"[&_*]:text-zinc-300"}>
          {
            state.result.map((item, index) => {
                return (
                  <TableRow key={index} className={"border-b-accent-foreground hover:bg-accent-foreground"}>
                    <TableCell className="font-bold">{item[0]}</TableCell>
                    <TableCell className={`${formatCondition(index)}`}>{item[1]}</TableCell>
                    <TableCell className={`${formatCondition(index)}`}>{item[2]}</TableCell>
                    <TableCell className={`${formatCondition(index)} text-right`} onClick={() => {
                      handleCopy(item[3])
                    }}>{item[3]}</TableCell>
                  </TableRow>
                )
              }
            )
          }
        </TableBody>
      </Table>
      
      <PrintProlabore/>
    </div>
  )
}

const UseCalculator = ({setState, inputValue}) => {
  const inputsMoney = $('[data-mask="money"]')
  const inputNumber0 = $('[data-mask="number-0"]')
  
  inputsMoney.mask('#.##0,00', {
    reverse: true,
    placeholder: 'R$ 0,00'
  });
  
  inputNumber0.mask('#', {
    maxLength: 1,
    placeholder: '0'
  })
  
  const inputs = [inputsMoney, inputNumber0]
  
  inputs.forEach(inputs => {
    $(inputs).each((i, input) => {
      $(input).on("input", (e) => {
        setState((prev) => ({
          ...prev,
          [e.target.id]: e.target.value
        }))
      })
    })
  })
  
  if (inputValue.current && !inputValue.current.isFocused) inputValue.current.focus();
  
  return () => {
    inputs.forEach(input => {
      $(input).unmask();
      $(input).off("input");
    })
  }
}

const FormCalulator = ({formFields, state, handleChange, handleSubmit}) => {
  return (
    <form className="flex flex-col gap-4 flex-wrap">
      <fieldset className="grid grid-cols-2 auto-rows-auto max-w-[768px]:grid-cols-1 flex-col gap-4 flex-wrap">
        {
          formFields.filter(f => f.mask).map(({id, type, label, placeholder, mask, options}) => (
            <div className="flex gap-1 flex-col" key={`${id}`}>
              <label className="text-zinc-400" htmlFor={`${id}`}>
                {label}{options.required ? (<span className={"text-red-600"}>*</span>) : ''}
              </label>
              <Input
                type={`${type}`}
                placeholder={`${placeholder}`}
                className="border-zinc-700 focus:border-zinc-500 text-gray-300 placeholder:text-zinc-400"
                id={`${id}`}
                required
                value={state[id] ?? ""}
                onChange={handleChange}
                autoComplete="off"
                data-mask={mask ?? ""}
                {...options}
              />
            </div>
          ))
        }
        {formFields.filter(f => !f.mask).map(form => (<FormGroup params={form} state={state} handleChange={handleChange} key={form.id}/>))}
      </fieldset>
      <Button type={"submit"} className={"focus:outline-accent-foreground text-[16px]"} onClick={handleSubmit}>Calcular</Button>
    </form>
  )
}

const Calculator = () => {
  const [state, setState] = useState({
    value: "",
    "count-depends": "0",
    "result": []
  });
  const minSalary = useRef(config["min-salary"]);
  const inputValue = useRef(null);
  
  useEffect(() => {
    UseCalculator({setState, inputValue});
  }, []);
  
  const handleChange = useCallback((e) => {
    const {id, value} = e.target;
    setState((prev) => ({...prev, [id]: value,}));
  }, []);
  
  const handleSubmit = (e) => {
    if (!state.value.trim()) {
      inputValue.current.setCustomValidity("É necessário informar o valor!");
    } else if (!state["count-depends"].trim()) {
      alert("Preencha todos os campos!");
    } else {
      inputValue.current.setCustomValidity("");
      e.preventDefault()
      
      const salary = state.value.trim().replace(/[\sA-Z]*/gi, "").replace(/\./g, "").replace(/,/g, ".")
      
      if (isNaN(parseFloat(salary)) || salary.startsWith("e") || salary.endsWith("e")) alert("Informe o valor do pró-labore corretamente!")
      else {
        const calc = new ClassCalculator()
        calc.setValores(parseFloat(salary), parseInt(state["count-depends"] ?? 0))
        setState((prev) => ({...prev, ["result"]: calc.calcularProlabore()}))
      }
      
      if (salary < minSalary.current) alert(`O pró-labore deve ser, de no mínimo de um salário mínimo, atualmente ${new Intl.NumberFormat('pt-BR', {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 2
      }).format(minSalary.current)}. O resultado será calculado, mas use com cautela.`)
    }
  }
  
  const formFields = useMemo(() => [
    {
      type: "text",
      id: "value",
      placeholder: "R$ 0,00",
      label: "Valor do pró-labore",
      mask: "money",
      options: {autoFocus: true, required: true, ref: inputValue},
    },
    {
      type: "number",
      id: "count-depends",
      placeholder: "0",
      label: "Número de dependentes",
      mask: "number-0",
      options: {maxLength: 1, pattern: "[0-9]{1}", required: true},
    },
  ], []);
  
  return (
    <Theme.Provider value={{resultsCalculate: state.result}}>
      <FormCalulator {...{formFields, state, handleSubmit, handleChange}} />
      {Array.isArray(state.result) && state.result.length > 0 ? (<RenderResults state={state}/>) : ""}
    </Theme.Provider>
  )
}

RenderResults.propTypes = {
  state: PropTypes.shape({
    result: PropTypes.array.isRequired,
  }).isRequired,
}

UseCalculator.propTypes = {
  setState: PropTypes.func.isRequired,
  inputValue: PropTypes.object.isRequired,
}

FormCalulator.propTypes = {
  formFields: PropTypes.array.isRequired,
  state: PropTypes.shape({}).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
}

export {Theme, Calculator}