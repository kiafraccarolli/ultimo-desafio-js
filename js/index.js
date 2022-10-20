        
  const contenedorProductos = document.getElementById("contenedorProductos");
  const botonVaciar = document.getElementById("vaciar-carrito");
  const contenedorCarrito = document.getElementById(`carrito-contenedor`);
  
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  
  document.addEventListener("DOMContentLoaded", () => {
    actualizarCarrito(carrito);
  });
  
  botonVaciar.addEventListener("click", () => {
    Swal.fire({
      title: '¿Estás seguro?',
      icon: 'warning',
      iconColor: '#554836',
      showCancelButton: true,
      cancelButtonColor: '#554836',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Si! Vaciar',
      cancelButtonText: 'Cancelar',
      background: '#cbdcb5',
      color: 'black',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'El carrito se ha vaciado!',
          timer:2000,
          confirmButtonText: 'OK',
          confirmButtonColor: '#554836',
        })
        localStorage.clear();
        carrito.length = 0;
        actualizarCarrito(carrito);
      }
    })
  });
  
  const actualizarCarrito = (carrito) => {
    contenedorCarrito.innerHTML = " ";
  
    carrito.forEach((prod) => {
      const div = document.createElement("div");
      div.className = "productoElegido";
      div.setAttribute("id", prod.id);
      div.innerHTML = `
      <p>${prod.nombre}</p>
      <p>Precio: $${prod.precio}</p>
      <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>  
      <button id="${prod.id}" class="borrarUno" ><img src="./img/eliminar.png" alt=""></button>`;
  
      contenedorCarrito.appendChild(div);
      localStorage.setItem("carrito", JSON.stringify(carrito));
  
      let tacho = document.getElementById(prod.id);
  
      tacho.addEventListener("click", () => {
        const newCarrito = carrito.filter(
          (productos) => productos.id !== tacho.id,
        );
        actualizarCarrito(newCarrito);
    
      });
    });
  
    const precioTotal = document.getElementById("precioTotal");
    precioTotal.innerText = carrito.reduce(
      (i, prod) => i + prod.precio * prod.cantidad,
      0,
    );
  };
  
  fetch("https://raw.githubusercontent.com/kiafraccarolli/basededatos-js/main/data.json")
        .then(o => o.json())
        .then(data => data.forEach((producto) => {
          const div = document.createElement("div");
          div.classList.add(
            "estilosProducto",
            "card",
            "col-lg-4",
            "col-md-12",
            "mx-5",
            "align-items-center",
          );
          div.innerHTML = `
            <img class="card-img-top, imagen" src="${producto.imagen}" alt="Card image cap">
            <div class="card-body">
                  <h5 class="card-title"> ${producto.nombre}</h5>
                  <p class="card-text">Precio: $${producto.precio}</p>
                  <a href="#" class="btn" id="agregar ${producto.id}">Añadir al carrito</a>
                </div>
            `;
          contenedorProductos.appendChild(div);
        
          const boton = document.getElementById(`agregar ${producto.id}`);
        
          boton.addEventListener("click", () => {
            agregarAlCarrito(producto.id);
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })
            
            Toast.fire({
              icon: 'success',
              title: 'Producto añadido al carrito!'
            })

          });
          const agregarAlCarrito = (prodId) => {
            const existe = carrito.some((prod) => prod.id === prodId);
            if (existe) {
              const prod = carrito.map((prod) => {
                if (prod.id === prodId) {
                  prod.cantidad++;
                }
              });
            } else {
              const item = data.find((prod) => prod.id === prodId);
              carrito.push(item);
            }
            actualizarCarrito(carrito);
          };
        }))