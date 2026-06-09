using Microsoft.Data.SqlClient;
namespace Auto_Ecole.Outils
{
    public class Connexion
    {
        private readonly string _connectionString =
            "Data Source=localhost\\CDA2026;Initial Catalog=ECF_AEL_CDA;User Id=sa;Password=LeJorid;TrustServerCertificate=True;";

        public SqlConnection GetConnection()
        {
            return new SqlConnection(_connectionString);
        }
    }
}
