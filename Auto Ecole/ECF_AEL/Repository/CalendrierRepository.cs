using Auto_Ecole.Outils;
using ECF_AEL.Models;
using Microsoft.Data.SqlClient;

namespace ECF_AEL.Repository
{
    public class CalendrierRepository : ICalendrierRepository
    {
        private readonly Connexion _connexion;

        public CalendrierRepository(Connexion connexion)
        {
            _connexion = connexion;
        }

        public List<Calendrier> GetAllCreneaux()
        {
            List<Calendrier> creneaux = new List<Calendrier>();
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand("SELECT DateHeure FROM Calendrier ORDER BY DateHeure", conn);

            SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
                creneaux.Add(new Calendrier { DateHeure = (DateTime)reader["DateHeure"] });
            reader.Close();
            conn.Close();

            return creneaux;
        }

        public bool CreneauExiste(DateTime dateHeure)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM Calendrier WHERE DateHeure = @DateH", conn);
            cmd.Parameters.AddWithValue("@DateH", dateHeure);
            int count = (int)cmd.ExecuteScalar()!;
            conn.Close();
            return count > 0;
        }

        public bool CreneauADesLecons(DateTime dateHeure)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM Lecon WHERE DateHLecon = @DateH", conn);
            cmd.Parameters.AddWithValue("@DateH", dateHeure);
            int count = (int)cmd.ExecuteScalar()!;
            conn.Close();
            return count > 0;
        }

        public void CreateCreneau(DateTime dateHeure)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand("INSERT INTO Calendrier (DateHeure) VALUES (@DateH)", conn);
            cmd.Parameters.AddWithValue("@DateH", dateHeure);
            cmd.ExecuteNonQuery();
            conn.Close();
        }

        public void DeleteCreneau(DateTime dateHeure)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand("DELETE FROM Calendrier WHERE DateHeure = @DateH", conn);
            cmd.Parameters.AddWithValue("@DateH", dateHeure);
            cmd.ExecuteNonQuery();
            conn.Close();
        }
    }
}
