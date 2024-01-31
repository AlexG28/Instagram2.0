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

        try {
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

        } catch (error){
            console.log("there has been an error", error)
        }
    }

    async function submitPost() {
        let myuuid = uuidv4();
        addPostTitleToTable(myuuid);
        let upload_path = 'postImages' + "/" + myuuid;

        console.log("The upload path is: " + upload_path)
        
        try {
            const { data, error } = await supabase
                .storage
                .from('images')
                .upload(upload_path, image, {
                    cacheControl: '3600',
                    upsert: true
                })
            
            if (error) throw error

        } catch (error) {
            console.log("an error occured: " + error)
        }
        
        
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
    
    <form class="post-form">
        <div class="form-group">
            <label for="title" class="form-label">Title:</label>
            <input class="titleTextBox form-input" bind:value={title}>
        </div>
        
        <div class="form-group">
            <label for="description" class="form-label">Description:</label>
            <input class="descriptionTextBox form-input" bind:value={description}>
        </div>

        {#if localImage != null}
            <img src={localImage} class="postPicture" alt="Loading" />
        {/if}

        <div class="form-group">
            <div class="uploadLabel" on:click={()=>{fileinput.click()}}  on:keydown={()=>{fileinput.click()}} > Click here to upload an image </div>
            <input style="display:none" type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>saveImage(e)} bind:this={fileinput} >
        </div>

        <div class="form-group">
            <button class="submit-button" on:click={submitPost}>
                Submit Post
            </button>
        </div>

    </form>
</div>
<style>
    /* .uploadLabel{
        font-size: 2rem;
        cursor: pointer;
    }

    .titleTextBox{
        margin-bottom: 1rem;
    }

    .postPicture{
        width: 200px;
    } */

    .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

.navbar {
    background-color: #333;
    overflow: hidden;
    text-align: center;
}

.nav-link {
    color: white;
    text-decoration: none;
    padding: 10px 20px;
}

.form-group {
    margin-bottom: 20px;
}

.form-label {
    display: block;
    margin-bottom: 5px;
}

.form-input {
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.postPicture {
    max-width: 100%;
    height: auto;
    margin-bottom: 10px;
}

.uploadLabel {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 4px;
    display: inline-block;
}

.submit-button {
    background-color: #28a745;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

</style>