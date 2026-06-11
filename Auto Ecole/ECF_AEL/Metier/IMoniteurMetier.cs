using ECF_AEL.Models;

namespace ECF_AEL.Metier
{
    public interface IMoniteurMetier
    {
        List<Moniteur> GetAll();
        Moniteur? GetById(int id);
        void Create(Moniteur moniteur);
        bool Update(Moniteur moniteur);
        bool Activer(int id);
        bool Desactiver(int id);
        bool Delete(int id);
    }
}
