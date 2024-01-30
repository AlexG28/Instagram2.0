<script>
  import Router from "svelte-spa-router"
  import { onMount } from "svelte";
  import {push} from 'svelte-spa-router'
  
  import { loggedIn } from "./lib/store";

  import Home from "./lib/Home.svelte"
  import SignIn from "./lib/SignIn.svelte"
  import Upload from "./lib/Upload.svelte"
  import Profile from "./lib/Profile.svelte"
  import OtherProfile from "./lib/OtherProfile.svelte";

  let routes = {
    "/": Home,
    "/signin": SignIn,
    "/upload": Upload,
    "/profile": Profile,
    "/:user_id": OtherProfile
  }


  onMount(() => {
    if ($loggedIn){
      push("/home")
    } else {
      push("/signin")
    }
  })

</script>


<main>
  <Router {routes}/>
</main>