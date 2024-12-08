export interface Realtor {
    id: number;
    first_name: string;
    last_name: string;
    patronymic: string;
    commission_share?: string;
}

export interface Client {
    id: number;
    first_name: string;
    last_name: string;
    patronymic?: string;
    phone?: string;
    email?: string;
}

export interface Property {
    id: number;
    property_type: string;
    city?: string;
    street?: string;
    house_number?: string;
    apartment_number?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    area?: number;
    floor?: number;
    rooms?: number;
    floors?: number;
}

export interface Errors {
    phone_email?: string;
    email?: string;
    phone?: string;
    lastName?: string;
    firstName?: string;
    patronymic?: string;
    commissionShare?: string;
}
