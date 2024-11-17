import React, { useState } from 'react'

type Form = {
  name?: string,
  age?: number,
  gender?: "MALE" | "FEMALE",
  category?: number,
  description?: string,
  date?: string
}

const TestPage = () => {

  const [form, setForm] = useState<Form>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>, convert: "NONE" | "NUMBER" | "BOOL" = "NONE") => {
    console.log(e.target.type, e.target.value)
    setForm(prev => {
      
      if(convert === "NONE")
        return {...prev, [e.target.name]: e.target.value};
      else if(convert === "NUMBER")
        return {...prev, [e.target.name]: parseInt(e.target.value)};
      else if(convert === "BOOL")
        return {...prev, [e.target.name]: parseInt(e.target.value) ? true : false};
    })
  }
  console.log(form?.date)
  return (
    <div>
      <div>
        <p>Name:</p>
        <input type='text' name='name' value={form?.name} onChange={(e) => handleChange(e)}/>
      </div>
      <div>
        <p>Age:</p>
        <input type='number' name='age' value={form?.age} onChange={(e) => handleChange(e, "NUMBER")}/>
      </div>
      <div>
        <p>Gender:</p>
        <select name='gender' defaultValue='' value={form?.gender} onChange={e => handleChange(e)}>
          <option value="" disabled>Please select</option>
          <option value={"MALE"}>Male</option>
          <option value={"FEMALE"}>Female</option>
        </select>
      </div>
      <div>
        <p>Category:</p>
        <input type='radio' name='category' value={0} checked={form?.category === 0} onChange={(e) => handleChange(e, "NUMBER")}/>
        <input type='radio' name='category' value={1} checked={form?.category === 1} onChange={(e) => handleChange(e, "NUMBER")}/>
        <input type='radio' name='category' value={2} checked={form?.category === 2} onChange={(e) => handleChange(e, "NUMBER")}/>
      </div>
      <div>
        <p>Description:</p>
        <textarea name='description' value={form?.description} onChange={e => handleChange(e)}/>
      </div>
      <div>
        <p>Date:</p>
        <input type="datetime-local" name='date' value={form?.date ?? ""} onChange={e => handleChange(e)}/>
      </div>
    </div>
  )
}

export default TestPage