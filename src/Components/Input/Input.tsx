
type InputProps = {
    reference: string;
    label: string;
    type: string;
    placeholder?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    step?: string;
}

export default function Input({
    reference,
    label,
    type,
    placeholder,
    onChange,
    value,
    step
}: InputProps) {
    return (
        <div>
            <label htmlFor={reference}>{label}</label>
            <input type={type} name={reference} id={reference} placeholder={placeholder} onChange={onChange} step={step} value={value}/>
        </div>
    )
}