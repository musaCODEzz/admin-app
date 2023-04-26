

 document.getElementById("submit").addEventListener("click", function(event){
    event.preventDefault();
    

    const phone = document.getElementById("phone").value;
    const amount = document.getElementById("amount").value;
    console.log({phone, amount});

    axios.post("https://silent-mouse-67.telebit.io/stkPush",
                        {phone, amount
                        }).then((data) => {
                            console.log(data.data);
                            const payment = new Payment({
                                number: phone,
                                amount: amount,
                                trnx_id: data.data.TrxId,
                                timestamp: data.data.Timestamp,
                                
                            });

                            payment.save().then((data) => {
                                console.log(data);
                                
                            }
                            ).catch((error) => {
                                console.log(error);
                                
                            }
                            );
                            
                        }).catch((error) => {
                            console.log(error);                       
                        });



});