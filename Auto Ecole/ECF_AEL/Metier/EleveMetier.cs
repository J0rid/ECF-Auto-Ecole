using ECF_AEL.Models;
using ECF_AEL.Repository;

namespace ECF_AEL.Metier
{
    public class EleveMetier : IEleveMetier
    {
        private readonly IEleveRepository _eleveRepository;

        public EleveMetier(IEleveRepository eleveRepository)
        {
            _eleveRepository = eleveRepository;
        }

        public List<Eleve> GetAllEleves() => _eleveRepository.GetAllEleves();

        public Eleve? GetEleveById(int id) => _eleveRepository.GetEleveById(id);

        public void CreateEleve(Eleve eleve)
        {
            eleve.Code = false;
            eleve.Conduite = false;
            eleve.DateInscription = DateOnly.FromDateTime(DateTime.Today);
            _eleveRepository.CreateEleve(eleve);
        }

        public bool UpdateEleve(Eleve eleve)
        {
            if (_eleveRepository.GetEleveById(eleve.IdEleve) == null) return false;
            _eleveRepository.UpdateEleve(eleve);
            return true;
        }

        public bool DeleteEleve(int id)
        {
            if (_eleveRepository.GetEleveById(id) == null) return false;
            _eleveRepository.DeleteEleve(id);
            return true;
        }
    }
}
