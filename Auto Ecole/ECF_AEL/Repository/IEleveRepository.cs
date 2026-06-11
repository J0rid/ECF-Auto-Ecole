using ECF_AEL.Models;

namespace ECF_AEL.Repository
{
    public interface IEleveRepository
    {
        List<Eleve> GetAllEleves();
        Eleve? GetEleveById(int id);
        void CreateEleve(Eleve eleve);
        void UpdateEleve(Eleve eleve);
        void SetCodeEleve(int id, bool value);
        void SetConduiteEleve(int id, bool value);
        void DeleteEleve(int id);
    }
}
