using Auto_Ecole.Outils;
using ECF_AEL.Models;
using Microsoft.Data.SqlClient;

namespace ECF_AEL.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly Connexion _connexion;

        public UserRepository(Connexion connexion)
        {
            _connexion = connexion;
        }

        public User? GetUserByLogin(string login)
        {
            SqlConnection conn = _connexion.GetConnection();
            conn.Open();

            SqlCommand cmd = new SqlCommand(
                @"SELECT u.IdUser, u.NomUser, u.PrenomUser, u.Login, u.MotDePasse, u.IdRole, r.NomRole
                  FROM Users u
                  INNER JOIN Role r ON u.IdRole = r.IdRole
                  WHERE u.Login = @Login", conn);

            cmd.Parameters.AddWithValue("@Login", login);

            SqlDataReader reader = cmd.ExecuteReader();
            if (!reader.Read())
            {
                reader.Close();
                conn.Close();
                return null;
            }

            User user = new User
            {
                IdUser = (int)reader["IdUser"],
                NomUser = (string)reader["NomUser"],
                PrenomUser = (string)reader["PrenomUser"],
                Login = (string)reader["Login"],
                MotDePasse = (string)reader["MotDePasse"],
                IdRole = (int)reader["IdRole"],
                NomRole = (string)reader["NomRole"]
            };

            reader.Close();
            conn.Close();
            return user;
        }
    }
}
