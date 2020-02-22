import React, { useState } from 'react'

export default function Form() {

  const [ submitted, setSubmitted ] = useState({})

  // this POSTs to ./.netlify/functions/subscribe.js
  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'anything',
          email: 'goes',
        })
      })

      const msg = await res.json()

      setSubmitted(msg)
    } catch (err) {
      console.error(err)
      setSubmitted(err)
    }
  }


  return (
    <div style={{marginBottom: '2rem'}}>
      <button onClick={handleSubmit}>Submit</button>
      {' '}
      {JSON.stringify(submitted)}
    </div>
  )
}
