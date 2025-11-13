

export type Concour = {
    id: number;
    name: string;
    description?: string;
    image?: string;
    start_at?: string;
    end_at?: string;
    price_per_vote?: number;
    status?: 'BROUILLON' | 'EN_COURS' | 'TERMINE'
}
