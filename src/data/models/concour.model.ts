

export interface Candidate {
    id: number;
    concour_id: number;
    last_name: string;
    first_name: string;
    nationality: string;
    full_description: string;
    profile_photo: string;
    votes_count?: number | null;
}

export type Concour = {
    id: number;
    name: string;
    description?: string;
    image?: string | null;
    start_at?: string;
    end_at?: string;
    price_per_vote: number;
    status?: 'EN_COURS' | 'TERMINE' | 'A_VENIR'

    candidates?: Candidate[];
}