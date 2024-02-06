/* eslint-disable */ 

// const showAlert = require('./alert')

const login = async(email, password) => {
    console.log(email, password);
    try{
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
                email,
                password
            }
        })

        if(res.data.status === 'success'){
            alert('Logged in successfully');
            window.setTimeout(()=>{
                location.assign('/');
            }, 1000)
        }

        console.log(res);
    }catch (err) {
        alert("Incorrect Email or Password");
    }
    
}






const logout = async (event) => {
    event.preventDefault(); // Prevent the default behavior (page reload)

    try {
        console.log("openedddddddddddddddd");
        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:3000/api/v1/users/logout',
        });

        if (res.data.status === 'success') {
            alert('Logged out successfully');
            location.reload(true);
        }
    } catch (err) {
        alert("Error logging out, try again");
    }
};

const updateSettings = async (name, email) => {
    console.log("updateSetting")
    try {
        console.log("updateSettingtry")
      const res = await axios({
        method: 'PATCH',
        url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
        data: {
            name, 
            email
        }
        
    });
    console.log("updateSettingAfterTry")
        
    //   if (res.data.status === 'success') {
    //     alert(`${type.toUpperCase()} updated successfully!`);
    //   }
      console.log("updateSettingAfteralertt")
    } catch (err) {
      alert("err.response.data.message");
    }
};

const handleLogout = (event) => {
    if (event.target.closest('.nav__el.nav__el--logout')) {
        event.preventDefault();
        logout(event);
    }
};

const handleLogin = (event) => {
    if (event.target.closest('.form')) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    }
};

const handleUpdate = (event) => {
    console.log("handleUpdate")
    if (event.target.closest('.form-user-data')) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        updateSettings(name, email);
    }
}

document.addEventListener('click', handleLogout);
document.addEventListener('submit', handleLogin);
document.addEventListener('submit', handleUpdate);
