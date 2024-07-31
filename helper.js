const validateIndonesianPhoneNumber = async (phoneNumber) => {
    // Remove spaces, dashes, and parentheses
    phoneNumber = phoneNumber.replace(/[\s-()]/g, '');

    // Define a regex for Indonesian phone numbers
    // Starts with +62 or 62 followed by 8-12 digits (common local numbers)
    const regex = /^(?:\+62|62|0)(?:\d{8,12})$/;

    return regex.test(phoneNumber);
}

const removeDuplicatedData = async (array, key) => {
    let uniqueArray = array.filter((item, index, self) =>
        index === self.findIndex((t) => t[key] === item[key])
    );
    return uniqueArray;
}

module.exports = { validateIndonesianPhoneNumber, removeDuplicatedData };