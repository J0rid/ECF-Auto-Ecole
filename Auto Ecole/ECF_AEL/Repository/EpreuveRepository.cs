using Auto_Ecole.Outils;
using ECF_AEL.Models;
using Microsoft.Data.SqlClient;

namespace ECF_AEL.Repository
{
    public class EpreuveRepository : IEpreuveRepository
    {
        private readonly Connexion _connexion;

        public EpreuveRepository(Connexion connexion)
        {
            _connexion = connexion;
        }

        public List<EpreuveDetail> GetAllEpreuves()
        {
            List<EpreuveDetail> epreuves = new List<EpreuveDetail>();
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                @"SELECT ep.IdEpreuve, ep.EleveIdEpreuve, e.NomEleve, e.PrenomEleve,
                         ep.TypeEpreuve, ep.DateEpreuve, ep.Resultat
                  FROM Epreuve ep
                  INNER JOIN Eleve e ON ep.EleveIdEpreuve = e.IdEleve
                  ORDER BY ep.DateEpreuve DESC", conn);

            SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
                epreuves.Add(MapDetail(reader));
            reader.Close();
            conn.Close();

            return epreuves;
        }

        public List<EpreuveDetail> GetEpreuvesByEleve(int eleveId)
        {
            List<EpreuveDetail> epreuves = new List<EpreuveDetail>();
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                @"SELECT ep.IdEpreuve, ep.EleveIdEpreuve, e.NomEleve, e.PrenomEleve,
                         ep.TypeEpreuve, ep.DateEpreuve, ep.Resultat
                  FROM Epreuve ep
                  INNER JOIN Eleve e ON ep.EleveIdEpreuve = e.IdEleve
                  WHERE ep.EleveIdEpreuve = @EleveId
                  ORDER BY ep.DateEpreuve DESC", conn);
            cmd.Parameters.AddWithValue("@EleveId", eleveId);

            SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
                epreuves.Add(MapDetail(reader));
            reader.Close();
            conn.Close();

            return epreuves;
        }

        public void CreateEpreuve(Epreuve epreuve)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                @"INSERT INTO Epreuve (EleveIdEpreuve, TypeEpreuve, DateEpreuve, Resultat)
                  VALUES (@EleveId, @Type, @Date, @Resultat)", conn);
            cmd.Parameters.AddWithValue("@EleveId", epreuve.EleveIdEpreuve);
            cmd.Parameters.AddWithValue("@Type", epreuve.TypeEpreuve);
            cmd.Parameters.AddWithValue("@Date", epreuve.DateEpreuve.ToDateTime(TimeOnly.MinValue));
            cmd.Parameters.AddWithValue("@Resultat", epreuve.Resultat);
            cmd.ExecuteNonQuery();
            conn.Close();
        }

        public bool DeleteEpreuve(int id)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand("DELETE FROM Epreuve WHERE IdEpreuve = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);
            int nbLignes = cmd.ExecuteNonQuery();
            conn.Close();
            return nbLignes > 0;
        }

        private static EpreuveDetail MapDetail(SqlDataReader reader)
        {
            return new EpreuveDetail
            {
                IdEpreuve = (int)reader["IdEpreuve"],
                EleveIdEpreuve = (int)reader["EleveIdEpreuve"],
                NomEleve = (string)reader["NomEleve"],
                PrenomEleve = (string)reader["PrenomEleve"],
                TypeEpreuve = (string)reader["TypeEpreuve"],
                DateEpreuve = DateOnly.FromDateTime((DateTime)reader["DateEpreuve"]),
                Resultat = (bool)reader["Resultat"]
            };
        }
    }
}
