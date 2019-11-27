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