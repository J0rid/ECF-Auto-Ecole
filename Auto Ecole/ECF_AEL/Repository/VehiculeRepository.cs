using Auto_Ecole.Outils;
using ECF_AEL.Models;
using Microsoft.Data.SqlClient;

namespace ECF_AEL.Repository
{
    public class VehiculeRepository : IVehiculeRepository
    {
        private readonly Connexion _connexion;

        public VehiculeRepository(Connexion connexion)
        {
            _connexion = connexion;
        }

        public List<VehiculeDetail> GetAllVehicules()
        {
            List<VehiculeDetail> vehicules = new List<VehiculeDetail>();
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                @"SELECT v.NoImmat, v.ModeleVehicule, m.Marque, m.Annee, m.DateAchat, v.Etat
                  FROM Vehicule v
                  INNER JOIN Modele m ON v.ModeleVehicule = m.ModeleVehicule
                  ORDER BY v.NoImmat", conn);

            SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
                vehicules.Add(MapDetail(reader));
            reader.Close();
            conn.Close();

            return vehicules;
        }

        public VehiculeDetail? GetVehiculeByImmat(string noImmat)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                @"SELECT v.NoImmat, v.ModeleVehicule, m.Marque, m.Annee, m.DateAchat, v.Etat
                  FROM Vehicule v
                  INNER JOIN Modele m ON v.ModeleVehicule = m.ModeleVehicule
                  WHERE v.NoImmat = @Immat", conn);
            cmd.Parameters.AddWithValue("@Immat", noImmat);

            SqlDataReader reader = cmd.ExecuteReader();
            VehiculeDetail? result = reader.Read() ? MapDetail(reader) : null;
            reader.Close();
            conn.Close();

            return result;
        }

        public void CreateVehicule(Vehicule vehicule)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                "INSERT INTO Vehicule (NoImmat, ModeleVehicule, Etat) VALUES (@Immat, @Modele, @Etat)", conn);
            cmd.Parameters.AddWithValue("@Immat", vehicule.NoImmat);
            cmd.Parameters.AddWithValue("@Modele", vehicule.ModeleVehicule);
            cmd.Parameters.AddWithValue("@Etat", vehicule.Etat);
            cmd.ExecuteNonQuery();
            conn.Close();
        }

        public void UpdateVehicule(Vehicule vehicule)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                "UPDATE Vehicule SET ModeleVehicule = @Modele WHERE NoImmat = @Immat", conn);
            cmd.Parameters.AddWithValue("@Modele", vehicule.ModeleVehicule);
            cmd.Parameters.AddWithValue("@Immat", vehicule.NoImmat);
            cmd.ExecuteNonQuery();
            conn.Close();
        }

        public void SetEtatVehicule(string noImmat, bool etat)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand("UPDATE Vehicule SET Etat = @Etat WHERE NoImmat = @Immat", conn);
            cmd.Parameters.AddWithValue("@Etat", etat);
            cmd.Parameters.AddWithValue("@Immat", noImmat);
            cmd.ExecuteNonQuery();
            conn.Close();
        }

        public void DeleteVehicule(string noImmat)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand("DELETE FROM Vehicule WHERE NoImmat = @Immat", conn);
            cmd.Parameters.AddWithValue("@Immat", noImmat);
            cmd.ExecuteNonQuery();
            conn.Close();
        }

        private static VehiculeDetail MapDetail(SqlDataReader reader)
        {
            return new VehiculeDetail
            {
                NoImmat = (string)reader["NoImmat"],
                ModeleVehicule = (string)reader["ModeleVehicule"],
                Marque = (string)reader["Marque"],
                Annee = ((string)reader["Annee"]).Trim(),
                DateAchat = DateOnly.FromDateTime((DateTime)reader["DateAchat"]),
                Etat = (bool)reader["Etat"]
            };
        }
    }
}
