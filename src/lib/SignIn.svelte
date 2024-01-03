<script>

    import { supabase } from '../supabaseClient'

    export let loggedIn = false
    export let sessionInfo

    let email = ""
    let password = ""

    async function signUp() {
        
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        })
        
        if (error){
            console.log(error)
        }

        sessionInfo = data.session

        addUserToTable()
    }

    async function addUserToTable() {
        const { data, error } = await supabase
            .from('users')
            .insert([
                {
                    'id': sessionInfo.user.id, 
                    'created_at': ((new Date()).toISOString()).toLocaleString()
                }
            ])

        if (error) {
            console.log(error)
        }
    }

    async function signIn() {
        
        let { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if (error){
            alert("Invalid login credentials")

        } else{
            sessionInfo = data
            email = ""
            password = ""
            loggedIn = true
        }
    }

</script>



<div>
    <h2 class="logInOrSignUp"> Log In or Sign Up </h2>
    <input id="emailTextBox" bind:value={email}>
    <input id="passwordTextBox" bind:value={password}>

    <button id="signUpButton" on:click={signUp}>
        Sign Up
    </button>

    <button id="SignInButton" on:click={signIn}>
        Sign In
    </button>

</div>

<style>
    .logInOrSignUp{
        font-size: 3rem;
    }
</style>