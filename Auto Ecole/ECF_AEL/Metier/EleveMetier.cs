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

        public List<Eleve> GetAll() => _eleveRepository.GetAllEleves();

        public Eleve? GetById(int id) => _eleveRepository.GetEleveById(id);

        public void Create(Eleve eleve)
        {
            eleve.Code = false;
            eleve.Conduite = false;
            eleve.DateInscription = DateOnly.FromDateTime(DateTime.Today);
            _eleveRepository.CreateEleve(eleve);
        }

        public bool Update(Eleve eleve)
        {
            if (_eleveRepository.GetEleveById(eleve.IdEleve) == null) return false;
            _eleveRepository.UpdateEleve(eleve);
            return true;
        }

        public bool Delete(int id)
        {
            if (_eleveRepository.GetEleveById(id) == null) return false;
            _eleveRepository.DeleteEleve(id);
            return true;
        }
    }
}
