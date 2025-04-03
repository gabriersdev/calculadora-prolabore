import {Button} from "./components/ui/button"
import {Input} from "./components/ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table"

import {useCallback, useEffect, useMemo, useState} from "react";

import $ from 'jquery';
import 'jquery-mask-plugin/dist/jquery.mask.min';
import Calculator from "./classes/Calculator.js";

function App() {
  const [state, setState] = useState({
    value: "",
    "count-depends": "0",
    "return": []
  });
  
  const formatCondition = useCallback((index) => {
    return index === state.return.length - 1 ? "font-bold" : ""
  }, [state.return.length]);
  
  useEffect(() => {
    const inputs = $('[data-mask="money"]')
    
    inputs.mask('#.##0,00', {
      reverse: true,
      placeholder: 'R$ 0,00'
    });
    
    inputs.each((i, input) => {
      $(input).on("input", (e) => {
        setState((prev) => ({
          ...prev,
          [e.target.id]: e.target.value
        }))
      })
    })
    
    return () => {
      inputs.unmask();
      inputs.off("input");
    }
  }, []);
  
  const handleChange = useCallback((e) => {
    const {id, value} = e.target;
    
    setState((prev) => ({
      ...prev,
      [id]: value,
    }));
  }, []);
  
  const formFields = useMemo(() => [
    {
      type: "text",
      id: "value",
      placeholder: "R$ 0,00",
      label: "Valor do pró-labore",
      mask: "money",
      options: {autoFocus: true}
    },
    {type: "number", id: "count-depends", placeholder: "0", label: "Número de dependentes"},
  ], []);
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!state.value.trim() || !state["count-depends"].trim()) {
      alert("Preencha todos os campos!")
    } else {
      const salary = state.value.trim().replace(/[\sA-Z]*/gi, "").replace(/\./g, "").replace(/,/g, ".")
      console.log(salary)
      if (isNaN(parseFloat(salary)) || salary.startsWith("e") || salary.endsWith("e")) alert("Informe o valor do pró-labore corretamente!")
      else {
        const calc = new Calculator()
        calc.setValores(parseFloat(salary), parseInt(state["count-depends"] ?? 0))
        setState((prev) => ({...prev, ["return"]: calc.calcularProlabore()}))
      }
    }
  }
  
  return (
    <main
      className="flex flex-col items-center justify-center min-h-svh bg-zinc-950 [&_*]:text-[16px] [&_*]:tracking-[0.5px]">
      <div className="px-4 md:px-40 lg:px-60 w-full">
        <section className={"xl:px-20 2xl:px-80"}>
          <form className="flex flex-col gap-4 flex-wrap">
            {
              formFields.map(({id, label, type, placeholder, mask, options = {}}) => (
                <div className="flex gap-1 flex-col" key={id}>
                  <label className="text-zinc-400" htmlFor={id}>
                    {label}
                  </label>
                  <Input
                    type={type}
                    placeholder={placeholder}
                    className="border-zinc-700 focus:border-zinc-500 text-gray-300 placeholder:text-zinc-400"
                    id={id}
                    required
                    value={state[id] ?? ""}
                    onChange={handleChange}
                    data-mask={mask ?? ""}
                    {...options}
                  />
                </div>
              ))
            }
            <Button className={"focus:outline-accent-foreground"} onClick={handleSubmit}>Calcular</Button>
          </form>
          
          {
            Array.isArray(state.return) && state.return.length > 0 ? (
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
                      state.return.map((item, index) => {
                          return (
                            <TableRow key={index} className={"border-b-accent-foreground hover:bg-accent-foreground"}>
                              <TableCell className="font-bold">{item[0]}</TableCell>
                              <TableCell className={`${formatCondition(index)}`}>{item[1]}</TableCell>
                              <TableCell className={`${formatCondition(index)}`}>{item[2]}</TableCell>
                              <TableCell className={`${formatCondition(index)} text-right`}
                                         onClick={() => {
                                           navigator.clipboard.writeText(item[3].replace(/[(R$)\s]/g, "")).then(() => {
                                             alert("Copiado!")
                                           }).catch((e) => {
                                             console.log(e)
                                             alert("Erro!" + " " + e.message)
                                           })
                                         }}
                              >{item[3]}</TableCell>
                            </TableRow>
                          )
                        }
                      )
                    }
                  </TableBody>
                </Table>
              
              </div>
            ) : ""
          }
        </section>
      </div>
    </main>
  )
}


export default App
