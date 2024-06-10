
const AuthMl = () => {

    const clientId = '7034794164519677'
    const redirectUri = 'https://e309-2804-14d-3281-86ef-54d6-6722-87d2-ca0d.ngrok-free.app/oauth/callback'


    const fazerLogin = () => {
        //const authUrl = `https://auth.mercadolibre.com/authorization?response_type=code&client_id=${clientId}&redirect_uri=${(redirectUri)}`;
        const authUrl = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge=23TYGLvaYaA/Cjb6nExMTUHpV7fqi53PFbAlBt7VrqE=&code_challenge_method=S256`
        console.log(authUrl)
        //window.location.href = authUrl;
    }

    return(
        <div>
            <button onClick={() => {
                fazerLogin()
            }}>
                aperte aqui mumia
            </button>
        </div>
    )

}

export default AuthMl