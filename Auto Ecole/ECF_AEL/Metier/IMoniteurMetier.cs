using ECF_AEL.Models;

namespace ECF_AEL.Metier
{
    public interface IMoniteurMetier
    {
        List<Moniteur> GetAllMoniteurs();
        Moniteur? GetMoniteurById(int id);
        void CreateMoniteur(Moniteur moniteur);
        bool UpdateMoniteur(Moniteur moniteur);
        bool ActiverMoniteur(int id);
        bool DesactiverMoniteur(int id);
        bool DeleteMoniteur(int id);
    }
}
