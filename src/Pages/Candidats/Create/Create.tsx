import React, { useState } from 'react';
import { Link } from 'react-router'; 
import { candidatApi } from '../../../api/candidates/crud';
import Input from '../../../Components/Input/Input';
import Button from '../../../Components/Button/Button';
import './Create.css'
import SideBar from '../../../Components/Sidebar/Sidebar';

export default function Create() {
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [nationality, setNationality] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>(''); // Ajout du message d'erreur
    const [fullDescription, setFullDescription] = useState("");
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [votesCount, setVotesCount] = useState(""); 
    const [concourId] = useState(""); 


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

        try {
            setIsLoading(true);
            
            const formData = new FormData();
            
            // Validation de concourId
            if (concourId) {
                formData.set("concourId", String(concourId));
            } else {
                setErrorMessage("Erreur : L'ID du concours est manquant et nécessaire pour la création.");
                setIsLoading(false);
                return;
            }

            // Validation minimale des autres champs
            if (!lastName || !firstName || !fullDescription) {
                setErrorMessage("Veuillez remplir au moins le nom, le prénom et la description complète.");
                setIsLoading(false);
                return;
            }

            formData.set("lastName", lastName);
            formData.set("firstName", firstName);
            formData.set("nationality", nationality);
            formData.set("fullDescription", fullDescription);
            
            formData.set("votesCount", votesCount || "0"); 

            if (profilePhoto) {
                formData.append("profilePhoto", profilePhoto);
            }

            await candidatApi.create(formData);
            
            setSuccessMessage('Candidat créé avec succès !');
            
            setLastName('');
            setFirstName('');
            setNationality('');
            setFullDescription('');
            setVotesCount('');
            setProfilePhoto(null); 

        } catch (error) {
            console.error("Erreur lors de la création du candidat:", error);
            setErrorMessage('Échec de la création du candidat. Veuillez vérifier les données.');
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='create'>
            <SideBar />

            <h1>
                Créer un candidat
            </h1>
            <Link to="/candidates/List" className="back-button">← Retour à la liste</Link>
            
            <div className='Container'>
                <form onSubmit={handleSubmit}>
                    {/* Affichage des messages */}
                    {successMessage && <p style={{ color: 'green', fontWeight: 'bold' }}>{successMessage}</p>}
                    {errorMessage && <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</p>}
                    
                    {/* Input Caché pour concourId */}
                    <Input
                        reference='concourId'
                        type='hidden'
                        value={concourId}
                        onChange={() => { }} // Fonction vide car c'est un champ contrôlé mais non modifiable par l'utilisateur
                    />
                    
                    <Input label='Nom de famille :' reference='lastName' type='text' placeholder='Entrez le nom du candidat' onChange={onFullLastNameChange} value={lastName} />
                    <Input label='Prénom :' reference='firstName' type='text' placeholder='Entrez le prénom du candidat' onChange={onFullFirstNameChange} value={firstName} />
                    <Input label='Nationalité :' reference='nationality' type='text' placeholder='Précisez la nationalité du candidat' onChange={onFullNationalityChange} value={nationality} />
                    
                    <label htmlFor="fullDescription">Description complète :</label>
                    <textarea 
                        id="fullDescription"
                        name='fullDescription' 
                        placeholder='Donnez une description complète du candidat' 
                        onChange={onFullFullDescriptionChange} 
                        value={fullDescription} 
                        style={{ width: '100%', minHeight: '100px', padding: '10px' }} 
                    />

                    <Input
                        label='Photo de profil :'
                        reference='profilePhoto'
                        type='file'
                        onChange={onFullProfilePhotoChange}
                    />
                    
                    {/* VotesCount n'est probablement pas modifiable à la création, mais conservé ici */}
                    <Input label='Nombre de votes :' reference='votesCount' type='number' placeholder='0' onChange={onFullVotesCountChange} value={votesCount} />
                    
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