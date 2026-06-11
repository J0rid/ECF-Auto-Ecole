using ECF_AEL.Models;

namespace ECF_AEL.Metier
{
    public interface IStatsMetier
    {
        StatsTauxReussite GetTauxReussiteAnneeCourante();
        List<StatsEchecMultiple> GetElevesEchecMultiple(int seuilEchecs = 2);
    }
}
