
type InputProps = {
    reference: string
    label?: string
    type: string
    placeholder?: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    value?: string
}

export default function Input({
    reference,
    label,
    type,
    placeholder,
    onChange,
    value,
}: InputProps) {
    return (
        <div className='input-wrapper'>
            {label && <label htmlFor={reference} className='input-label'>{label}</label>}
            <input
                className='input-field'
                type={type}
                name={reference}
                id={reference}
                placeholder={placeholder}
                onChange={onChange}
                value={value}
            />
        </div>
    )
}
