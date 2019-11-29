export function validateOptionalField(text) {
    const re = /^[0-9a-zA-Z \b]+$/;

    // return error

    if (re.test(text)) {
        return false;
    }
    return true;
}

export function validateRequiredField(text) {
    const re = /^[0-9a-zA-Z \b]+$/;

    // return error

    if (text !== "" && !!text && re.test(text)) {
        return false;
    }
    return true;
}

export function validateemail(text) {
    const re = /^[0-9a-zA-Z.-]+@[0-9a-zA-Z.-]+\.[a-zA-Z]+$/;

    // return error

    if (text !== "" && !!text && re.test(text)) {
        return false;
    }
    return true;
}

export function validatePassword(text) {
    const re = /^[0-9a-zA-Z]+@[0-9a-zA-Z]+\.[a-zA-Z]+$/;

    // return error

    // if (text.length !== "" && !!text && re.test(text)) {
    //     return false;
    // }
    return text.length < 3;
}

export function validatePhone(text) {
    const re = /^\+\d{12}$/;

    // return erro

    if (text !== "" && !!text && re.test(text)) {
        return false;
    }
    return true;
}