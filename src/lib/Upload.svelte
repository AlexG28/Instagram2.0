<script>
    import {v4 as uuidv4} from 'uuid';
    import { supabase } from "../supabaseClient";

    let fileinput;
    export let sessionInfo;
    
    async function onFileSelected(e) {
        let myuuid = uuidv4();
        console.log(myuuid)
        let image = e.target.files[0];
        let upload_path = sessionInfo.user.id + "/" + myuuid + ".jpg";
        console.log(upload_path)
        
        const { data, error } = await supabase
            .storage
            .from('images')
            .upload(upload_path, image, {
                cacheControl: '3600',
                upsert: false
            })
        
        if (error) {
            console.log(error)
        }
    }

</script>

<div>
    <div class="uploadLabel" on:click={()=>{fileinput.click();}}> Click here to upload an image </div>
    <input style="display:none" type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} >
</div>
<style>
    .uploadLabel{
        font-size: 2rem;
        cursor: pointer;
    }
</style>