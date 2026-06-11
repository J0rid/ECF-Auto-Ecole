using ECF_AEL.Models;

namespace ECF_AEL.Repository
{
    public interface IMoniteurRepository
    {
        List<Moniteur> GetAllMoniteurs();
        Moniteur? GetMoniteurById(int id);
        void CreateMoniteur(Moniteur moniteur);
        void UpdateMoniteur(Moniteur moniteur);
        void SetActiviteMoniteur(int id, bool activite);
        void DeleteMoniteur(int id);
    }
}
