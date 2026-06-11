using ECF_AEL.Models;

namespace ECF_AEL.Metier
{
    public interface IAuthMetier
    {
        LoginResponse? Login(LoginRequest request);
    }
}
