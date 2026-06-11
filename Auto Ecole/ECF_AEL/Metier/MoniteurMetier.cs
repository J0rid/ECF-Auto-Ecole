using ECF_AEL.Models;
using ECF_AEL.Repository;

namespace ECF_AEL.Metier
{
    public class MoniteurMetier : IMoniteurMetier
    {
        private readonly IMoniteurRepository _moniteurRepository;

        public MoniteurMetier(IMoniteurRepository moniteurRepository)
        {
            _moniteurRepository = moniteurRepository;
        }

        public List<Moniteur> GetAll() => _moniteurRepository.GetAllMoniteurs();

        public Moniteur? GetById(int id) => _moniteurRepository.GetMoniteurById(id);

        public void Create(Moniteur moniteur)
        {
            moniteur.Activite = true;
            _moniteurRepository.CreateMoniteur(moniteur);
        }

        public bool Update(Moniteur moniteur)
        {
            if (_moniteurRepository.GetMoniteurById(moniteur.IdMoniteur) == null) return false;
            _moniteurRepository.UpdateMoniteur(moniteur);
            return true;
        }

        public bool Activer(int id)
        {
            if (_moniteurRepository.GetMoniteurById(id) == null) return false;
            _moniteurRepository.SetActiviteMoniteur(id, true);
            return true;
        }

        public bool Desactiver(int id)
        {
            if (_moniteurRepository.GetMoniteurById(id) == null) return false;
            _moniteurRepository.SetActiviteMoniteur(id, false);
            return true;
        }

        public bool Delete(int id)
        {
            if (_moniteurRepository.GetMoniteurById(id) == null) return false;
            _moniteurRepository.DeleteMoniteur(id);
            return true;
        }
    }
}
