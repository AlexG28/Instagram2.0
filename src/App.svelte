<script>
  import Post from './lib/Post.svelte'

  import image1 from './assets/image1.png'
  import image2 from './assets/image2.png'
  import image3 from './assets/image3.jpg'

</script>

<main>
  <h1 class="title" >
    Instagram 2.0
  </h1>

  <div class="postPanel">
    <Post image1={image1} posterUsername={"NASA"} likes={12}/>
    <Post image1={image2} posterUsername={"James Webb Space Telescope"} likes={19}/>
    <Post image1={image3} posterUsername={"Christopher Nolan"} likes={1736}/>
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
