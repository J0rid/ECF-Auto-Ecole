using ECF_AEL.Models;

namespace ECF_AEL.Metier
{
    public interface IEpreuveMetier
    {
        List<EpreuveDetail> GetAllEpreuves();
        List<EpreuveDetail> GetEpreuvesByEleve(int eleveId);
        (bool Success, string? Erreur) CreateEpreuve(Epreuve epreuve);
        bool DeleteEpreuve(int id);
    }
}
