using ECF_AEL.Models;
using ECF_AEL.Repository;

namespace ECF_AEL.Metier
{
    public class StatsMetier : IStatsMetier
    {
        private readonly IStatsRepository _statsRepository;

        public StatsMetier(IStatsRepository statsRepository)
        {
            _statsRepository = statsRepository;
        }

        public StatsTauxReussite GetTauxReussiteAnneeCourante()
        {
            int annee = DateTime.Today.Year;
            List<(string Type, int Total, int Reussites)> lignes = _statsRepository.GetStatsTauxReussiteParType(annee);

            StatsTauxReussite stats = new StatsTauxReussite { Annee = annee };

            foreach ((string type, int total, int reussites) in lignes)
            {
                StatsTypeEpreuve stat = new StatsTypeEpreuve
                {
                    Total = total,
                    Reussites = reussites,
                    Taux = total > 0 ? Math.Round((double)reussites / total * 100, 1) : 0
                };

                if (type == "Code") stats.Code = stat;
                else if (type == "Conduite") stats.Conduite = stat;
            }

            return stats;
        }

        public List<StatsEchecMultiple> GetElevesEchecMultiple(int seuilEchecs = 2)
            => _statsRepository.GetStatsEchecMultiple(seuilEchecs);
    }
}
