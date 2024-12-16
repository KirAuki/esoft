export interface Realtor {
    id: number;
    first_name: string;
    last_name: string;
    patronymic: string;
    commission_share?: string;
    full_name: string;
}

export interface Client {
    id: number;
    first_name: string;
    last_name: string;
    patronymic?: string;
    phone?: string;
    email?: string;
    full_name?: string;
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
    image?: string
}

export interface Offer {
    id: number;
    client: Client;
    realtor: Realtor;
    property: Property;
    price: number;
}

export interface Need {
    id: number;
    client: Client;
    realtor: Realtor;
    property_type: string;
    city?: string;
    street?: string;
    house_number?: string;
    apartment_number?: string;
    address: string;
    min_price: number;
    max_price: number;
    min_area?: number | null;
    max_area?: number | null;

    // Поля для квартир
    min_rooms?: number | null;
    max_rooms?: number | null;
    min_floor?: number | null;
    max_floor?: number | null;

    // Поля для домов
    min_floors?: number | null;
    max_floors?: number | null;
}
export interface Deal {
    id: number;
    need: Need;
    offer: Offer;
}

export interface Act {
    id: number;
    date_time: string;
    duration: number;
    act_type: string;
    comment: string;
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
