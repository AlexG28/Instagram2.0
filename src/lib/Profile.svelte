<script>
    import Navbar from "../components/Navbar.svelte";
    import { supabase } from "../supabaseClient";
    import { onMount } from "svelte";
    import { sessionInfo } from "./store";


    let followers = 384
    let following = 763

    let imageURLs = []
    let postList = []

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
        imageURLs = []
        postList = await getUserUploadedPosts()

        if (postList.length === 0){
            return null
        }

        const imageBlobs = await downloadImageFiles(postList)
        const unpackedImages = await unpackImageFiles(imageBlobs)
        
        let tempImageURLs = []
        for(let i = 0; i < unpackedImages.length; i++){
            tempImageURLs.push({
                postID: postList[i].id, 
                imageURL: unpackedImages[i]
            })
        }
        imageURLs = tempImageURLs
    }


    async function deleteImageFile(imageID){
        const { data, error } = await supabase
            .storage
            .from('images')
            .remove(['postImages/' + imageID])
        
        if (error){
            console.error(error)
        }
    }

    async function deletePost(postID) {
        const { data, error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postID)

        if (error) {
            console.error(error)
        }
    }
    
    async function deletePostLikes(postID) {
        const { data, error } = await supabase
            .from('likes')
            .delete()
            .eq('post_id', postID)
            
        if (error) {
            console.error(error)
        }
    }


    async function handleClick(postID) {
        const userConfirmed = confirm("Do you want to delete this image?");
        
        if (userConfirmed){
            let postToDelete = postList.find(elem => elem.id === postID)

            console.log(postToDelete)

            deleteImageFile(postToDelete.imageID)
            deletePost(postToDelete.id)
            deletePostLikes(postToDelete.id)

            let testone = []

            for (let i = 0; i < imageURLs.length; i++){
                if (imageURLs[i].postID != postID) {
                    testone.push(imageURLs[i])
                }
            }

            imageURLs = testone
        }
    }

    async function getFollowerInfo(){
        const { data, error } = await supabase
            .from('following')
            .select('*')
            .eq('followed_user_id', $sessionInfo['user'].id)

        if (error) {
            console.error(error)
        }

        following = data.length;
    }
    
    async function getFollowingInfo(){
        const { data, error } = await supabase
            .from('following')
            .select('*')
            .eq('follower_user_id', $sessionInfo['user'].id)
        
        if (error) {
            console.error(error)
        }
        
        followers = data.length
    }


    onMount(()=> {
        getUserPhotos()
    })

</script>


<div>
    <Navbar />

    <h2>
        {followers} Followers
    </h2>
    <h2>
        {following} Following
    </h2>


    <h2>Your uploads</h2>

    {#if imageURLs.length === 0 }
        <h2>Your page is empty</h2>
    {:else}
        <div class="imageGrid">
            {#each imageURLs as image }
                <img src={image.imageURL} class="image" alt="Loading" on:click={() => handleClick(image.postID)} />
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