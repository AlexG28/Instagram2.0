<script>
    import Navbar from "../components/Navbar.svelte";
    import { supabase } from "../supabaseClient";
    import { onMount } from "svelte";
    import { push } from 'svelte-spa-router'
    import { loggedIn, sessionInfo } from "./store";
    import Post from "./Post.svelte";


    let imageURLs = []


    async function downloadImageFiles(data){
        let imageBlobs = []
        for (const elem of data){
            const { data: blob, error } = await supabase
                .storage
                .from('images')
                .download("postImages" + "/" + elem.imageID)
            imageBlobs.push(blob)
        }

        return imageBlobs
    }


    async function unpackImageFiles(imageBlobs) {
        let imageURLs = [];
        for (const blob of imageBlobs) {
            let imageFile = new File([blob], "imageFile1", { type: blob.type });
            imageURLs.push(await readImageFile(imageFile));
        }
        return imageURLs;
    }

    function readImageFile(imageFile) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(imageFile);
            fileReader.addEventListener('load', () => {
                resolve(fileReader.result);
            });
        });
    }


    async function getUserUploadedPosts() {
        const {data, error} = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', $sessionInfo['user'].id)
        
        if (error){
            console.error(error)
        }
        
        data.sort((a, b) => a.created_at - b.created_at).reverse()
        return data
    }
    
    
    async function getUserPhotos() {
        let data = await getUserUploadedPosts()

        if (data.length === 0){
            return null
        }

        const imageBlobs = await downloadImageFiles(data)
        imageURLs = await unpackImageFiles(imageBlobs)

        console.log(imageURLs.length)        
    }

    onMount(()=> {
        getUserPhotos()
    })

</script>


<div>
    <Navbar />
    <h2>Your uploads</h2>

    {#if imageURLs.length === 0 }
        <h2>Your page is empty</h2>
    {:else}
        <div class="imageGrid">
            {#each imageURLs as image }
                <img src={image} class="image" alt="Loading" />
            {/each}
        </div>
        
    {/if}

</div>

<style>
    .imageGrid{
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
        grid-auto-rows: auto;
        grid-gap: 10px; /* You can adjust the gap as needed */
    }

    .image{
        width: 400px;
        border-radius: 8px;
    }

</style>