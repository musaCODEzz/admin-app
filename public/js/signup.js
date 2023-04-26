document.getElementById('signup').addEventListener('click', function(event) {
    
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    

    console.log(email, name, password);

   axios.post("https://silent-mouse-67.telebit.io/signup",
                        {name, email, password
                        }).then((data) => {
                            console.log(data.data);
                            const signup = new Signup({
                                name: name,
                                email: email,
                                password: password,
                            });

                            signup.save().then((data) => {
                                console.log(data);
                                
                            }
                            ).catch((error) => {
                                console.log(error);
                                
                            }
                            );
                        }).catch((error) => {
                            console.log(error);                       
                        } );

});



