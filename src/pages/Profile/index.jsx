import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import api from "../../config";
import Header from "../../components/Header";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropImage";
import "./style.css";

const Profile = () => {
  const { user, setUser } = useContext(UserContext);

  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const [preview, setPreview] = useState("/default-profile.png");

  // 🔥 crop states
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setLogin(user.login || "");
      setPreview(user.imageURL || "/default-profile.png");
    }
  }, [user]);

  // 📸 escolher imagem (reabre mesmo se for a mesma)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(null); // força reset
      setTimeout(() => {
        setImageSrc(reader.result);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
      }, 10);
    };
    reader.readAsDataURL(file);

    // 🔥 essencial para permitir selecionar a mesma imagem
    e.target.value = "";
  };

  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  // ✅ confirmar corte
  const handleCropConfirm = async () => {
    try {
      const cropped = await getCroppedImg(imageSrc, croppedArea);
      setCroppedImage(cropped);
      setPreview(URL.createObjectURL(cropped));
      setImageSrc(null);
    } catch (err) {
      console.error("Erro ao cortar imagem:", err);
    }
  };

  // ❌ cancelar corte
  const handleCropCancel = () => {
    setImageSrc(null);
  };

  // 💾 salvar perfil
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) return alert("Usuário não carregado.");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("login", login);

      if (password.trim()) {
        formData.append("password", password);
      }

      if (croppedImage) {
        formData.append("image", croppedImage);
      }

      const { data } = await api.patch(`/user/${user._id}`, formData);

      setUser(data);
      setPassword("");
      setCroppedImage(null);
      setPreview(data.imageURL || preview);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="container-page">
        <h2 className="title-edit">Editar Perfil</h2>

        <form className="profile-form" onSubmit={handleSubmit}>
          {/* FOTO */}
          <div className="profile-photo">
            <label htmlFor="fileInput">
              <img src={preview} alt="Foto de perfil" className="profile-img" />
            </label>

            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
            <p>Escolher foto</p>
          </div>

          {/* 🔥 MODAL DE CORTE */}
          {imageSrc && (
            <div className="crop-overlay">
              <div className="crop-box">
                <div className="crop-area">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    minZoom={1}
                    maxZoom={3}
                    zoomSpeed={0.2}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>

                {/* CONTROLE DE ZOOM */}
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="zoom-range"
                />

                <div className="crop-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={handleCropCancel}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    className="btn-confirm"
                    onClick={handleCropConfirm}
                  >
                    Confirmar corte
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* INPUTS */}
          <div className="input-group">
            <label>Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Login</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Nova senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Deixe em branco para manter"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Profile;
