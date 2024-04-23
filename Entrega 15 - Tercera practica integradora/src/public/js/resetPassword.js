window.addEventListener('DOMContentLoaded', () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get('token');

    document.getElementById('token').value = token;

    const checkPasswordsMatch = () => {
        const password = document.getElementById('password01').value;
        const repeatPassword = document.getElementById('password02').value;
        const errorDiv = document.getElementById('error');

        if (password !== repeatPassword) {
            errorDiv.innerHTML = "Las contraseñas no coinciden";
            return false;
        }
        errorDiv.innerHTML = "";
        return true;
    };

    document.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault();

        if (checkPasswordsMatch()) {
            event.target.submit();
        }
    });
})