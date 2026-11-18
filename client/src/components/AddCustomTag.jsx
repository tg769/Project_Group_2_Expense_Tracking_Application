import { useState } from 'react'

export default function AddCustomTag({ onAdd }) {
  const [name, setName] = useState('')
  const [error, setError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    const message = await onAdd(name)
    setError(message)
    if (!message) setName('')
  }

  return (
    <form className="add-tag" onSubmit={handleSubmit}>
      <label htmlFor="custom-tag">Add a custom tag</label>
      <div className="inline-row">
        <input
          id="custom-tag"
          placeholder="e.g. Pets, Gym, Gifts"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className="btn">
          Add
        </button>
      </div>
      {error && <p className="error">{error}</p>}
    </form>
  )
}
