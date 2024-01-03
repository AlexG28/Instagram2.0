<script>
  import { supabase } from './supabaseClient'

  import Post from './lib/Post.svelte'
  import SignIn from './lib/SignIn.svelte'
  import Upload from './lib/Upload.svelte';

  let loggedIn = false
  let sessionInfo

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

<main>
  <h1 class="title" >
    Instagram 2.0
  </h1>

  {#if loggedIn == true}
    <p>Logged in</p>
    <Upload sessionInfo={sessionInfo}/>
  {:else}
    <SignIn bind:loggedIn={loggedIn} bind:sessionInfo={sessionInfo}/>
  {/if}

  <div class="postPanel">
    {#if sessionInfo != null}
      {#await getImageNameList() then value} 
        {#each value as fileName}
          <Post imageName={fileName} sessionInfo={sessionInfo} />
        {/each}
      {/await} 
    {/if}
  </div>
</main>

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
