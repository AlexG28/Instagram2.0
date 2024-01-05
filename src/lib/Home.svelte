<script>
    import { supabase } from "../supabaseClient";
    import { onMount } from "svelte";
    import {push} from 'svelte-spa-router'
    import { loggedIn, sessionInfo } from './store'
    import Post from "./Post.svelte";
    import Navbar from "../components/Navbar.svelte";

    onMount(() => {
        if (!($loggedIn)){
            push("/signin")
        } 
    })

    async function getImageIDsFrompostsTable(){
        const { data, error } = await supabase
        .from('posts')
        .select('imageID')
        if (error) throw error 
        return data 
    }

    async function getImageNameList() {
        const imageNames = []
        let postIDs = await getImageIDsFrompostsTable()
        console.log("PostIDs: ")
        console.log(postIDs)

        if (postIDs) {
            for (let i = 0; i < postIDs.length; i++){
            imageNames.push(postIDs[i].imageID)
            }
        }

        return imageNames
    }
</script>

<div>

    <h1 class="title" >
        Instagram 2.0
    </h1>

    <Navbar />
    
    <div class="postPanel">
        {#if $sessionInfo != null}
            {#await getImageNameList() then value} 
                {#each value as fileName}
                    <Post imageName={fileName} />
                {/each}
            {/await} 
        {/if}
    </div>
</div>


<style>
    .title{
      /* Create the gradient. */
      background-image: linear-gradient(45deg, #f3ec78, #af4261);
      
      /* Use the text as a mask for the background. */
      /* This will show the gradient as a text color rather than element bg. */
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent; 
      
      position: absolute;
      left: 3rem;
      top: 0rem;
    }
  
    .postPanel{
      position: relative;
      margin-top: 30%;
    }
  
</style>