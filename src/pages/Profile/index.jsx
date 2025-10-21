import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import api from "../../config";
import "./style.css";
import Header from "../../components/Header";

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("/default-profile.png");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setLogin(user.login || "");
      setPreview(user.imageURL || "/default-profile.png");
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) return alert("Usuário não carregado corretamente.");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("login", login);
      if (password.trim() !== "") formData.append("password", password);
      if (image) formData.append("image", image);

      const { data } = await api.patch(`/user/${user._id}`, formData);

      setUser(data); // atualiza o Context, Header muda automaticamente
      setPassword("");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Carregando...</p>;

  return (
    <>
      <Header />
      <div className="container-page">
        <h2 className="title-edit">Editar Perfil</h2>

        <form className="profile-form" onSubmit={handleSubmit}>
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

          <div className="input-group">
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="login">Login</label>
            <input
              id="login"
              name="login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Nova senha</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Deixe em branco para manter a atual"
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
