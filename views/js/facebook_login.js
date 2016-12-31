// initialize and setup facebook js sdk
    window.fbAsyncInit = function() {
        FB.init({
            appId      : '1813986828875962',
            xfbml      : true,
            version    : 'v2.5'
        });

        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                document.getElementById('status').innerHTML = 'You are logged in';
                document.getElementById('get').style.visibility = 'visible';
                document.getElementById('login').style.visibility = 'hidden';
            } 
            else if (response.status === 'not_authorized') {
                document.getElementById('status').innerHTML = 'You are not logged in. Login to view your profile information.'
            } 
            else {
                document.getElementById('status').innerHTML = 'You are not logged into Facebook.';
                document.getElementById('get').style.visibility = 'hidden';
            }
        });
    };
    //load sdk into profile page
    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    
    function login() {
        FB.login(function(response) {
            if (response.status === 'connected') {
                document.getElementById('status').innerHTML = 'You are logged in';
                document.getElementById('get').style.visibility = 'visible';
                document.getElementById('login').style.visibility = 'hidden';
            } else if (response.status === 'not_authorized') {
                document.getElementById('status').innerHTML = 'You are not logged in. Login to view your profile information..'
            } else {
                document.getElementById('status').innerHTML = 'You are not logged into Facebook.';
                document.getElementById('get').style.visibility = 'hidden';
            }
        }, {scope: 'email,user_birthday,user_location,user_work_history,user_education_history',return_scopes: true});
    }

    // getting basic user info
    function getInfo() {
        var accessToken = FB.getAuthResponse();
        console.log(accessToken);

        FB.api('/me', {fields: 'id,name,email,gender,birthday,location,education,work,picture,link'},function(response) {
            document.getElementById("name").innerHTML='<strong>Username: </strong> ' + response.name;
            document.getElementById("location").innerHTML='<strong>Location: </strong> ' + response.location['name'];
            document.getElementById("email").innerHTML='<strong>Email: </strong> ' + response.email;
            document.getElementById("birthday").innerHTML='<strong>Birthday: </strong> ' + response.birthday;
            document.getElementById("gender").innerHTML='<strong>Gender: </strong> ' + response.gender;
            document.getElementById("profileImage").setAttribute("src",response.picture['data']['url']);
            document.getElementById("f_url").setAttribute("href",response.link);
            
            //this code will display data for my account or any account with two work history and one education information
            //Set work history information
            document.getElementById("work1").innerHTML='<strong>'+response.work[0]['position']['name']+'</strong>' ;
            document.getElementById("location1").innerHTML='<strong>'+response.work[0]['location']['name']+'</strong>'
            document.getElementById("company1").innerHTML= '<strong>'+response.work[0]['employer']['name']+'</strong>';

            document.getElementById("work2").innerHTML='<strong>'+response.work[1]['position']['name']+'</strong>' ;
            document.getElementById("location2").innerHTML='<strong>'+response.work[1]['location']['name']+'</strong>'
            document.getElementById("company2").innerHTML= '<strong>'+response.work[1]['employer']['name']+'</strong>';

            //Get education history information
            document.getElementById("concentration").innerHTML='<strong>'+response.education[1]['concentration'][0]['name']+'</strong>'
            document.getElementById("college").innerHTML= '<strong>'+response.education[1]['school']['name']+'</strong>';


            //this code was written for different accounts to get wor history information and view it
            // var count_work = (response.work).length;
            // var i=0,id_work=1;
            // for(i=0;i<count_work;i++){
            //     var p_work = document.createElement("P"); 
            //     p_work.setAttribute("id",id_work);

            //     var t1 = document.createTextNode(response.work[i]['position']['name']);       // Create a text node
            //     p_work.appendChild(t1); // Append the text to <p>
                                                       
            //     var t2 = document.createTextNode(response.work[i]['location']['name']);       // Create a text node
            //     p_work.appendChild(t2); // Append the text to <p>

            //     var t3 = document.createTextNode(response.work[i]['employer']['name']);       // Create a text node
            //     p_work.appendChild(t3); 
                
            //     var parent_work=document.getElementById('parent_work');                                           // Append the text to <p>
            //     parent_work.appendChild(p_work); 
            //     document.getElementById(id_work).style.color = "blue";


            //     id_work++;
            // }
            

        });
        //View profile template with user's facebook information
        var mydev = document.getElementById('mydev');
        if (mydev.style.visibility === 'hidden') {
            mydev.style.visibility = 'visible';
        }
        document.getElementById('get').style.visibility = 'hidden';
        document.getElementById('status').style.visibility = 'hidden';
   
    }