using ECF_AEL.Models;

namespace ECF_AEL.Metier
{
    public interface IEpreuveMetier
    {
        List<EpreuveDetail> GetAll();
        List<EpreuveDetail> GetByEleve(int eleveId);
        (bool Success, string? Erreur) Create(Epreuve epreuve);
        bool Delete(int id);
    }
}
