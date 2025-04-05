import {Button} from "./ui/button"
import {useState} from "react";
import FormProlaboreData from "./FormProlaboreData.jsx";

export default function PrintProlabore() {
  const [show, setShow] = useState(false);
  
  return (
    <>
      <Button type={"button"} className={"focus:outline-accent-foreground mt-4  text-[16px]"} onClick={() => setShow(!show)}>
        Imprimir
      </Button>
      
      { show ? <FormProlaboreData/> : "" }
    </>
  )
}
