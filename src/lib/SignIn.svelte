<script>

    import { supabase } from '../supabaseClient'

    export let loggedIn = false

    let email = ""
    let password = ""

    async function signUp() {
        
        let { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        })

        if (error){
            console.log(error)
        } else{
            alert("Please confirm your email")
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
            email = ""
            password = ""
            loggedIn = true
        }
    }

</script>



<div>

    <input id="emailTextBox" bind:value={email}>
    <input id="passwordTextBox" bind:value={password}>

    <button id="signUpButton" on:click={signUp}>
        Sign Up
    </button>

    <button id="SignInButton" on:click={signIn}>
        Sign In
    </button>

</div>