<script>
    import {v4 as uuidv4} from 'uuid';
    import { supabase } from "../supabaseClient";
    
    export let sessionInfo;

    let fileinput;
    let title;

    
    async function addPostTitleToTable(uuid) {
        const { data, error } = await supabase
            .from('posts')
            .insert([
                {
                    'title': title,
                    'likes': 0,
                    'imageID': uuid
                }
            ])
        
        if (error) throw error 
    }

    async function onFileSelected(e) {
        let myuuid = uuidv4();
        addPostTitleToTable(myuuid);

        let image = e.target.files[0];
        let upload_path = sessionInfo.user.id + "/" + myuuid;
        
        const { data, error } = await supabase
            .storage
            .from('images')
            .upload(upload_path, image, {
                cacheControl: '3600',
                upsert: false
            })
        
        if (error) throw error
    }

</script>

<div>
    <input class="titleTextBox" bind:value={title}>
    <div class="uploadLabel" on:click={()=>{fileinput.click();}}  on:keydown={()=>{fileinput.click();}} > Click here to upload an image </div>
    <input style="display:none" type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} >
</div>
<style>
    .uploadLabel{
        font-size: 2rem;
        cursor: pointer;
    }

    .titleTextBox{
        margin-bottom: 1rem;
    }
</style>