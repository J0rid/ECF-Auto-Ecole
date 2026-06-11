using Auto_Ecole.Outils;
using ECF_AEL.Models;
using Microsoft.Data.SqlClient;

namespace ECF_AEL.Repository
{
    public class MoniteurRepository : IMoniteurRepository
    {
        private readonly Connexion _connexion;

        public MoniteurRepository(Connexion connexion)
        {
            _connexion = connexion;
        }

        public List<Moniteur> GetAllMoniteurs()
        {
            List<Moniteur> moniteurs = new List<Moniteur>();
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                "SELECT IdMoniteur, NomMoniteur, PrenomMoniteur, DateNaissance, DateEmbauche, Activite FROM Moniteur ORDER BY NomMoniteur, PrenomMoniteur", conn);

            SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
                moniteurs.Add(MapMoniteur(reader));
            reader.Close();
            conn.Close();

            return moniteurs;
        }

        public Moniteur? GetMoniteurById(int id)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                "SELECT IdMoniteur, NomMoniteur, PrenomMoniteur, DateNaissance, DateEmbauche, Activite FROM Moniteur WHERE IdMoniteur = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);

            SqlDataReader reader = cmd.ExecuteReader();
            Moniteur? result = reader.Read() ? MapMoniteur(reader) : null;
            reader.Close();
            conn.Close();

            return result;
        }

        public void CreateMoniteur(Moniteur moniteur)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                @"INSERT INTO Moniteur (NomMoniteur, PrenomMoniteur, DateNaissance, DateEmbauche, Activite)
                  VALUES (@Nom, @Prenom, @DateNaissance, @DateEmbauche, @Activite)", conn);
            cmd.Parameters.AddWithValue("@Nom", moniteur.NomMoniteur);
            cmd.Parameters.AddWithValue("@Prenom", moniteur.PrenomMoniteur);
            cmd.Parameters.AddWithValue("@DateNaissance", moniteur.DateNaissance.ToDateTime(TimeOnly.MinValue));
            cmd.Parameters.AddWithValue("@DateEmbauche", moniteur.DateEmbauche.ToDateTime(TimeOnly.MinValue));
            cmd.Parameters.AddWithValue("@Activite", moniteur.Activite);
            cmd.ExecuteNonQuery();
            conn.Close();
        }

        public void UpdateMoniteur(Moniteur moniteur)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                @"UPDATE Moniteur SET NomMoniteur = @Nom, PrenomMoniteur = @Prenom,
                  DateNaissance = @DateNaissance, DateEmbauche = @DateEmbauche
                  WHERE IdMoniteur = @Id", conn);
            cmd.Parameters.AddWithValue("@Nom", moniteur.NomMoniteur);
            cmd.Parameters.AddWithValue("@Prenom", moniteur.PrenomMoniteur);
            cmd.Parameters.AddWithValue("@DateNaissance", moniteur.DateNaissance.ToDateTime(TimeOnly.MinValue));
            cmd.Parameters.AddWithValue("@DateEmbauche", moniteur.DateEmbauche.ToDateTime(TimeOnly.MinValue));
            cmd.Parameters.AddWithValue("@Id", moniteur.IdMoniteur);
            cmd.ExecuteNonQuery();
            conn.Close();
        }

        public void SetActiviteMoniteur(int id, bool activite)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand("UPDATE Moniteur SET Activite = @Activite WHERE IdMoniteur = @Id", conn);
            cmd.Parameters.AddWithValue("@Activite", activite);
            cmd.Parameters.AddWithValue("@Id", id);
            cmd.ExecuteNonQuery();
            conn.Close();
        }

        public void DeleteMoniteur(int id)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand("DELETE FROM Moniteur WHERE IdMoniteur = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);
            cmd.ExecuteNonQuery();
            conn.Close();
        }

        private static Moniteur MapMoniteur(SqlDataReader reader)
        {
            return new Moniteur
            {
                IdMoniteur = (int)reader["IdMoniteur"],
                NomMoniteur = (string)reader["NomMoniteur"],
                PrenomMoniteur = (string)reader["PrenomMoniteur"],
                DateNaissance = DateOnly.FromDateTime((DateTime)reader["DateNaissance"]),
                DateEmbauche = DateOnly.FromDateTime((DateTime)reader["DateEmbauche"]),
                Activite = (bool)reader["Activite"]
            };
        }
    }
}
