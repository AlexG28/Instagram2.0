<script>
  import { supabase } from './supabaseClient'

  import Post from './lib/Post.svelte'
  import SignIn from './lib/SignIn.svelte'


  let loggedIn = false
  let sessionInfo
  let results = null

  const getData = async () => {
    try {
      const {data,error,status} = await supabase
        .from('Posts')
        .select()

      if (error && status !== 406) throw error

      if (data) {
        results = data
        console.log(results)
      }

    } catch (error){
      if (error instanceof Error){
        alert(error.message)
      }
    } finally {
    }
  }

  async function getImageNamesFromAccout() {
    const { data, error } = await supabase
      .storage
      .from('images')
      .list(sessionInfo.user.id)
    if (error) throw error 
    return data
  }

  async function getImageList() {
    console.log("bababa")
    console.log(sessionInfo.user.id)
    const imageNames = []
    let data = await getImageNamesFromAccout()

    if (data) {
      for(let i = 1; i < data.length; i++)  {
        imageNames.push(data[i].name)
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
  {:else}
    <SignIn bind:loggedIn={loggedIn} bind:sessionInfo={sessionInfo}/>
  {/if}

  <div class="postPanel">
    {#if sessionInfo != null}
      {#await getImageList() then value} 
        {#each value as fileName}
          <Post imageName={fileName} posterUsername={"Alex"} sessionInfo={sessionInfo} likes={69} />
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
