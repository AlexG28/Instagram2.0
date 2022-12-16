<script>
    export let loggedIn = false

    let email = ""
    let password = ""

    function signIn() {
        loggedIn = true
        console.log(email)
        console.log(password)
    }

</script>



<div>

    <input bind:value={email}>
    <input bind:value={password}>

    <button on:click={signIn}>
        Sign In
    </button>

</div>