document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const tipoUsuario = document.getElementById('tipoUsuario').value;
    const senha = document.getElementById('senha').value;
    
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioEncontrado = usuarios.find(user => user.email === email && user.tipo === tipoUsuario);
    
    if (usuarioEncontrado && usuarioEncontrado.senha === senha) {
        alert('Login bem-sucedido!');
    } else {
        alert('Email ou senha incorretos!');
    }
});