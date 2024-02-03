<nav class="navbar">
    <a href='#/' class="nav-link">Home</a>
    <a href='#/upload' class="nav-link">Upload</a>
    <a href='#/profile' class="nav-link">Profile</a>
</nav>

<style>
    .navbar {
        width: 20%;
        background-color: #333;
        overflow: hidden;
        position: fixed;
        top: 0;
        text-align: center;
    }
    
    .nav-link {
        float: none;
        display: inline-block;
        color: white;
        text-align: center;
        padding: 14px 20px;
        text-decoration: none;
        font-size: 16px;
    }
    
    .nav-link:hover {
        background-color: #ddd;
        color: black;
    }
    
    @media screen and (max-width: 600px) {
        .nav-link {
        float: none;
        display: block;
        width: 100%;
        }
    }

</style>
  