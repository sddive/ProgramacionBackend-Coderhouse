console.log('cargo chat.js')
const socket=io()
let inputMensaje=document.getElementById('mensaje')
let divMensajes=document.getElementById('mensajes')

Swal.fire({
    title:"Identifiquese",
    input:"text",
    text:"Ingrese su nickname",
    inputValidator: (value)=>{
        return !value && "Debe ingresar un nombre...!!!"
    },
    allowOutsideClick:false
}).then(resultado=>{
    console.log(resultado)
    socket.emit('id', resultado.value)
    inputMensaje.focus()
    document.title=resultado.value

    socket.on('newUser',nombre=>{
        // TODO: popup con el aviso
        Swal.fire({
            text:`${nombre} se ha conectado...!!!`,
            toast:true,
            position:"top-right"
        })
    })

    socket.on("allMessages",mensajes=>{
        mensajes.forEach(mensaje=>{
            let parrafo=document.createElement('p')
            parrafo.innerHTML=`<strong>${mensaje.user}</strong> dice: <i>${mensaje.message}</i>`
            parrafo.classList.add('mensaje')
            let br=document.createElement('br')
            divMensajes.append(parrafo, br)
            divMensajes.scrollTop=divMensajes.scrollHeight   
        })
    })

    socket.on("userDisconnect",nombre=>{
        Swal.fire({
            text:`${nombre} se ha desconectado...!!!`,
            toast:true,
            position:"top-right"
        })
    })

    socket.on('newMessage', datos=>{
        let parrafo=document.createElement('p')
        parrafo.innerHTML=`<strong>${datos.user}</strong> dice: <i>${datos.message}</i>`
        parrafo.classList.add('mensaje')
        let br=document.createElement('br')
        divMensajes.append(parrafo, br)
        divMensajes.scrollTop=divMensajes.scrollHeight
    })

    inputMensaje.addEventListener("keyup",(e)=>{
        if(e.code==="Enter" && e.target.value.trim().length>0){
            socket.emit('message',{user:resultado.value, message:e.target.value.trim()})
            e.target.value=''
        }
    })

})