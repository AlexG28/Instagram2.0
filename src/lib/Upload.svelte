<script>
    import {v4 as uuidv4} from 'uuid';
    import { supabase } from "../supabaseClient";
    import { sessionInfo } from './store';
    import { push } from 'svelte-spa-router';
    import Navbar from '../components/Navbar.svelte';

    let fileinput;
    let title;
    let description;
    let image; 
    let localImage;

    async function addPostTitleToTable(uuid) {
        const { data, error } = await supabase
            .from('posts')
            .insert([
                {
                    'title': title,
                    'description': description,
                    'likes': 0,
                    'imageID': uuid,
                    'user_id': $sessionInfo['user'].id
                }
            ])
        
        if (error) throw error 
    }

    async function submitPost() {
        let myuuid = uuidv4();
        addPostTitleToTable(myuuid);
        let upload_path = 'postImages' + "/" + myuuid;
        
        console.log("The upload path is: " + upload_path)
        
        const { data, error } = await supabase
            .storage
            .from('images')
            .upload(upload_path, image, {
                cacheControl: '3600',
                upsert: false
            })
        
        if (error) throw error
        
        push("/");
    }

    async function saveImage(e) {
        image = e.target.files[0]
        displayImage(image)
    }

    async function displayImage(imageFile){
        const fr = new FileReader(); 
        fr.readAsDataURL(imageFile)
        fr.addEventListener('load', ()=>{
            localImage = fr.result
        })
    }

</script>

<div>
    <Navbar />
    <form>
        <div>
            <label for="title">Title:</label>
            <input class="titleTextBox" bind:value={title}>
        </div>
        
        <div>
            <label for="description">Description:</label>
            <input class="descriptionTextBox" bind:value={description}>
        </div>

        {#if localImage != null}
            <img src={localImage} class="postPicture" alt="Loading" />
        {/if}

        <div>
            <div class="uploadLabel" on:click={()=>{fileinput.click()}}  on:keydown={()=>{fileinput.click()}} > Click here to upload an image </div>
            <input style="display:none" type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>saveImage(e)} bind:this={fileinput} >
        </div>

        <div>
            <button  on:click={submitPost}>
                Submit Post
            </button>
        </div>

    </form>
</div>
<style>
    .uploadLabel{
        font-size: 2rem;
        cursor: pointer;
    }

    .titleTextBox{
        margin-bottom: 1rem;
    }

    .postPicture{
        width: 200px;
    }
</style>