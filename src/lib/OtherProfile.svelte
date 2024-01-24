<script>
    import Navbar from "../components/Navbar.svelte";
    import Post from "../components/Post.svelte";
    import { supabase } from "../supabaseClient";
    import { onMount } from "svelte";
    import { sessionInfo } from "./store";
    import { location, push } from 'svelte-spa-router'
 
    let id = ($location).substring(1)
    console.log(id)

    let followed = false


    let followers = 0
    let following = 0

    async function getListOfPosts() {
        const {data, error} = await supabase
            .from('posts')
            .select('*')
            .eq("user_id", id)

        if (error){
            console.error(error)
        }
        
        data.sort((a, b) => {
            const dateA = new Date(a.created_at)
            const dateB = new Date(b.created_at)
            return dateA.getTime() - dateB.getTime()
        }).reverse()

        return data
    }

    async function getFollowerInfo(){
        const { data, error } = await supabase
            .from('follow')
            .select('*')
            .eq('follower_id', $sessionInfo['user'].id)

        if (error) {
            console.error(error)
        }

        following = data.length
    }
    
    async function getFollowingInfo(){
        const { data, error } = await supabase
            .from('follow')
            .select('*')
            .eq('followed_id', $sessionInfo['user'].id)
        
        if (error) {
            console.error(error)
        }
        
        followers = data.length
    }

    async function followUser(){
        followers += 1
        followed = true

        const { data, error } = await supabase
            .from("follow")
            .insert([
                {
                    'follower_id': $sessionInfo['user'].id,
                    'followed_id': id
                }
            ])
    }

    
    async function unfollowUser(){
        followers -= 1
        followed = false
        const { data, error } = await supabase
            .from("follow")
            .delete()
            .eq('follower_id', $sessionInfo['user'].id)
            .eq('followed_id', id)

        if (error){
            console.error(error)
        }
    }

    async function checkIfFollowed() {
        const { data, error } = await supabase
            .from("follow")
            .select("*")
            .eq('follower_id', $sessionInfo['user'].id)
            .eq('followed_id', id)

        if (data.length > 0){
            followed = true
        } else{
            followed = false
        }
    }

    async function checkIfCurrentUserProfile() {
        if (id == $sessionInfo['user'].id) {
            push("/profile")
        }
    }



    onMount(()=> {
        checkIfCurrentUserProfile()
        getFollowerInfo()
        getFollowingInfo()
        checkIfFollowed()
    })


</script>


<div>

    <Navbar />
    
    <h2> 
        {$sessionInfo['user'].id} has: 
    </h2>
    <h2>
        {followers} Followers
    </h2>
    <h2>
        {following} Following
    </h2>

    {#if followed == true}
        <button  on:click={unfollowUser}> 
            Unfollow 
        </button>
    {:else}

        <button  on:click={followUser}> 
            Follow 
        </button>
    {/if}

    
    <div class="postPanel">
        {#if $sessionInfo != null}
            {#await getListOfPosts() then value} 
                {#each value as postInfo}
                    <Post postInfo={postInfo} />
                {/each}
            {/await} 
        {/if}
    </div>

</div>