// you can modify and save this file without needing to restart the gatsby dev server

require('dotenv').config({
  path: '.env'
})

// (install modules as devDependencies in the top level package.json)
const fetch = require('node-fetch')
const base64 = require('base-64')

// exports.handler is required by netlify
exports.handler = async (event) => {

  // just to demonstrate this files access to env variables
  console.log('.env DEMO_KEY:', process.env.DEMO_KEY)

  // must always respond with a statusCode and a body with a stringified response
  return {
    statusCode: 200,
    body: JSON.stringify({ msg: 'All good from server!' })
  }
  
  // below is an example of using node-fetch to post to an external api (in this case mailchimp)
  // and using async await within a try/catch block
  // credit to https://codegregg.com/blog/netlifyMailchimpFunction/


  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const errorGen = msg => {
    return { statusCode: 500, body: msg }
  }

  try {
    const {
      email,
      name,
    } = JSON.parse(event.body)

    if (!email) {
      return errorGen('Missing email')
    }

    const subscriber = {
      merge_fields: {
        FNAME: name,
      },
      email_address: email,
      status: 'subscribed',
    }

    const creds = `any:${process.env.MAILCHIMP_KEY}`
    const response = await fetch(
      `https://${process.env.MAILCHIMP_DATACENTER}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LISTID}/members/`,
      {
        method: 'POST',
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
          Authorization: `Basic ${base64.encode(creds)}`,
        },
        body: JSON.stringify(subscriber),
      }
    )

    const data = await response.json()
    
    if (!response.ok) {
      return { statusCode: data.status, body: JSON.stringify({ msg: data.title }) }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ msg: 'Success' }), // simply send 'Success' to the front end
    }
  } catch (err) {
    console.log('err', err) // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
    }
  }
}
