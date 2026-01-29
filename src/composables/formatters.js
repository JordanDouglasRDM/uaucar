export function formatCpf(cpf) {
    if (!cpf) return '';
    const cleanedCpf = cpf.replace(/\D/g, '');
    return cleanedCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatPhone(phone) {
    if (!phone) return '';
    const cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.length === 11) {
        return cleanedPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleanedPhone.length === 10) {
        return cleanedPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return cleanedPhone;
}

export function useFormatDate(dateFromLaravel, useIn) {
    try {
        if (useIn === 'table') {
            const data = new Date(dateFromLaravel)
            return data.toLocaleString('pt-BR');
        } else if (useIn === 'input') {
            const date = new Date(dateFromLaravel);

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês é 0-indexado
            const day = String(date.getDate()).padStart(2, '0');
            const hour = String(date.getHours()).padStart(2, '0');
            const minute = String(date.getMinutes()).padStart(2, '0');

            return `${year}-${month}-${day}T${hour}:${minute}`;
        }

    } catch (error) {
        console.log(error)
    }
}

export function useFormatName(name) {
    try {
        const partsName = name.split(' ');
        if (partsName.length === 1) {
            return partsName[0];
        }
        return `${partsName[0]} ${partsName[partsName.length - 1]}`;
    } catch (error) {
        console.log(error)
    }
}

export function currencyToNumber(currencyString) {
    if (typeof currencyString !== 'string') return currencyString;
    const number = parseFloat(
        currencyString.replace("R$", "").trim().replace(/\./g, "").replace(",", ".")
    );
    return isNaN(number) ? null : number;
};
