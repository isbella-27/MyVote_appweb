
import { Link } from "react-router";
import Input from "../../../Components/Input/Input";
import { useState } from "react";
import { z } from 'zod';
import { useNavigate } from "react-router";
import './Register.css'
import Button from "../../../Components/Button/Button";



const signupSchema = z.object({
    name: z.string().min(2, 'Nom trop court'),
    email: z.email('Email invalide'),
    password: z.string().min(6, 'Mot de passe trop court'),
});


export default function Register() {
    const navigate = useNavigate();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = signupSchema.safeParse({ name, email, password });
        if (!result.success) {
            alert("Données invalides");
            console.log(result.error.format());
            return;
        }
        localStorage.setItem("username", name);
        navigate("/Profil");
    };

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onFullNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }
    const onFullEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }
    const onFullPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }
    return (
        <div className="app-container">
            <div className="header-area">

                <h1>VOTINGAPP</h1>
                <p className="subtitle"> Welcome, please fill in your login informations</p>
            </div>
            <div className="main-content">
                <div className='login-card'>
                    <form onSubmit={onSubmit}>
                        <div className="form-group">

                            <Input label='Nom complet' reference='prénoms' type='text' placeholder='Entrez votre nom complet' onChange={onFullNameChange} value={name} />
                        </div>
                        <div className="form-group">

                            <Input label='Email' reference='email' type='email' placeholder='Entrez votre email' onChange={onFullEmailChange} value={email} />
                        </div>
                        <div className="form-group">

                            <Input label='Mot de passe' reference='password' type='password' placeholder='Entrez votre mot de passe' onChange={onFullPasswordChange} value={password} />
                        </div>
                    </form>
                </div>
                <Button className='connexion-button' label="S'inscrire" type='submit' />
                <div className="text-center">
                    <p>Déjà membre ? <Link to="/">Se connecter</Link></p>
                </div>

            </div>

        </div>
    )
}
