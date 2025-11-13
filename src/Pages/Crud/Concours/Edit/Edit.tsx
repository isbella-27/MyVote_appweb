import { useEffect, useState } from "react";
import "./Edit.css";
import { useNavigate, useParams } from "react-router";
import Input from "../../../../Components/Input/Input";
import { concourApi } from "../../../../api/concours/crud_concours";
import type { Concour } from "../../../../data/models/concour.model";

export default function EditConcour() {
  const { id } = useParams();
  const navigate = useNavigate();
  const goToBack = () => navigate(-1);

  const [concour, setConcour] = useState<Concour | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"BROUILLON" | "EN_COURS" | "TERMINE">("BROUILLON");
  const [pricePerVote, setPricePerVote] = useState<number | null>(null);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [image, setImage] = useState<File | string>("");
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

  useEffect(() => {
    const fetchConcour = async () => {
      try {
        const data = await concourApi.getById(Number(id));
        setConcour(data);

        setName(data.name || "");
        setDescription(data.description || "");
        setStatus((data.status as any) || "BROUILLON");
        setPricePerVote(data.price_per_vote || null);
        setStartAt(data.start_at ? data.start_at.split("T")[0] : "");
        setEndAt(data.end_at ? data.end_at.split("T")[0] : "");
        if (data.image) {
          const url = `${import.meta.env.VITE_STORAGE_URL}${data.image}`;
          setImagePreview(url);
          setImage(data.image);
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("Impossible de charger les informations du concours.");
      }
    };

    if (id) fetchConcour();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, image: "Format non supporté" });
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

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

    if (!name.trim()) { newErrors.name = "Le nom est requis"; isValid = false; }
    if (!description.trim()) { newErrors.description = "La description est requise"; isValid = false; }
    if (!status) { newErrors.status = "Le statut est requis"; isValid = false; }
    if (pricePerVote === null) { newErrors.pricePerVote = "Le prix par vote est requis"; isValid = false; }
    if (!startAt.trim()) { newErrors.startAt = "Date de début requise"; isValid = false; }
    if (!endAt.trim()) { newErrors.endAt = "Date de fin requise"; isValid = false; }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

      // N'envoyer l'image que si un nouveau fichier a été sélectionné
      if (image instanceof File) {
        formData.append("image", image);
      }

      await concourApi.update(Number(id), formData);

      setSuccessMessage("Concours mis à jour avec succès !");
      setTimeout(() => navigate("/concours"), 2000);
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        const newErrors: any = { ...errors };
        Object.keys(serverErrors).forEach((key) => {
          if (newErrors.hasOwnProperty(key)) newErrors[key] = serverErrors[key][0];
        });
        setErrors(newErrors);
        setErrorMessage("Veuillez corriger les erreurs");
      } else {
        setErrorMessage(error.response?.data?.message || "Erreur lors de la mise à jour");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!concour) return <p className="loading">Chargement...</p>;

  return (
    <div className="edit-container">
      <div className="edit-header">
        <button type="button" onClick={goToBack}>← Retour</button>
        <h1>Modifier le concours</h1>
      </div>

      {successMessage && <div className="message success">{successMessage}</div>}
      {errorMessage && <div className="message error">{errorMessage}</div>}

      <form className="edit-form" onSubmit={handleSubmit}>
        <Input label="Nom du concours *" reference="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        {errors.name && <p className="input-error">{errors.name}</p>}

        <Input label="Description *" reference="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        {errors.description && <p className="input-error">{errors.description}</p>}

        <label htmlFor="status">Statut *</label>
        <select id="status" value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="BROUILLON">Brouillon</option>
          <option value="EN_COURS">En cours</option>
          <option value="TERMINE">Terminé</option>
        </select>
        {errors.status && <p className="input-error">{errors.status}</p>}

        <Input label="Prix par vote (FCFA) *" reference="price_per_vote" type="number" value={pricePerVote?.toString() || ""} onChange={(e) => setPricePerVote(Number(e.target.value))} />
        {errors.pricePerVote && <p className="input-error">{errors.pricePerVote}</p>}

        <div className="grid-2">
          <div>
            <label htmlFor="startAt">Date de début *</label>
            <input type="date" id="startAt" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
            {errors.startAt && <p className="input-error">{errors.startAt}</p>}
          </div>
          <div>
            <label htmlFor="endAt">Date de fin *</label>
            <input type="date" id="endAt" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
            {errors.endAt && <p className="input-error">{errors.endAt}</p>}
          </div>
        </div>

        <label htmlFor="image">Image du concours</label>
        <input id="image" type="file" accept="image/*" onChange={handleImageChange} />
        {errors.image && <p className="input-error">{errors.image}</p>}

        {imagePreview && (
          <div className="image-preview">
            <p>Aperçu :</p>
            <img src={imagePreview} alt="Aperçu de l'image" />
          </div>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Mise à jour..." : "Mettre à jour"}
        </button>
      </form>
    </div>
  );
}