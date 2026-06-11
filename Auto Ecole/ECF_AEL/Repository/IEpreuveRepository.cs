using ECF_AEL.Models;

namespace ECF_AEL.Repository
{
    public interface IEpreuveRepository
    {
        List<EpreuveDetail> GetAllEpreuves();
        List<EpreuveDetail> GetEpreuvesByEleve(int eleveId);
        void CreateEpreuve(Epreuve epreuve);
        bool DeleteEpreuve(int id);
    }
}
