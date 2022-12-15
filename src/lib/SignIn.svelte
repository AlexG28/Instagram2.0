<script>
    let email = ""
    let password = ""

    function signIn() {
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