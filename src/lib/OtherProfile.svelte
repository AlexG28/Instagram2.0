<script>
    import Navbar from "../components/Navbar.svelte";
    import Post from "./Post.svelte";
    import { supabase } from "../supabaseClient";
    import { onMount } from "svelte";
    import { sessionInfo } from "./store";
    import {location} from 'svelte-spa-router'
 
    let id = ($location).substring(1)
    console.log(id)


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

    async function followUser(){
        followers += 1

        const { data, error } = await supabase
            .from("follow")
            .insert([
                {
                    'follower_id': $sessionInfo['user'].id,
                    'followed_id': id
                }
            ])
    }

    async function getFollowerInfo(){
        const { data, error } = await supabase
            .from('follow')
            .select('*')
            .eq('follower_id', $sessionInfo['user'].id)

        if (error) {
            console.error(error)
        }

        following = data.length;
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

    onMount(()=> {
        getFollowerInfo()
        getFollowingInfo()
    })


</script>


<div>

    <Navbar />
    
    <h2>
        This is some test shit hahahah {id}
    </h2>


    <h2>
        {followers} Followers
    </h2>
    <h2>
        {following} Following
    </h2>

    <button  on:click={followUser}> 
        Follow 
    </button>
    
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