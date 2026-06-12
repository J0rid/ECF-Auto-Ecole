using ECF_AEL.Models;

namespace ECF_AEL.Metier
{
    public interface IEleveMetier
    {
        List<Eleve> GetAllEleves();
        Eleve? GetEleveById(int id);
        void CreateEleve(Eleve eleve);
        bool UpdateEleve(Eleve eleve);
        bool DeleteEleve(int id);
    }
}
