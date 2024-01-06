<script>
    import { onMount } from "svelte";
    import { supabase } from "../supabaseClient";
    import { sessionInfo } from "./store";

    export let imageName;
    
    let posterUsername;
    let likes;
    let imageValue = null;
    let description = null
    let postID
    let currentUserLiked

    async function likePost(){
      likes += 1
      currentUserLiked = true

      console.log("the post ID we just liked: " + postID)

      const {data, error} = await supabase
        .from('likes')
        .insert([
            {
                'user_id': $sessionInfo['user'].id,
                'post_id': postID
            }
        ])
    }

    async function unlikePost() {
      likes -= 1
      currentUserLiked = false

      console.log("the post ID we just liked: " + postID)

      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', postID)
        .eq('user_id', $sessionInfo['user'].id)

      if (error) {
        console.error(error)
      }
    }

    async function getMetadata() {
      const {data, error} = await supabase
        .from('posts')
        .select('*')
        .eq('imageID', imageName)
        .limit(1)

      if (error) throw error
    
      postID = data[0].id

      processLikes(postID);

      likes = data[0].likes
      posterUsername = data[0].title
      description = data[0].description
    }

    const getImage = async () => {
      try {

        const { data: blob, error } = await supabase
          .storage
          .from('images')
          .download("postImages" + "/" + imageName)

        if (error) throw error

        if (blob) {
          let imageFile = new File([blob], "imageFile1", { type: blob.type })
          
          const fr = new FileReader(); 
          fr.readAsDataURL(imageFile)
          fr.addEventListener('load', ()=>{
            imageValue = fr.result
          })
        }

      } catch (error){
        if (error instanceof Error){
          alert(error.message)
        }
      }
  }

  async function processLikes(postID) {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', postID)

    likes = data.length

    if (data.find((element) => element.user_id == $sessionInfo['user'].id)){
      console.log("user indeed liked this!!!!!!!!!!!")
      currentUserLiked = true
    } else {
      console.log("nonononononononono")
      currentUserLiked = false
    }
  }

  onMount(() => {
    getImage()
    getMetadata()
  })

</script>


<div class="post">
    <h2 class="postUsername" >
        {posterUsername}
    </h2>
    
    <img src={imageValue} class="postPicture" alt="Loading" />
    
    <div class="likebar">
        <h3 class="numOfLikes" >
            {likes} Likes
        </h3>
    
        {#if !currentUserLiked}
          <button class="likeButton" on:click={likePost}>
              Like this post
          </button>
        {:else}
          <button class="likedButton" on:click={unlikePost}>
            Liked
          </button>
        {/if}



        <h2>
          {#if description != null}
            {description}
          {/if}
        </h2>

    </div>
</div>


<style>
    .post{
        border-style: solid;
        border-color: rgb(73, 73, 73);
        border-radius: 8px;
        margin: 3rem 0rem;
    }

    .postUsername{
        text-align: left;
        margin: 20px;
        font-size: 2.5em;
    }

    .postPicture{
        width: 700px;
        border-radius: 8px;
    }
    .likebar{
        text-align: left;
        margin-left: 20px;
        margin-right: 20px;
    }
    .numOfLikes{
        display: inline-block;
        vertical-align: middle;
        font-size: 1.5em;
        padding-right: 1rem;
    }

    .likeButton, .likedButton {
        display: inline-block;
        padding: 1rem 1rem;
        vertical-align: middle;

        border-radius: 8px;
        background-color: inherit;
        border: none;
        font-size: 1.5em;

        cursor: pointer;

        /* background-color: var(--button-colour, red); */
    }

    .likeButton:hover{
        background-image: linear-gradient(45deg, #f3ec78, #af4261);
        color: black;
    }

</style>