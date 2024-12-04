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