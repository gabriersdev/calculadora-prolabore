import 'jquery-mask-plugin/dist/jquery.mask.min';
import {Calculator} from "./components/Calculator.jsx";

function App() {

  
  return (
    <main
      className="flex flex-col items-center justify-center min-h-svh bg-zinc-950 [&_*]:tracking-[0.5px]">
      <div className="px-4 md:px-40 lg:px-60 w-full">
        <section className={"xl:px-20 2xl:px-80 my-16"}>
          <h1 className={"text-2xl font-medium p-0 mb-8 text-center text-white"}>Calcular Pró-labore</h1>
          <Calculator/>
        </section>
      </div>
    </main>
  )
}


export default App
