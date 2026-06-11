using ECF_AEL.Models;

namespace ECF_AEL.Repository
{
    public interface IStatsRepository
    {
        List<(string Type, int Total, int Reussites)> GetStatsTauxReussiteParType(int annee);
        List<StatsEchecMultiple> GetStatsEchecMultiple(int seuilEchecs);
    }
}
