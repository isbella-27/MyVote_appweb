import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router'; 
import { candidatApi } from '../../../api/candidates/crud';
import './Edit.css'
import Input from '../../../Components/Input/Input'; 
import Button from '../../../Components/Button/Button'; 
import SideBar from '../../../Components/Sidebar/Sidebar';



export default function Edit() {
    const navigate = useNavigate();
    const params = useParams();

    const [isLoading, setIsLoading] = useState<boolean>(true); 
    const [successMessage, setSuccessMessage] = useState<string>('');

    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [nationality, setNationality] = useState("");
    const [fullDescription, setFullDescription] = useState("");
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [voteCount, setVoteCount] = useState(""); 
    const [concourId, setConcourId] = useState(""); 


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
            if (params.id) {
                try {
                    const candidateId = parseInt(params.id || "0", 10);
                    if (candidateId === 0) return; 

                    const data = await candidatApi.read(candidateId);

                    // Initialisation avec les données du candidat
                    setFirstName(data.firstName || "");
                    setLastName(data.lastName || "");
                    setNationality(data.nationality || "");
                    setFullDescription(data.fullDescription || "");
                    setVoteCount(data.voteCount ? String(data.voteCount) : "");
                    setConcourId(data.concourId ? String(data.concourId) : "")
                    

                } catch (error) {
                    console.error("Erreur de chargement :", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchCandidate();
    }, [params.id]); 


    // --- Soumission du formulaire (EDIT) ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            setSuccessMessage('');

            const formData = new FormData();
            
            const candidateId = parseInt(params.id || "0", 10);
            if (candidateId === 0) {
                console.error("Erreur: ID du candidat manquant.");
                return;
            }

            formData.set("lastName", lastName);
            formData.set("firstName", firstName);
            formData.set("nationality", nationality);
            formData.set("fullDescription", fullDescription);
            formData.set("voteCount", voteCount);
            
            
            // Si l'API utilise PUT/PATCH via FormData, ceci est nécessaire
            formData.set("_method", "PUT"); 

            if (profilePhoto) {
                formData.append("profilePhoto", profilePhoto);
            }
            // Si concourId est requis
            if (concourId) {
                formData.set("concourId", String(concourId));
            }

            await candidatApi.update(candidateId, formData);
            setSuccessMessage('Candidat mis à jour avec succès !');

        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
            setSuccessMessage("Erreur lors de la mise à jour du candidat.");
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='create'>
            {<SideBar />}
            <h1>
                Modifier le candidat ID: {params.id}
            </h1>
            <Link to={`/candidates/List`} className="back-button">← Retour à la liste</Link>
            
            <div className='Container'>
                {isLoading && <p>Chargement des données...</p>}
                
                {/* On n'affiche le formulaire que si le chargement initial est terminé */}
                {!isLoading && (
                    <form onSubmit={handleSubmit}>
                        {successMessage && <p style={{ color: successMessage.includes('Erreur') ? 'red' : 'green' }}>{successMessage}</p>}
                        
                        {/* Champ caché ConcourId (si nécessaire) */}
                        {concourId && (
                           <Input
                                reference='concourId'
                                type='hidden'
                                value={concourId}
                                onChange={() => { }}
                            />
                        )}
                        
                        {/* Nom et Prénom */}
                        <Input label='Prénom :' reference='firstName' type='text' placeholder='Entrez le prénom du candidat' onChange={OnFirstNameChange} value={firstName} />
                        <Input label='Nom de famille :' reference='lastName' type='text' placeholder='Entrez le nom du candidat' onChange={OnLastNameChange} value={lastName} />
                        
                        {/* Nationalité */}
                        <Input label='Nationalité :' reference='nationality' type='text' placeholder='Précisez la nationalité du candidat' onChange={OnNationalityChange} value={nationality} />                        
                        
                        <label htmlFor="fullDescription">Description complète :</label>
                        <textarea 
                            id="fullDescription"
                            name='fullDescription' 
                            placeholder='Donnez une description complète du candidat' 
                            onChange={OnFullDescriptionChange} 
                            value={fullDescription} 
                            style={{ width: '100%', minHeight: '100px', padding: '10px' }} 
                        />

                        {/* Fichier et Votes */}
                        <Input
                            label='Photo de profil :'
                            reference='profilePhoto'
                            type='file'
                            onChange={onFullProfilePhotoChange}
                        />
                        
                        <Input label='Nombre de votes :' reference='voteCount' type='number' placeholder='0' onChange={onFullVoteCountChange} value={voteCount} />
                        
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
    );
}