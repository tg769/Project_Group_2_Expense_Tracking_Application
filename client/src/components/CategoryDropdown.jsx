// Select listing preset categories and custom tags. `placeholder` is the
// label for the empty-value option (e.g. "Select category" or "All categories").
export default function CategoryDropdown({ id, name, categories, value, onChange, placeholder }) {
  return (
    <select id={id} name={name} value={value} onChange={onChange}>
      <option value="">{placeholder}</option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  )
}
