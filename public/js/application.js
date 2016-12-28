// instantiate needed objects
let SStorage = new SessionStorage();
let LStorage = new LocalStorage();
let auth = new Auth();
let userModel = new UserModel();

// setup dependencies
userModel.storage = LStorage;
auth.sessionStorage = SStorage;
auth.credentialStorage = LStorage;
auth.credentialNamespace = STORAGE_NAMESPACES_USER;


//
const AUTH_LIST = ['profile', 'update', 'list', 'logout'];
const GUEST_LIST = ['login', 'register'];

let pathname = window.location.pathname;
const REQUESTED_PAGE = pathname.replace('/','')
                            .replace('.php','')
                            .toLowerCase();

if('logout' == REQUESTED_PAGE){
    auth.clearAuthorizationData();
}

let isAuthorized = auth.isAuthorized();
if(isAuthorized){
    // check if requested page within the authList
    if( -1 == AUTH_LIST.indexOf(REQUESTED_PAGE)){
        // do redirect
        window.location.href = '/profile.php';
    }
}else{
    // check if requested page within the guestList
    if( -1 == GUEST_LIST.indexOf(REQUESTED_PAGE)){
        // do redirect
        window.location.href = '/login.php';
    }
}


$(document).ready(function(){
    $('[class*="header-alert"]').each(function(){
        $(this).removeClass('hidden').hide();
    });

    let $registrationForm = $('#registration-form');
    if($registrationForm.length > 0){
        registrationFormObject = new Form($registrationForm.attr('id'));

        registrationFormObject.on('click', function (event) {
            if('submit' == event.target.type){

                let isValid =  registrationFormObject.checkValidity();
                if(isValid){
                    let user = new User();
                    user.setProps(registrationFormObject.getData());
                    try{
                        userModel.addUser(user);
                        window.location.href = registrationFormObject.action;
                    }catch(exception){
                        $('.error-header-alert').show();
                        $('.error-header-alert .message').text(exception.message);
                        setTimeout(function(){
                            $('.error-header-alert').fadeOut();
                        },5000)
                    }
                    event.stopPropagation();
                }
            }
        });

        registrationFormObject.on('submit', function (event) {
            event.preventDefault();
            return false;
        });
    }

    let $loginForm = $('#login-form');
    if($loginForm.length > 0){
        loginFormObject = new Form($loginForm.attr('id'));

        loginFormObject.on('click', function (event) {
            if('submit' == event.target.type){

                let isValid =  loginFormObject.checkValidity();

                if(isValid){
                    let user = new User();
                    user.setProps(loginFormObject.getData());

                    auth.credentialId = user.email;
                    let data = auth.authenticate('password',user.password);
                    if(null != data){
                        window.location.href = loginFormObject.action;
                    }else{
                        $('.error-header-alert').show();
                        $('.error-header-alert .message').text('Username or Password is incorrect');
                        setTimeout(function(){
                            $('.error-header-alert').fadeOut();
                        },5000);
                    }

                    event.stopPropagation();
                }
            }
        });

        loginFormObject.on('submit', function (event) {
            event.preventDefault();
            return false;
        });
    }

    let $profileInfo = $('.profile-info');

    if($profileInfo.length > 0){
        let loggedData = auth.getAuthorizationData();
        console.log(loggedData);
        if(null != loggedData){
            let user = userModel.getUserByEmail(loggedData.email);

            let name = user.name;
            let email = user.email;
            let mobile = user.mobile;

            let $nameEle = $profileInfo.find('[data-name]');
            let $emailEle = $profileInfo.find('[data-email]');
            let $mobileEle = $profileInfo.find('[data-mobile]');

            console.log(user.getProps());
            if(name && $nameEle.length){
                $nameEle.text(name);
            }

            if(email && $emailEle.length){
                $emailEle.text(email);
                let href = $emailEle.attr('href');
                href = href.replace('{email}',email);
                $emailEle.attr('href', href);
            }

            if(mobile && $mobileEle.length){
                $mobileEle.text(mobile);
                let href = $mobileEle.attr('href');
                href = href.replace('{mobile}',mobile);
                $mobileEle.attr('href', href);
            }
        }
    }

    let $updateForm = $('#update-form');
    if($updateForm.length > 0){
        updateFormObject = new Form($updateForm.attr('id'));

        let authData = auth.getAuthorizationData();
        let user = userModel.getUserByEmail(authData.email);
        if(null != user){
            updateFormObject.setData(user.getProps());

        }
        updateFormObject.disableElements(['email']);
        updateFormObject.on('click', function (event) {
            if('submit' == event.target.type){

                let isValid =  updateFormObject.checkValidity();
                if(isValid){
                    let user = new User();
                    user.setProps(updateFormObject.getData());
                    try{
                        userModel.updateUser(user);
                        window.location.href = updateFormObject.action;
                    }catch(exception){
                        $('.error-header-alert').show();
                        $('.error-header-alert .message').text(exception.message);
                        setTimeout(function(){
                            $('.error-header-alert').fadeOut();
                        },5000)
                    }
                    event.stopPropagation();
                }
            }
        });

        updateFormObject.on('submit', function (event) {
            event.preventDefault();
            return false;
        });
    }
});















