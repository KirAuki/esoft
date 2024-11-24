export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[+\d]?(?:[\d-.\s()]*)$/;
    return phoneRegex.test(phone);
};
  
  export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};