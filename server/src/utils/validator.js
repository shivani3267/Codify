import validator from 'validator'

export const validate = (data)=>{
    const mandatoryfield = ['firstName','emailId', 'password'];
    const isAllowed = mandatoryfield.every((k)=> Object.keys(data).includes(k))
    if(!isAllowed){
        throw new Error("Some important fields are missing");
    }

    if(!validator.isEmail(data.emailId)){
        throw new Error("Invalid Email");
    }

    // if(!validator.isStrongPassword(data.password)){
    //     throw new Error("Weak password");
    // }

}
