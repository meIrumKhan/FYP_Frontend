// export function Fetchdata(method, url, body, form) {
//     return fetch(`http://localhost:8000${url}`, {
//       method: method,
//       body: form ? body : JSON.stringify(body),
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//       .then((res) => {
//         if (!res.ok) {
//           return res.json().then((error) => {
//             throw new Error(error.message);
//           });
//         }
//         return res.json();
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   }
  


export async function Fetchdata(method, url, body, form) {

   // const fullUrl = `http://localhost:8000${url}`;
  
    const fullUrl = `https://fyp-reservation-backend.vercel.app${url}`;
  
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