using Auto_Ecole.Outils;
using ECF_AEL.Models;
using Microsoft.Data.SqlClient;

namespace ECF_AEL.Repository
{
    public class EleveRepository : IEleveRepository
    {
        private readonly Connexion _connexion;

        public EleveRepository(Connexion connexion)
        {
            _connexion = connexion;
        }

        public List<Eleve> GetAllEleves()
        {
            List<Eleve> eleves = new List<Eleve>();

            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                "SELECT IdEleve, NomEleve, PrenomEleve, Code, Conduite, DateNaissance, DateInscription FROM Eleve ORDER BY NomEleve, PrenomEleve", conn);

            SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
                eleves.Add(MapEleve(reader));
            reader.Close();
            conn.Close();

            return eleves;
        }

        public Eleve? GetEleveById(int id)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                "SELECT IdEleve, NomEleve, PrenomEleve, Code, Conduite, DateNaissance, DateInscription FROM Eleve WHERE IdEleve = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);

            SqlDataReader reader = cmd.ExecuteReader();
            Eleve? result = reader.Read() ? MapEleve(reader) : null;
            reader.Close();
            conn.Close();

            return result;
        }

        public void CreateEleve(Eleve eleve)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                @"INSERT INTO Eleve (NomEleve, PrenomEleve, Code, Conduite, DateNaissance, DateInscription)
                  VALUES (@Nom, @Prenom, @Code, @Conduite, @DateNaissance, @DateInscription)", conn);

            cmd.Parameters.AddWithValue("@Nom", eleve.NomEleve);
            cmd.Parameters.AddWithValue("@Prenom", eleve.PrenomEleve);
            cmd.Parameters.AddWithValue("@Code", eleve.Code);
            cmd.Parameters.AddWithValue("@Conduite", eleve.Conduite);
            cmd.Parameters.AddWithValue("@DateNaissance", eleve.DateNaissance.ToDateTime(TimeOnly.MinValue));
            cmd.Parameters.AddWithValue("@DateInscription", eleve.DateInscription.ToDateTime(TimeOnly.MinValue));
            cmd.ExecuteNonQuery();
            conn.Close();
        }

        public void UpdateEleve(Eleve eleve)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                @"UPDATE Eleve SET NomEleve = @Nom, PrenomEleve = @Prenom, Code = @Code,
                  Conduite = @Conduite, DateNaissance = @DateNaissance
                  WHERE IdEleve = @Id", conn);

            cmd.Parameters.AddWithValue("@Nom", eleve.NomEleve);
            cmd.Parameters.AddWithValue("@Prenom", eleve.PrenomEleve);
            cmd.Parameters.AddWithValue("@Code", eleve.Code);
            cmd.Parameters.AddWithValue("@Conduite", eleve.Conduite);
            cmd.Parameters.AddWithValue("@DateNaissance", eleve.DateNaissance.ToDateTime(TimeOnly.MinValue));
            cmd.Parameters.AddWithValue("@Id", eleve.IdEleve);
            cmd.ExecuteNonQuery();
            conn.Close();
        }

        public void SetCodeEleve(int id, bool value)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand("UPDATE Eleve SET Code = @Value WHERE IdEleve = @Id", conn);
            cmd.Parameters.AddWithValue("@Value", value);
            cmd.Parameters.AddWithValue("@Id", id);
            cmd.ExecuteNonQuery();
            conn.Close();
        }

        public void SetConduiteEleve(int id, bool value)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand("UPDATE Eleve SET Conduite = @Value WHERE IdEleve = @Id", conn);
            cmd.Parameters.AddWithValue("@Value", value);
            cmd.Parameters.AddWithValue("@Id", id);
            cmd.ExecuteNonQuery();
            conn.Close();
        }

        public void DeleteEleve(int id)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlTransaction transaction = conn.BeginTransaction();

            SqlCommand cmdLecon = new SqlCommand("DELETE FROM Lecon WHERE EleveId = @Id", conn, transaction);
            cmdLecon.Parameters.AddWithValue("@Id", id);
            cmdLecon.ExecuteNonQuery();

            SqlCommand cmdEpreuve = new SqlCommand("DELETE FROM Epreuve WHERE EleveIdEpreuve = @Id", conn, transaction);
            cmdEpreuve.Parameters.AddWithValue("@Id", id);
            cmdEpreuve.ExecuteNonQuery();

            SqlCommand cmdEleve = new SqlCommand("DELETE FROM Eleve WHERE IdEleve = @Id", conn, transaction);
            cmdEleve.Parameters.AddWithValue("@Id", id);
            cmdEleve.ExecuteNonQuery();

            transaction.Commit();
            conn.Close();
        }

        private static Eleve MapEleve(SqlDataReader reader)
        {
            return new Eleve
            {
                IdEleve = (int)reader["IdEleve"],
                NomEleve = (string)reader["NomEleve"],
                PrenomEleve = (string)reader["PrenomEleve"],
                Code = (bool)reader["Code"],
                Conduite = (bool)reader["Conduite"],
                DateNaissance = DateOnly.FromDateTime((DateTime)reader["DateNaissance"]),
                DateInscription = DateOnly.FromDateTime((DateTime)reader["DateInscription"])
            };
        }
    }
}
