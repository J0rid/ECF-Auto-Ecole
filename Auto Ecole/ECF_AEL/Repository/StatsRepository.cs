using Auto_Ecole.Outils;
using ECF_AEL.Models;
using Microsoft.Data.SqlClient;

namespace ECF_AEL.Repository
{
    public class StatsRepository : IStatsRepository
    {
        private readonly Connexion _connexion;

        public StatsRepository(Connexion connexion)
        {
            _connexion = connexion;
        }

        public List<(string Type, int Total, int Reussites)> GetStatsTauxReussiteParType(int annee)
        {
            List<(string, int, int)> result = new List<(string, int, int)>();
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                @"SELECT TypeEpreuve,
                         COUNT(*) AS Total,
                         SUM(CASE WHEN Resultat = 1 THEN 1 ELSE 0 END) AS Reussites
                  FROM Epreuve
                  WHERE YEAR(DateEpreuve) = @Annee
                  GROUP BY TypeEpreuve", conn);
            cmd.Parameters.AddWithValue("@Annee", annee);

            SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
                result.Add(((string)reader["TypeEpreuve"], (int)reader["Total"], (int)reader["Reussites"]));
            reader.Close();
            conn.Close();

            return result;
        }

        public List<StatsEchecMultiple> GetStatsEchecMultiple(int seuilEchecs)
        {
            List<StatsEchecMultiple> result = new List<StatsEchecMultiple>();
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();
            SqlCommand cmd = new SqlCommand(
                @"SELECT e.IdEleve, e.NomEleve, e.PrenomEleve,
                         SUM(CASE WHEN ep.TypeEpreuve = 'Code'     AND ep.Resultat = 0 THEN 1 ELSE 0 END) AS NbEchecCode,
                         SUM(CASE WHEN ep.TypeEpreuve = 'Conduite' AND ep.Resultat = 0 THEN 1 ELSE 0 END) AS NbEchecConduite
                  FROM Eleve e
                  INNER JOIN Epreuve ep ON e.IdEleve = ep.EleveIdEpreuve
                  WHERE ep.Resultat = 0
                  GROUP BY e.IdEleve, e.NomEleve, e.PrenomEleve
                  HAVING COUNT(*) >= @Seuil
                  ORDER BY COUNT(*) DESC", conn);
            cmd.Parameters.AddWithValue("@Seuil", seuilEchecs);

            SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
                result.Add(new StatsEchecMultiple
                {
                    IdEleve = (int)reader["IdEleve"],
                    NomEleve = (string)reader["NomEleve"],
                    PrenomEleve = (string)reader["PrenomEleve"],
                    NbEchecCode = (int)reader["NbEchecCode"],
                    NbEchecConduite = (int)reader["NbEchecConduite"]
                });
            reader.Close();
            conn.Close();

            return result;
        }
    }
}
