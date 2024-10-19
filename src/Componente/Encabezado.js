import { useEffect, useState } from "react";
import React from "react";
import Tienda from "./Tienda";

function Encabezado({ onSelectHamburguesa }) {
    const [pedidos, setPedidos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [dni, setDni] = useState("");
    const [email, setEmail] = useState("");
    const [direccion, setDireccion] = useState("");
    const [comentarios, setComentarios] = useState("");
    const [hamburguesa, setHamburguesa] = useState("");
    const [cremasSeleccionadas, setCremasSeleccionadas] = useState([]);

    const hamburguesasDisponibles = ["Hamburguesa Clásica", "Hamburguesa BBQ", "Hamburguesa Veggie"];
    const cremasDisponibles = ["Mayonesa", "Ketchup", "Mostaza", "Salsa Picante"];

    // Cargar pedidos del localStorage al iniciar el componente
    useEffect(() => {
        const storedPedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        setPedidos(storedPedidos.map(pedido => ({
            ...pedido,
            cremas: pedido.cremas || [] // Asegúrate de que cremas sea un arreglo
        })));
    }, []);

    // Evento de panel de menús quede inmovilizado para mejor interacción
    useEffect(() => {
        const header = document.querySelector('header');
        const menu = document.querySelector('#menu-icon');
        const navlist = document.querySelector('.navlist');

        // Función para manejar el scroll y agregar la clase 'sticky'
        const handleScroll = () => {
            header.classList.toggle('sticky', window.scrollY > 50);
        };

        // Función para alternar el menú
        const toggleMenu = () => {
            menu.classList.toggle('bx-x');
            navlist.classList.toggle('open');
        };

        // Agregar eventos
        window.addEventListener('scroll', handleScroll);
        menu.addEventListener('click', toggleMenu);

        // Cleanup para remover los eventos cuando el componente se desmonte
        return () => {
            window.removeEventListener('scroll', handleScroll);
            menu.removeEventListener('click', toggleMenu);
        };
    }, []);

    // Función para alternar la ventana modal
    const abrirCarrito = () => {
        setModalVisible(!modalVisible);
        if (!modalVisible) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    };

    // Función para cerrar la ventana modal
    const cerrarModal = () => {
        setModalVisible(false);
        document.body.classList.remove('no-scroll');
    };

    // Función para enviar pedido
    const enviarPedido = (e) => {
        e.preventDefault();

        const nuevoPedido = {
            nombre,
            apellidos,
            dni,
            email,
            direccion,
            comentarios,
            hamburguesa,
            cremas: cremasSeleccionadas
        };

        const updatedPedidos = [...pedidos, nuevoPedido];
        setPedidos(updatedPedidos);
        localStorage.setItem('pedidos', JSON.stringify(updatedPedidos));

        // Limpiar el formulario
        setNombre("");
        setApellidos("");
        setDni("");
        setEmail("");
        setDireccion("");
        setComentarios("");
        setHamburguesa("");
        setCremasSeleccionadas([]);

        alert("¡Pedido enviado!");

        // Cerrar el modal después de enviar el pedido
        cerrarModal();
    };

    // Función para manejar cambios en las cremas seleccionadas
    const manejarCambioCrema = (crema) => {
        setCremasSeleccionadas((prev) =>
            prev.includes(crema) ? prev.filter(c => c !== crema) : [...prev, crema]
        );
    };

    // Función para descargar pedidos
    const descargarPedidos = () => {
        const contenido = pedidos.map(pedido => (
            `Nombre: ${pedido.nombre} ${pedido.apellidos}\n` +
            `DNI: ${pedido.dni}\n` +
            `Correo: ${pedido.email}\n` +
            `Dirección: ${pedido.direccion}\n` +
            `Hamburguesa: ${pedido.hamburguesa}\n` +
            `Cremas: ${pedido.cremas.join(', ')}\n` +
            `Comentarios: ${pedido.comentarios}\n` +
            `--------------------------------\n`
        )).join('');

        const mensajeDescarga = "Descargar Pedido\n\n";
        const blob = new Blob([mensajeDescarga + contenido], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pedidos.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    const manejarCambioHamburguesa = (hamburguesaSeleccionada) => {
        setHamburguesa(hamburguesaSeleccionada);
        onSelectHamburguesa(hamburguesaSeleccionada); // Actualiza la hamburguesa seleccionada
    };

    return (
        <>
            <header>
                <div className="logo">
                    <a href="#home">
                        <i className="bx bx-restaurant"></i>
                        <span>
                            <h1>Sabor Barrunto</h1>
                            <h5 className="log2">FastFood</h5>
                        </span>
                    </a>
                </div>
                <ul className="navlist">
                    <li><a href="#about">Nosotros</a></li>
                    <li><a href="#shop">Tienda</a></li>
                    <li><a href="#reviews">Clientes</a></li>
                    <li><a href="#contact">Contáctanos</a></li>
                </ul>

                <div className="nav-icons">
                    <a href="#" onClick={abrirCarrito}><i className="bx bx-cart"></i></a>
                    <div className="bx bx-menu" id="menu-icon"></div>
                </div>

                <a href="#" className="scroll">
                    <i className="bx bx-up-arrow-alt"></i>
                </a>
            </header>

            {/* Modal para mostrar los pedidos */}
            <div id="modal" className={`modal ${modalVisible ? 'visible' : ''}`}>
                <h2>Hacer un Pedido</h2>
                <form onSubmit={enviarPedido}>
                    <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    <input type="text" placeholder="Apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required />
                    <input type="text" placeholder="DNI" value={dni} onChange={(e) => setDni(e.target.value)} required />
                    <input type="email" placeholder="Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
                    <textarea placeholder="Comentarios" value={comentarios} onChange={(e) => setComentarios(e.target.value)}></textarea>
                    
                    <select value={hamburguesa} onChange={(e) => manejarCambioHamburguesa(e.target.value)} required>
                        <option value="">Seleccione Hamburguesa</option>
                        {hamburguesasDisponibles.map((h, index) => (
                            <option key={index} value={h}>{h}</option>
                        ))}
                    </select>
                    
                    <h4>Seleccione Cremas:</h4>
                    <div className="checkbox-group">
                        {cremasDisponibles.map((crema, index) => (
                            <div key={index} className="crema-item">
                                <input
                                    type="checkbox"
                                    checked={cremasSeleccionadas.includes(crema)}
                                    onChange={() => manejarCambioCrema(crema)}
                                />
                                {crema}
                            </div>
                        ))}
                    </div>

                    <div className="button-group">
                        <button type="submit">Enviar Pedido</button>
                        <button type="button" onClick={descargarPedidos}>Descarga tu Pedido</button>
                    </div>
                </form>

                <h2>Mis Pedidos</h2>
                <div id="listaPedidos">
                    {pedidos.length === 0 ? (
                        <p>No hay pedidos registrados.</p>
                    ) : (
                        pedidos.map((pedido, index) => (
                            <div key={index}>
                                <strong>Nombre:</strong> {pedido.nombre} {pedido.apellidos}<br />
                                <strong>DNI:</strong> {pedido.dni}<br />
                                <strong>Correo:</strong> {pedido.email}<br />
                                <strong>Dirección:</strong> {pedido.direccion}<br />
                                <strong>Hamburguesa:</strong> {pedido.hamburguesa}, 
                                <strong>Cremas:</strong> {(pedido.cremas || []).join(', ')}<br />
                                <strong>Comentarios:</strong> {pedido.comentarios}<br />
                            </div>
                        ))
                    )}
                </div>
                <button onClick={cerrarModal} className="close-button">Cerrar</button>
            </div>
        </>
    );
}

export default Encabezado;
