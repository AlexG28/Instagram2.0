<script>
  import { supabase } from './supabaseClient'

  import Post from './lib/Post.svelte'
  import SignIn from './lib/SignIn.svelte'


  let loggedIn = false
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

  async function getImageList() {
   
    const imageNames = []
    const { data, error } = await supabase
      .storage
      .from('images')
      .list('MainImages')
    
    if (error) throw error

    if (data) {
      for(let i = 1; i < data.length; i++){
        imageNames.push(data[i].name)
      }
    }

    return imageNames
  }

  let imageList = getImageList()

</script>

<main>
  <h1 class="title" >
    Instagram 2.0
  </h1>

  {#if loggedIn == true}
    <p>Logged in</p>
  {:else}
    <SignIn bind:loggedIn={loggedIn} />
  {/if}

  <div class="postPanel">

    {#await imageList then value} 
      {#each value as fileName}
        <Post imageName={fileName} posterUsername={"Alex"} likes={69} />
      {/each}
    {/await}
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
