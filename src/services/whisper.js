'use server'

const API_URL = process.env.AZURE_WHISPER_URL;
const API_KEY = process.env.AZURE_WHISPER_API_KEY;


const speechToText = (file) => new Promise((resolve, reject) => {

  console.log(file)
  const headers = new Headers();
  headers.append("api-key", API_KEY);

  const formdata = new FormData();
  formdata.append("file", file);

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: formdata,
    redirect: "follow"
  };

  fetch(API_URL, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log('got', data)
      resolve(data.text)
    })
    .catch((error) => {
      console.error("Error:", error);
      reject(error)
    });

})



export { speechToText }
