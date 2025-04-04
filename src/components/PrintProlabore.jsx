import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {useMemo} from "react";

export default function PrintProlabore() {
  const formFields = useMemo(() => [
    {
      type: "text",
      id: "CNPJ",
      placeholder: "00.000.000/0000-00",
      label: "CNPJ",
    },
    {
      type: "text",
      id: "CPF",
      placeholder: "000.000.000-00",
      label: "CPF do sócio ou proprietário",
    },
    {
      type: "text",
      id: "enterprise-name",
      placeholder: "",
      label: "Razão Social",
    },
    {
      type: "text",
      id: "person-name",
      placeholder: "",
      label: "Nome do sócio ou proprietário",
    },
  ], []);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type={"button"} className={"focus:outline-accent-foreground mt-4"} onClick={()=>{}}>Imprimir</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 bg-foreground border-accent-foreground text-accent [&_*]:text-[16px]">
        <DropdownMenuLabel>Imprimir pró-labore</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
