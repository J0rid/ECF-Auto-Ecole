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

        public List<Moniteur> GetAllMoniteurs() => _moniteurRepository.GetAllMoniteurs();

        public Moniteur? GetMoniteurById(int id) => _moniteurRepository.GetMoniteurById(id);

        public void CreateMoniteur(Moniteur moniteur)
        {
            moniteur.Activite = true;
            _moniteurRepository.CreateMoniteur(moniteur);
        }

        public bool UpdateMoniteur(Moniteur moniteur)
        {
            if (_moniteurRepository.GetMoniteurById(moniteur.IdMoniteur) == null) return false;
            _moniteurRepository.UpdateMoniteur(moniteur);
            return true;
        }

        public bool ActiverMoniteur(int id)
        {
            if (_moniteurRepository.GetMoniteurById(id) == null) return false;
            _moniteurRepository.SetActiviteMoniteur(id, true);
            return true;
        }

        public bool DesactiverMoniteur(int id)
        {
            if (_moniteurRepository.GetMoniteurById(id) == null) return false;
            _moniteurRepository.SetActiviteMoniteur(id, false);
            return true;
        }

        public bool DeleteMoniteur(int id)
        {
            if (_moniteurRepository.GetMoniteurById(id) == null) return false;
            _moniteurRepository.DeleteMoniteur(id);
            return true;
        }
    }
}
