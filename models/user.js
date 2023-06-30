
class User
{
    user_id;
    #errorDetails = [];
    constructor(name, email, phone, pan, acnt_number, role, available_margin )
    {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.pan = pan;
        this.acnt_number = acnt_number;
        this.role = role;
        this.available_margin = available_margin;
    }

    isUserDetailsValid()
    {
        this.#errorDetails = [];
        
        // phone number validation
        if(!this.#phoneNumberValidator(this.phone)) {
            this.#errorDetails.push('Invalid phone number')
            return false;
        }

        // email validation
        if(!this.#emailValidator(this.email)){
            this.#errorDetails.push('Invalid email')
            return false;
        }

        return true;

    }

    #phoneNumberValidator(phn)
    {
        if(phn.length == 10 && !isNaN(phn))
        {
            return true;
        }
        return false;
    }

    #emailValidator(email) {
        // check for @
        var atSymbol = email.indexOf("@");
        if(atSymbol < 1) return false;
    
        var dot = email.indexOf(".");
        if(dot <= atSymbol + 2) return false;
    
        // check that the dot is not at the end
        if (dot === email.length - 1) return false;
    
        return true;
    }

    getErrorDetails()
    {
        return this.#errorDetails;
    }

}

module.exports =  User;
