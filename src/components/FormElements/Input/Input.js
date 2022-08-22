import React from 'react'
import './Input.css'

const Input = (props) => {
  const {
    elementType,
    label,
    type,
    name,
    id,
    rows,
    handleChange,
    errorMessage,
    isValid,
    value,
    touched,
  } = props

  const element =
    elementType === 'input' ? (
      <>
        <input
          className="form__input"
          type={type}
          name={name}
          id={id}
          key={label}
          onChange={handleChange}
          value={value}
        />
      </>
    ) : (
      <textarea
        label={label}
        id={id}
        type={type}
        name={name}
        className="form__textarea"
        rows={rows || 3}
        onChange={handleChange}
        value={value}
      />
    )
  return (
    <div className="form__group">
      <label htmlFor={name} className="form__label">
        {label}
      </label>
      {element}
    </div>
  )
}

export default Input
