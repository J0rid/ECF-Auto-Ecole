using ECF_AEL.Models;

namespace ECF_AEL.Metier
{
    public interface IEleveMetier
    {
        List<Eleve> GetAll();
        Eleve? GetById(int id);
        void Create(Eleve eleve);
        bool Update(Eleve eleve);
        bool Delete(int id);
    }
}
