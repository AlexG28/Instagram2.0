<script>
    import { onMount } from "svelte";
    import { supabase } from "../supabaseClient";

    export let imageName;
    export let sessionInfo;
    export let posterUsername; // temporary
    export let likes; // temporary

    let imageValue = null;
    
    const likePost = () => {
      likes += 1
    }

    const getImage = async () => {
      console.log(sessionInfo.user.id + "/" + imageName)
      try {

        const { data: blob, error } = await supabase
          .storage
          .from('images')
          .download(sessionInfo.user.id + "/" + imageName)

        if (error) throw error

        if (blob) {

          console.log(blob)

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
  })

</script>


<div class="post">
    <h2 class="postUsername" >
        {posterUsername}
    </h2>
    
    <img src={imageValue} class="postPicture" alt="Not Loaded" />
    
    <div class="likebar">
        <h3 class="numOfLikes" >
            {likes} Likes
        </h3>
    
        <button class="likeButton" on:click={likePost}>
            Like this post
        </button>

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

    .likeButton{
        display: inline-block;
        padding: 1rem 1rem;
        vertical-align: middle;

        border-radius: 8px;
        background-color: inherit;
        border: none;
        font-size: 1.5em;

        cursor: pointer;
    }

    .likeButton:hover{
        background-image: linear-gradient(45deg, #f3ec78, #af4261);
        color: black;
    }

</style>