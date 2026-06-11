using Auto_Ecole.Outils;
using ECF_AEL.Models;
using Microsoft.Data.SqlClient;

namespace ECF_AEL.Repository
{
    public class ModeleRepository : IModeleRepository
    {
        private readonly Connexion _connexion;

        public ModeleRepository(Connexion connexion)
        {
            _connexion = connexion;
        }

        public List<Modele> GetAllModeles()
        {
            List<Modele> modeles = new List<Modele>();
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                "SELECT ModeleVehicule, Marque, Annee, DateAchat FROM Modele ORDER BY Marque, ModeleVehicule", conn);

            SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
                modeles.Add(MapModele(reader));
            reader.Close();
            conn.Close();

            return modeles;
        }

        public Modele? GetModeleByNom(string modeleVehicule)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                "SELECT ModeleVehicule, Marque, Annee, DateAchat FROM Modele WHERE ModeleVehicule = @Modele", conn);
            cmd.Parameters.AddWithValue("@Modele", modeleVehicule);

            SqlDataReader reader = cmd.ExecuteReader();
            Modele? result = reader.Read() ? MapModele(reader) : null;
            reader.Close();
            conn.Close();

            return result;
        }

        public void CreateModele(Modele modele)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                "INSERT INTO Modele (ModeleVehicule, Marque, Annee, DateAchat) VALUES (@Modele, @Marque, @Annee, @DateAchat)", conn);
            cmd.Parameters.AddWithValue("@Modele", modele.ModeleVehicule);
            cmd.Parameters.AddWithValue("@Marque", modele.Marque);
            cmd.Parameters.AddWithValue("@Annee", modele.Annee);
            cmd.Parameters.AddWithValue("@DateAchat", modele.DateAchat.ToDateTime(TimeOnly.MinValue));
            cmd.ExecuteNonQuery();
            conn.Close();
        }

        public void DeleteModele(string modeleVehicule)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand("DELETE FROM Modele WHERE ModeleVehicule = @Modele", conn);
            cmd.Parameters.AddWithValue("@Modele", modeleVehicule);
            cmd.ExecuteNonQuery();
            conn.Close();
        }

        private static Modele MapModele(SqlDataReader reader)
        {
            return new Modele
            {
                ModeleVehicule = (string)reader["ModeleVehicule"],
                Marque = (string)reader["Marque"],
                Annee = ((string)reader["Annee"]).Trim(),
                DateAchat = DateOnly.FromDateTime((DateTime)reader["DateAchat"])
            };
        }
    }
}
