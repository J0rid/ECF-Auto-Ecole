using ECF_AEL.Models;

namespace ECF_AEL.Repository
{
    public interface IUserRepository
    {
        User? GetUserByLogin(string login);
    }
}
