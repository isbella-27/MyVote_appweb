import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router'; // Changé pour 'react-router-dom'
import { candidatApi } from '../../../api/candidates/crud';
import './Edit.css'
import Input from '../../../Components/Input/Input'; 
import Button from '../../../Components/Button/Button'; 
import SideBar from '../../../Components/Sidebar/Sidebar';
import type { Candidate } from '../../../data/models/candidate';


interface RouteParams extends Record<string, string | undefined> {
    id: string; 
}

export default function Edit() {
    const navigate = useNavigate();
    // Typage explicite des paramètres
    const { id } = useParams<RouteParams>(); 

    const [isLoading, setIsLoading] = useState<boolean>(true); 
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const [last_name, setLastName] = useState("");
    const [first_name, setFirstName] = useState("");
    const [nationality, setNationality] = useState("");
    const [full_description, setFullDescription] = useState("");
    const [profile_photo, setProfilePhoto] = useState<File | null>(null);
    const [votes_count, setVoteCount] = useState(""); 
    const [concour_id, setConcourId] = useState(""); 


    // Gestionnaires de changement
    const OnFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value);
    const OnLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value);
    const OnNationalityChange = (e: React.ChangeEvent<HTMLInputElement>) => setNationality(e.target.value);
    
    const OnFullDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setFullDescription(e.target.value);
    const onFullProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setProfilePhoto(event.target.files[0]);
        }
    };
    const onFullVoteCountChange = (event: React.ChangeEvent<HTMLInputElement>) => { setVoteCount(event.target.value); }

    // --- Chargement des données existantes (EDIT) ---
    useEffect(() => {
        const fetchCandidate = async () => {
            if (!id) return;
            
            try {
                const candidateId = parseInt(id, 10);
                if (isNaN(candidateId)) return;

                // 🎯 CORRECTION : Récupérer la réponse et extraire la donnée
                const response = await candidatApi.read(candidateId);
                
                // Si l'API retourne la donnée sous response.data, utilisez-la.
                // Si la fonction read dans crud.ts a déjà déstructuré la réponse, utilisez 'response' directement.
                // Nous allons supposer que le problème vient d'ici et que 'response' est le Wrapper.
                const data: Candidate = (response as any).data || response; 

                // L'opérateur 'as any' est utilisé ici pour forcer TypeScript à ignorer 
                // le type de retour du wrapper et à traiter 'data' comme Candidate, 
                // en attendant que le type de retour de candidatApi.read soit corrigé.
                
                // Initialisation avec les données du candidat
                setFirstName(data.first_name || "");
                setLastName(data.last_name || "");
                setNationality(data.nationality || "");
                
                // C'est cette ligne qui causait l'erreur si 'data' était le wrapper
                setFullDescription(data.full_description || ""); 
                
                setVoteCount(data.votes_count ? String(data.votes_count) : "");
                setConcourId(data.concour_id ? String(data.concour_id) : "")
                

            } catch (error) {
                console.error("Erreur de chargement :", error);
                setErrorMessage("Échec du chargement des données du candidat.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCandidate();
    }, [id]);


    // --- Soumission du formulaire (EDIT) ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        
        const candidateId = parseInt(id || "0", 10);
        if (candidateId === 0) {
            setErrorMessage("Erreur: ID du candidat manquant.");
            return;
        }

        try {
            setIsLoading(true);
            
            const formData = new FormData();
            
            formData.set("last_name", last_name);
            formData.set("first_name", first_name);
            formData.set("nationality", nationality);
            formData.set("full_description", full_description);
            formData.set("votes_count", votes_count);
            
            formData.set("_method", "PUT"); 

            if (profile_photo) {
                formData.append("profile_photo", profile_photo);
            }
            
            if (concour_id) {
                formData.set("concour_id", concour_id);
            }

            await candidatApi.update(candidateId, formData);
            setSuccessMessage('Candidat mis à jour avec succès ! Redirection...');
            
            setTimeout(() => {
                navigate('/candidates/List');
            }, 2000);

        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
            setErrorMessage("Erreur lors de la mise à jour du candidat. Veuillez réessayer.");
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='create'>
            <SideBar />
            
            <div className='form-container-wrap'>
                <h1>
                    Modifier le candidat ID: {id || 'N/A'}
                </h1>
                <Link to={`/candidates/List`} className="back-button">← Retour à la liste</Link>
                
                <div className='Container'>
                    {isLoading && <p>Chargement des données...</p>}
                    
                    {errorMessage && <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</p>}
                    {successMessage && <p style={{ color: 'green', fontWeight: 'bold' }}>{successMessage}</p>}
                    
                    {!isLoading && (
                        <form onSubmit={handleSubmit}>
                            
                            {/* Champ caché ConcourId (si nécessaire) */}
                            {concour_id && (
                               <Input
                                    reference='concour_id'
                                    type='hidden'
                                    value={concour_id}
                                    onChange={() => { }}
                                />
                            )}
                            
                            {/* Nom et Prénom */}
                            <Input label='Prénom :' reference='first_name' type='text' placeholder='Entrez le prénom du candidat' onChange={OnFirstNameChange} value={first_name} />
                            <Input label='Nom de famille :' reference='last_name' type='text' placeholder='Entrez le nom du candidat' onChange={OnLastNameChange} value={last_name} />
                            
                            {/* Nationalité */}
                            <Input label='Nationalité :' reference='nationality' type='text' placeholder='Précisez la nationalité du candidat' onChange={OnNationalityChange} value={nationality} />                        
                            
                            {/* Description */}
                            <label htmlFor="full_description">Description complète :</label>
                            <textarea 
                                id="full_description"
                                name='full_description' 
                                placeholder='Donnez une description complète du candidat' 
                                onChange={OnFullDescriptionChange} 
                                value={full_description} 
                                style={{ width: '100%', minHeight: '100px', padding: '10px' }} 
                            />

                            {/* Fichier et Votes */}
                            <Input
                                label='Photo de profil (laisser vide pour ne pas changer) :'
                                reference='profile_photo'
                                type='file'
                                onChange={onFullProfilePhotoChange}
                            />
                            
                            <Input label='Nombre de votes :' reference='votes_count' type='number' placeholder='0' onChange={onFullVoteCountChange} value={votes_count} />
                            
                            <Button 
                                className='but' 
                                label={isLoading ? 'Mise à jour...' : 'Mettre à jour'} 
                                type='submit' 
                                disabled={isLoading} 
                            />
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}