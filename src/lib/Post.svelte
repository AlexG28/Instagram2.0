<script>
    import { onMount } from "svelte";
    import { supabase } from "../supabaseClient";
    import { sessionInfo } from "./store";
    
    export let postInfo;

    let posterUsername
    let likes
    let imageValue = null
    let description = null
    let postID
    let currentUserLiked


    async function likePost(){
      likes += 1
      currentUserLiked = true

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
      postID = postInfo.id
      posterUsername = postInfo.title
      description = postInfo.description
      
      processLikes(postID);
    }

    async function processLikes(postID) {
      const { data, error } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', postID)

      if (error){
        console.error(error)
      }

      likes = data.length

      if (data.find((element) => element.user_id == $sessionInfo['user'].id)){
        currentUserLiked = true
      } else {
        currentUserLiked = false
      }
    }
  
  
    async function getImage() {
        try {
          const { data: blob, error } = await supabase
            .storage
            .from('images')
            .download("postImages" + "/" + postInfo.imageID)

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