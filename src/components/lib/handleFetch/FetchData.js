

export async function AuthFetchdata(method, url, body, form) {

  //  const fullUrl = `http://localhost:5000${url}`;
  
  //  const fullUrl = `https://rest-coin-backend.vercel.app${url}`;

     const fullUrl = `https://flight-reservation-backend-auth.vercel.app${url}`;

  
  const options = {
    method: method,
    body: form ? body : JSON.stringify(body),
    credentials: "include",
  };

  if (!form) {
    options.headers = {
      "Content-Type": "application/json",
    };
  }

  try {
    const response = await fetch(fullUrl, options);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error: ', error.message);
    throw error;
  }
}

  


export async function Fetchdata(method, url, body, form) {

   // const fullUrl = `http://localhost:8000${url}`;
  
    // const fullUrl = `https://fyp-backend-ivory.vercel.app${url}`;
    
    const fullUrl = `https://flight-reservation-backend-registration.vercel.app${url}`;

  
  const options = {
    method: method,
    body: form ? body : JSON.stringify(body),
    credentials: "include",
  };

  if (!form) {
    options.headers = {
      "Content-Type": "application/json",
    };
  }

  try {
    const response = await fetch(fullUrl, options);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error: ', error.message);
    throw error;
  }
}