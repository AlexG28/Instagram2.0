<script>
  import { onMount } from 'svelte'
  import { supabase } from './supabaseClient'

  import Post from './lib/Post.svelte'

  let loading = false
  let results = null

  const getData = async () => {
    try {
      loading = true
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
      loading = false
    }
  }

  const getImageList = async () => {
    const imageNames = []
    const { data, error } = await supabase
      .storage
      .from('images')
      .list('MainImages')
    
    if (error) throw error
  
    if (data) {
      for(let i = 1; i<data.length; i++){
        imageNames.push(data[i].name)
      }
    }
    console.log(imageNames)
    console.log("crazyyyy")
    return imageNames

  }

  onMount(() =>{
    // getData()
    // getImageList()
  })

</script>

<main>
  <h1 class="title" >
    Instagram 2.0
  </h1>

  <div class="postPanel">
    <Post imageName={"image1.png"} posterUsername={"Alex"} likes={69} />
    <Post imageName={"image2.png"} posterUsername={"Alex"} likes={69} />
    <Post imageName={"image3.jpg"} posterUsername={"Alex"} likes={69} />
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
