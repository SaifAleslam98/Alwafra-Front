export function formatDate(date) {
    const options = {
        
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const paymentCreatedDateObj = new Date(date);
    return paymentCreatedDateObj.toLocaleDateString('ar-EG', options);
}

export function formatNumber(number) {
    const formatter = new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency:'AED',
        minimumFractionDigits: 2, // Ensures at least two decimal places
        maximumFractionDigits: 2, // Ensures no more than two decimal places
    });
    return formatter.format(number);
}
