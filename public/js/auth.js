function handleCredentialResponse(response) {
    //Google token | ID_TOKEN
   //  console.log(response.credential)
    const body = {id_token: response.credential}
     fetch('http://localhost:8080/api/auth/google',{
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(body)
     })
       .then( resp => resp.json() )
       .then( ({usuario, token}) => {
         localStorage.setItem('token', token)
         localStorage.setItem('email', usuario.correo)
       })
       .catch(console.log)
       
   }

   const button = document.getElementById('google_signout')
   button.onclick = () => {

     console.log(google.accounts.id)
     google.accounts.id.disableAutoSelect()
     google.accounts.id.revoke(localStorage.getItem('email'), done => {
       localStorage.clear()
       location.reload()
     })

   }