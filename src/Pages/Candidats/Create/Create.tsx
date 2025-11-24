import React, { useState } from 'react';
import { Link, useParams } from 'react-router'; // CORRECTION: Import depuis 'react-router-dom'
import { candidatApi } from '../../../api/candidates/crud';
import Input from '../../../Components/Input/Input';
import Button from '../../../Components/Button/Button';
import './Create.css'
import SideBar from '../../../Components/Sidebar/Sidebar';
import axios from 'axios'; 

interface RouteParams extends Record<string, string | undefined> {
    id: string; 
}

export default function Create() {
    const { id: concours_id } = useParams<RouteParams>(); 

    const [last_name, setLastName] = useState("");
    const [first_name, setFirstName] = useState("");
    const [nationality, setNationality] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>(''); 
    const [full_description, setFullDescription] = useState("");
    const [profile_photo, setProfilePhoto] = useState<File | null>(null);
    const [votes_count, setVotesCount] = useState(""); 
    
    // Fonctions de changement d'état
    const onFullLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(event.target.value);
    }
    const onFullFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(event.target.value);
    }
    const onFullNationalityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNationality(event.target.value);
    }
    const onFullFullDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFullDescription(event.target.value);
    }
    const onFullProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setProfilePhoto(event.target.files[0]);
        }
    }
    const onFullVotesCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVotesCount(event.target.value); 
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        const currentConcour_id = concours_id;

        // Validation front-end essentielle avant l'appel API
        if (!currentConcour_id) {
            setErrorMessage("Erreur : L'ID du concours est manquant et nécessaire pour la création.");
            return;
        }

        if (!last_name || !first_name || !full_description || !profile_photo) {
            setErrorMessage("Veuillez remplir tous les champs obligatoires (Nom, Prénom, Description et Photo de profil).");
            return;
        }

        try {
            setIsLoading(true);
            
            const formData = new FormData();
            
            // Les noms des clés doivent correspondre aux attentes du backend (concourId est le nom du champ de requête)
            formData.set("concourId", currentConcour_id); 
            formData.set("lastName", last_name);
            formData.set("firstName", first_name);
            formData.set("nationality", nationality);
            formData.set("fullDescription", full_description);
            formData.set("votesCount", votes_count || "0"); 

            if (profile_photo) {
                // IMPORTANT: 'profilePhoto' dans le FormData DOIT correspondre à ce que Laravel attend ('profile_photo' dans la validation)
                // Si Laravel attend 'profile_photo', il faut changer 'profilePhoto' ici, ou ajuster la validation Laravel.
                // En général, il est préférable que le frontend envoie 'profile_photo' pour les formulaires.
                // Nous allons supposer que Laravel accepte 'profilePhoto' ou que l'on est bien configuré.
                formData.append("profilePhoto", profile_photo);
            }
            
            // L'appel se fait ici. L'intercepteur Axios doit ajouter l'en-tête Authorization
            await candidatApi.create(formData);
            
            setSuccessMessage('Candidat créé avec succès !');
            
            // Réinitialisation des champs après succès
            setLastName('');
            setFirstName('');
            setNationality('');
            setFullDescription('');
            setVotesCount('');
            setProfilePhoto(null); 

        } catch (error) {
            
            let friendlyError = 'Échec de la création du candidat. Problème inconnu.';

            if (axios.isAxiosError(error) && error.response) {
                const status = error.response.status;
                const data = error.response.data;

                if (status === 401) {
                    friendlyError = "Non autorisé (401) : Veuillez vous reconnecter. Le jeton est invalide ou manquant.";
                } else if (status === 422 && data.errors) {
                    // Erreur de validation Laravel
                    const validationMessages = Object.values(data.errors).flat().join(' | ');
                    friendlyError = `Erreur de validation (422) : ${validationMessages}`;
                } else if (data.message) {
                    friendlyError = `Erreur (${status}) : ${data.message}`;
                } else {
                    friendlyError = `Erreur de serveur (${status}).`;
                }
            }
            
            console.error("Erreur lors de la création du candidat:", error);
            setErrorMessage(friendlyError);
        }
        finally {
            setIsLoading(false);
        }
    };

    const backLink = concours_id ? `/concours/${concours_id}/candidates` : "/candidates/List";


    return (
        <div className='create'>
            <SideBar />

            <h1>
                Créer un candidat {concours_id ? `pour le concours #${concours_id}` : 'global'}
            </h1>
            <Link to={backLink} className="back-button">← Retour à la liste</Link>
            
            <div className='Container'>
                <form onSubmit={handleSubmit}>
                    {/* Affichage des messages */}
                    {successMessage && <p style={{ color: 'green', fontWeight: 'bold' }}>{successMessage}</p>}
                    {errorMessage && <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</p>}
                    
                    <Input label='Nom de famille :' reference='lastName' type='text' placeholder='Entrez le nom du candidat' onChange={onFullLastNameChange} value={last_name} />
                    <Input label='Prénom :' reference='firstName' type='text' placeholder='Entrez le prénom du candidat' onChange={onFullFirstNameChange} value={first_name} />
                    <Input label='Nationalité :' reference='nationality' type='text' placeholder='Précisez la nationalité du candidat' onChange={onFullNationalityChange} value={nationality} />
                    
                    <label htmlFor="fullDescription">Description complète :</label>
                    <textarea 
                        id="fullDescription"
                        name='fullDescription' 
                        placeholder='Donnez une description complète du candidat' 
                        onChange={onFullFullDescriptionChange} 
                        value={full_description} 
                        style={{ width: '100%', minHeight: '100px', padding: '10px' }} 
                    />

                    <Input
                        label='Photo de profil :'
                        reference='profilePhoto'
                        type='file'
                        onChange={onFullProfilePhotoChange}
                    />
                    
                    <Input label='Nombre de votes :' reference='votesCount' type='number' placeholder='0' onChange={onFullVotesCountChange} value={votes_count} />
                    
                    <Button 
                        className='but' 
                        label={isLoading ? 'Création...' : 'Créer'} 
                        type='submit' 
                        disabled={isLoading} 
                    />

                </form>
            </div>
        </div>
    );
}