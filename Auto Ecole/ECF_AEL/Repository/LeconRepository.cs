using Auto_Ecole.Outils;
using ECF_AEL.Models;
using Microsoft.Data.SqlClient;

namespace ECF_AEL.Repository
{
    public class LeconRepository : ILeconRepository
    {
        private readonly Connexion _connexion;

        public LeconRepository(Connexion connexion)
        {
            _connexion = connexion;
        }

        public List<LeconDetail> GetAllLecons()
        {
            List<LeconDetail> lecons = new List<LeconDetail>();
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                @"SELECT l.ModeleLecon, l.DateHLecon, l.EleveId, e.NomEleve, e.PrenomEleve,
                         l.MoniteurId, m.NomMoniteur, m.PrenomMoniteur, l.Duree
                  FROM Lecon l
                  INNER JOIN Eleve e ON l.EleveId = e.IdEleve
                  INNER JOIN Moniteur m ON l.MoniteurId = m.IdMoniteur
                  ORDER BY l.DateHLecon", conn);

            SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
                lecons.Add(MapDetail(reader));
            reader.Close();
            conn.Close();

            return lecons;
        }

        public List<LeconDetail> GetLeconsByEleve(int eleveId)
        {
            List<LeconDetail> lecons = new List<LeconDetail>();
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                @"SELECT l.ModeleLecon, l.DateHLecon, l.EleveId, e.NomEleve, e.PrenomEleve,
                         l.MoniteurId, m.NomMoniteur, m.PrenomMoniteur, l.Duree
                  FROM Lecon l
                  INNER JOIN Eleve e ON l.EleveId = e.IdEleve
                  INNER JOIN Moniteur m ON l.MoniteurId = m.IdMoniteur
                  WHERE l.EleveId = @EleveId
                  ORDER BY l.DateHLecon", conn);
            cmd.Parameters.AddWithValue("@EleveId", eleveId);

            SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
                lecons.Add(MapDetail(reader));
            reader.Close();
            conn.Close();

            return lecons;
        }

        public void CreateLecon(Lecon lecon)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                @"INSERT INTO Lecon (ModeleLecon, DateHLecon, EleveId, MoniteurId, Duree)
                  VALUES (@Modele, @DateH, @EleveId, @MoniteurId, @Duree)", conn);
            cmd.Parameters.AddWithValue("@Modele", lecon.ModeleLecon);
            cmd.Parameters.AddWithValue("@DateH", lecon.DateHLecon);
            cmd.Parameters.AddWithValue("@EleveId", lecon.EleveId);
            cmd.Parameters.AddWithValue("@MoniteurId", lecon.MoniteurId);
            cmd.Parameters.AddWithValue("@Duree", lecon.Duree);
            cmd.ExecuteNonQuery();
            conn.Close();
        }

        public bool DeleteLecon(string modeleLecon, DateTime dateHLecon, int eleveId, int moniteurId)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                @"DELETE FROM Lecon
                  WHERE ModeleLecon = @Modele AND DateHLecon = @DateH
                    AND EleveId = @EleveId AND MoniteurId = @MoniteurId", conn);
            cmd.Parameters.AddWithValue("@Modele", modeleLecon);
            cmd.Parameters.AddWithValue("@DateH", dateHLecon);
            cmd.Parameters.AddWithValue("@EleveId", eleveId);
            cmd.Parameters.AddWithValue("@MoniteurId", moniteurId);
            int nbLignes = cmd.ExecuteNonQuery();
            conn.Close();
            return nbLignes > 0;
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

        public bool MoniteurEstActif(int moniteurId)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM Moniteur WHERE IdMoniteur = @Id AND Activite = 1", conn);
            cmd.Parameters.AddWithValue("@Id", moniteurId);
            int count = (int)cmd.ExecuteScalar()!;
            conn.Close();
            return count > 0;
        }

        public bool MoniteurEstDisponible(int moniteurId, DateTime dateHeure)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                "SELECT COUNT(*) FROM Lecon WHERE MoniteurId = @Id AND DateHLecon = @DateH", conn);
            cmd.Parameters.AddWithValue("@Id", moniteurId);
            cmd.Parameters.AddWithValue("@DateH", dateHeure);
            int count = (int)cmd.ExecuteScalar()!;
            conn.Close();
            return count == 0;
        }

        public bool EleveEstDisponible(int eleveId, DateTime dateHeure)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                "SELECT COUNT(*) FROM Lecon WHERE EleveId = @Id AND DateHLecon = @DateH", conn);
            cmd.Parameters.AddWithValue("@Id", eleveId);
            cmd.Parameters.AddWithValue("@DateH", dateHeure);
            int count = (int)cmd.ExecuteScalar()!;
            conn.Close();
            return count == 0;
        }

        public bool VehiculeEstDisponible(string modeleLecon, DateTime dateHeure)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();

            SqlCommand cmdVehicules = new SqlCommand(
                "SELECT COUNT(*) FROM Vehicule WHERE ModeleVehicule = @Modele AND Etat = 1", conn);
            cmdVehicules.Parameters.AddWithValue("@Modele", modeleLecon);
            int nbVehicules = (int)cmdVehicules.ExecuteScalar()!;

            SqlCommand cmdLecons = new SqlCommand(
                "SELECT COUNT(*) FROM Lecon WHERE ModeleLecon = @Modele AND DateHLecon = @DateH", conn);
            cmdLecons.Parameters.AddWithValue("@Modele", modeleLecon);
            cmdLecons.Parameters.AddWithValue("@DateH", dateHeure);
            int nbLecons = (int)cmdLecons.ExecuteScalar()!;

            conn.Close();
            return nbLecons < nbVehicules;
        }

        private static LeconDetail MapDetail(SqlDataReader reader)
        {
            return new LeconDetail
            {
                ModeleLecon = (string)reader["ModeleLecon"],
                DateHLecon = (DateTime)reader["DateHLecon"],
                EleveId = (int)reader["EleveId"],
                NomEleve = (string)reader["NomEleve"],
                PrenomEleve = (string)reader["PrenomEleve"],
                MoniteurId = (int)reader["MoniteurId"],
                NomMoniteur = (string)reader["NomMoniteur"],
                PrenomMoniteur = (string)reader["PrenomMoniteur"],
                Duree = (int)reader["Duree"]
            };
        }
    }
}
