import { useState } from "react";
import "./Create.css";
import { useNavigate } from "react-router";
import Input from "../../../../Components/Input/Input";
import { concourApi } from "../../../../api/concours/crud_concours";
import SideBar from "../../../../Components/Sidebar/sidebar";

export default function CreateConcour() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"BROUILLON" | "EN_COURS" | "TERMINE">("EN_COURS");
  const [pricePerVote, setPricePerVote] = useState<number | null>(null);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    status: "",
    pricePerVote: "",
    startAt: "",
    endAt: "",
    image: "",
  });

  const navigate = useNavigate();
  const goToBack = () => navigate(-1);

  // Gestion des changements simples
  const handleChange =
    (setter: Function, field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setErrors({ ...errors, [field]: "" });
    };

  // Gestion des nombres
  const handleNumberChange =
    (setter: Function, field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setter(value === "" ? null : Number(value));
      setErrors({ ...errors, [field]: "" });
    };

  // Gestion de l’image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, image: "Format non supporté. Utilisez JPG, PNG ou WEBP" });
      return;
    }

    if (file.size > maxSize) {
      setErrors({ ...errors, image: "Le fichier est trop volumineux (max 5MB)" });
      return;
    }

    setImage(file);
    setErrors({ ...errors, image: "" });

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors = {
      name: "",
      description: "",
      status: "",
      pricePerVote: "",
      startAt: "",
      endAt: "",
      image: "",
    };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Le nom est requis";
      isValid = false;
    }
    if (!description.trim()) {
      newErrors.description = "La description est requise";
      isValid = false;
    }
    if (!status) {
      newErrors.status = "Le statut est requis";
      isValid = false;
    }
    if (pricePerVote === null) {
      newErrors.pricePerVote = "Le prix par vote est requis";
      isValid = false;
    }
    if (!startAt.trim()) {
      newErrors.startAt = "La date de début est requise";
      isValid = false;
    }
    if (!endAt.trim()) {
      newErrors.endAt = "La date de fin est requise";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Réinitialisation du formulaire
  const resetForm = () => {
    setName("");
    setDescription("");
    setStatus("EN_COURS");
    setPricePerVote(null);
    setStartAt("");
    setEndAt("");
    setImage(null);
    setImagePreview("");
    setErrors({
      name: "",
      description: "",
      status: "",
      pricePerVote: "",
      startAt: "",
      endAt: "",
      image: "",
    });
  };

  // Soumission du formulaire
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) {
      setErrorMessage("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("status", status);
      formData.append("price_per_vote", pricePerVote?.toString() || "");
      formData.append("start_at", startAt);
      formData.append("end_at", endAt);
      if (image) formData.append("image", image);

      await concourApi.create(formData);

      setSuccessMessage("Concours créé avec succès !");
      setTimeout(() => {
        resetForm();
        navigate("/concours");
      }, 1500);
    } catch (error: any) {
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        const newErrors: any = { ...errors };
        Object.keys(serverErrors).forEach((key) => {
          if (newErrors.hasOwnProperty(key)) newErrors[key] = serverErrors[key][0];
        });
        setErrors(newErrors);
        setErrorMessage("Veuillez corriger les erreurs du formulaire");
      } else {
        setErrorMessage(error.response?.data?.message || "Erreur lors de la création du concours");
      }
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <div className="create-container">
            <SideBar />

      <div className="create-header">
        <button type="button" onClick={goToBack}>← Retour</button>
        <h1>Créer un concours</h1>
      </div>

      {successMessage && <div className="message success">{successMessage}</div>}
      {errorMessage && <div className="message error">{errorMessage}</div>}

      <form className="create-form" onSubmit={handleSubmit}>
        <Input
          label="Nom du concours *"
          reference="name"
          type="text"
          placeholder="Entrez le nom..."
          value={name}
          onChange={handleChange(setName, "name")}
        />
        {errors.name && <p className="input-error">{errors.name}</p>}

        <Input
          label="Description *"
          reference="description"
          type="text"
          placeholder="Entrez la description..."
          value={description}
          onChange={handleChange(setDescription, "description")}
        />
        {errors.description && <p className="input-error">{errors.description}</p>}

        <label htmlFor="status">Statut *</label>
        <select id="status" value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="BROUILLON">Brouillon</option>
          <option value="EN_COURS">En cours</option>
          <option value="TERMINE">Terminé</option>
        </select>
        {errors.status && <p className="input-error">{errors.status}</p>}

        <Input
          label="Prix par vote (FCFA) *"
          reference="price_per_vote"
          type="number"
          placeholder="Ex: 200"
          value={pricePerVote?.toString() || ""}
          onChange={handleNumberChange(setPricePerVote, "pricePerVote")}
        />
        {errors.pricePerVote && <p className="input-error">{errors.pricePerVote}</p>}

        <div className="grid-2">
          <div>
            <label htmlFor="startAt">Date de début *</label>
            <input
              type="date"
              id="startAt"
              value={startAt}
              onChange={handleChange(setStartAt, "startAt")}
            />
            {errors.startAt && <p className="input-error">{errors.startAt}</p>}
          </div>

          <div>
            <label htmlFor="endAt">Date de fin *</label>
            <input
              type="date"
              id="endAt"
              value={endAt}
              onChange={handleChange(setEndAt, "endAt")}
            />
            {errors.endAt && <p className="input-error">{errors.endAt}</p>}
          </div>
        </div>

        <label htmlFor="image">Image du concours *</label>
        <input id="image" type="file" accept="image/*" onChange={handleImageChange} />
        {errors.image && <p className="input-error">{errors.image}</p>}

        {imagePreview && (
          <div className="image-preview">
            <p>Aperçu :</p>
            <img src={imagePreview} alt="Aperçu" />
          </div>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Création en cours..." : "Créer le concours"}
        </button>
      </form>
    </div>
  );
}
