import PropTypes from "prop-types"
import {Input} from "./ui/input.js";

export default function FormGroup ({params, state, handleChange}) {
  const {id, label, type, placeholder, mask, options} = params;
  
  return (
    <div className="flex gap-1 flex-col" key={id}>
      <label className="text-zinc-400" htmlFor={id}>
        {label}{options.required ? (<span className={"text-red-600"}>*</span>) : ''}
      </label>
      <Input
        type={type}
        placeholder={placeholder}
        className="border-zinc-700 focus:border-zinc-500 text-gray-300 placeholder:text-zinc-400"
        id={id}
        required
        value={state[id] ?? ""}
        onChange={handleChange}
        autoComplete="off"
        data-mask={mask ?? ""}
        {...options}
      />
    </div>
  )
}

FormGroup.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    mask: PropTypes.string,
    options: PropTypes.object,
  }).isRequired,
  state: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
}