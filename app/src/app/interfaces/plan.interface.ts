export interface Plan {
    name: string;
    price?: string;
    characteristics: Characteristic[];
    bgColor: string;
}

interface Characteristic {
    id: number;
    name: string;
}