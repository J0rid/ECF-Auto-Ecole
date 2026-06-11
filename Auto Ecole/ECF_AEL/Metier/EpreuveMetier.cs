using ECF_AEL.Models;
using ECF_AEL.Repository;

namespace ECF_AEL.Metier
{
    public class EpreuveMetier : IEpreuveMetier
    {
        private readonly IEpreuveRepository _epreuveRepository;
        private readonly IEleveRepository _eleveRepository;

        private static readonly string[] TypesValides = ["Code", "Conduite"];

        public EpreuveMetier(IEpreuveRepository epreuveRepository, IEleveRepository eleveRepository)
        {
            _epreuveRepository = epreuveRepository;
            _eleveRepository = eleveRepository;
        }

        public List<EpreuveDetail> GetAll() => _epreuveRepository.GetAllEpreuves();

        public List<EpreuveDetail> GetByEleve(int eleveId) => _epreuveRepository.GetEpreuvesByEleve(eleveId);

        public (bool Success, string? Erreur) Create(Epreuve epreuve)
        {
            if (!TypesValides.Contains(epreuve.TypeEpreuve))
                return (false, "TypeEpreuve doit être 'Code' ou 'Conduite'.");

            if (_eleveRepository.GetEleveById(epreuve.EleveIdEpreuve) == null)
                return (false, $"Élève {epreuve.EleveIdEpreuve} introuvable.");

            _epreuveRepository.CreateEpreuve(epreuve);

            if (epreuve.Resultat)
            {
                if (epreuve.TypeEpreuve == "Code")
                    _eleveRepository.SetCodeEleve(epreuve.EleveIdEpreuve, true);
                else
                    _eleveRepository.SetConduiteEleve(epreuve.EleveIdEpreuve, true);
            }

            return (true, null);
        }

        public bool Delete(int id) => _epreuveRepository.DeleteEpreuve(id);
    }
}
