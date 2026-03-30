// A reusable input component for forms
export default function TextInput({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  required = false,
  ...props
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition"
      {...props}
    />
  );
}
