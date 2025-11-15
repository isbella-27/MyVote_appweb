

export type Candidate = {
    id: number;
    concour_id: number;
    last_name: string;
    first_name: string;
    nationality: string;
    full_description: string;
    profile_photo: string;
    votes_count?: number | null;
}